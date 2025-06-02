---
layout: post
title: "Aqueous Solubility Prediction: A Comparative Study of QSPR and Graph Neural Networks"
date: 2025-05-31
---

<blockquote style="border-left: 4px solidrgb(95, 132, 205); padding-left: 1em; color: solidrgb(95, 132, 205); margin: 1.5em 0; font-style: italic;">
  “The molecule's 'mind' is its structure; its solubility, a meaning that crystallizes at points of interaction”
</blockquote>

## Introduction: Why Solubility is a Big Deal in Drug Discovery

**Aqueous solubility** – the extent to which a chemical compound can dissolve in water – is a pivotal physicochemical property in the realm of drug discovery and development. A drug candidate’s efficacy is often intrinsically linked to its bioavailability, which in turn is heavily influenced by its aqueous solubility. Compounds exhibiting poor solubility may suffer from inadequate absorption, thereby diminishing their therapeutic potential and increasing the likelihood of late-stage attrition in the drug development pipeline. Consequently, the early and accurate prediction of aqueous solubility is of paramount importance to accelerate the delivery of a new therapeutics.

In this project, we are testing two different class of prediction models to classify compounds as either "soluble" or "poorly soluble." We'll explore two computational tools for this:
1.  The **Quantitative Structure-Property Relationship (QSPR)** model – a well-respected conventional method in cheminformatics.
2.  The **Graph Convolutional Network (GCN)** – a more recent, cutting-edge approach using Graph Neural Networks (GNNs).

Let's see how they compare! If you're itching for all the technical details and code, feel free to explore the [GitHub repository](https://github.com/rnepal2/Solubility-Prediction-with-Graph-Neural-Networks).

## The Data: Source & Processing

Any machine learning adventure starts with good data. For this test, we used a dataset of about 9,000 small organic molecules, originally published in a [Nature Scientific article](https://www.nature.com/articles/s41597-019-0151-1). Each molecule in this collection comes with an experimentally measured aqueous solubility value, noted as **logS** (that's the logarithm of its molar solubility in mol/L).

**Turning logS into "Soluble" or "Insoluble":**
To classify compounds into two categories, we need to change those continuous logS values into straightforward "soluble" or "poorly soluble" labels, we did this using a common rule of thumb in drug discovery (see details in `analytics.ipynb` notebook):
*   If a compound's **logS is greater than -3.699** (meaning it dissolves better than 200 µM), we call it "soluble."
*   If its logS is -3.699 or less, it's tagged "poorly soluble."

The raw input for our models – **SMILES strings**, standardized one-line text codes that describe a molecule's structure. We then process these SMILES: for the QSPR model, we turn them into a set of numerical features (descriptors), and for the GCN, we build graph structures. And, naturally, we split our data into training and testing sets – you always want to check if your model can handle new, unseen data!

## Approach 1: QSPR with LightGBM Classifier

First, let us test **Quantitative Structure-Property Relationship (QSPR)** modeling. This is a classic cheminformatics technique that aims to find a mathematical connection between a molecule's physical structure and its properties (like solubility). The core idea? Calculate a set of numbers – called **molecular descriptors** – that capture different facets of a molecule. Then, let a machine learning model learn how these numbers relate to the property we care about.

**Generate Descriptors with RDKit & DeepChem:**
To generate these all-important molecular descriptors, we used **RDKit**, a powerhouse open-source toolkit for cheminformatics. We also tapped into its capabilities using **DeepChem's** `dc.feat.RDKitDescriptors` featurizer, which makes things pretty convenient. We opted for a specific set of 123 2D descriptors, leaving out things like fragment counts to keep our feature set focused. Here’s a little Python snippet to give you the flavor:

```python
import deepchem as dc
import pandas as pd

# df is a pandas DataFrame with a 'SMILES' column.
smiles_list = df['SMILES'].tolist()
rdkit_featurizer = dc.feat.RDKitDescriptors(use_fragment=False, ipc_avg=False)
# This gives us a NumPy array: rows are molecules, columns are descriptors.
molecular_descriptors = rdkit_featurizer(smiles_list) 
# Expected shape: (number_of_molecules, 123)
```

**Classifying with LightGBM:**
Once we have our descriptors, we can do predictive modelling for the classification. LightGBM is a super-fast and efficient gradient boosting method that's a popular choice for tasks like this. We trained it to tell "soluble" from "poorly soluble" compounds using their molecular descriptor profiles.

To squeeze the best performance out of LightGBM, we carefully tuned its settings (hyperparameters). Our main goal was to get the best **Area Under the ROC Curve (AUC)**, a really good measure for how well a model separates two classes. Here’s a peek at some typical parameters:

```python

params = {
    "objective": "binary",     
    "is_unbalance": "true",     
    "boosting_type": "dart",   
    "bagging_ratio": 0.6,       
    "feature_fraction": 0.6,    
    "metric": ["auc"],         
    # Other parameters like learning_rate, num_leaves, etc., are also tuned
}
# lgb.train(params, train_set, valid_sets=[valid_set], ...)
```
We trained the model using one part of our dataset and used another part (a validation set) to fine-tune these settings, ensuring it learned general patterns, not just memorizing the training data.

## Approach 2: Graph Convolutional Networks

Our second strategy takes us into the exciting world of **Graph Convolutional Networks (GCNs)**, a type of Graph Neural Network (GNN). What's cool about GCNs is that they understand molecules as they truly are: graphs of atoms (nodes) connected by bonds (edges). Instead of us hand-crafting descriptors, GCNs can learn the important features directly from this graph structure. This means they might spot complex patterns related to solubility that traditional descriptors could overlook. 

**Building Our GCN:**
We constructed our GCN using **PyTorch** and the **PyTorch Geometric** library – a fantastic combo for GNN development. The blueprint for our GCN (found in `model.py`) uses a series of graph convolutional layers (`GCNConv`). These layers work on features we initially assign to each atom (like its type, charge – about 30 features in total) and the molecule's connectivity map.

Here’s how our GCN processes a molecule:
1.  **Graph Convolutions:** It has three `GCNConv` layers. Think of these as message-passing steps where each atom gathers info from its neighbors to build up a richer understanding of its local environment. The size of these learned feature vectors (called hidden channels) shrinks as we go deeper (e.g., 128, then 64, then 32).
2.  **Activation Power-Up:** After each convolution, we apply a **ReLU** (`x.relu()`) function. This adds a bit of non-linearity, which is crucial for learning complex stuff (otherwise, it's all just simple linear relationships).
3.  **Molecule-Level Summary (Pooling):** A **global mean pooling** layer (`gap`) takes the final, refined features of all atoms and averages them. This condenses all that atomic info into a single vector that represents the entire molecule.
4.  **Keeping it Honest (Regularization):** Before the final decision, **Dropout** (`F.dropout`) randomly switches off some neurons. This sounds a bit odd, but it's a great trick to prevent the model from getting too attached to specific details in the training data (overfitting).
5.  **The Decision Layer:** A final **linear layer** takes the molecule's summary vector and makes the call.
6.  **Loss & Prediction Output:** We train the GCN using **Binary Cross-Entropy with Logits** (`BCEWithLogitsLoss`), a standard choice for yes/no prediction tasks. To get the final probability (how likely is this molecule to be "soluble"?), a **sigmoid** function squashes the output into the 0-to-1 range.

Here's what the core of the GCN class in `model.py` looks like:
```python
import torch
import torch.nn.functional as F 
from torch.nn import Linear
from torch_geometric.nn import GCNConv
from torch_geometric.nn import global_mean_pool as gap

class GCN(torch.nn.Module):
    def __init__(self, n_features, hidden_channels, dropout=0.2):
        super(GCN, self).__init__()
        torch.manual_seed(21)
        self.conv1 = GCNConv(n_features, hidden_channels)
        self.conv2 = GCNConv(hidden_channels, int(hidden_channels/2))
        self.conv3 = GCNConv(int(hidden_channels/2), int(hidden_channels/4))
        self.linear = Linear(int(hidden_channels/4), 1) # Output for binary (soluble/insoluble)
        self.dropout = dropout

    def forward(self, data, edge_index, batch):
        x, targets = data.x, data.y # Atom features and true labels
        # Message passing and feature learning
        x = self.conv1(x, edge_index)
        x = x.relu()
        x = self.conv2(x, edge_index)
        x = x.relu()
        x = self.conv3(x, edge_index)
        
        # Condense atom features to a single molecule-level feature vector
        x_pooled = gap(x, batch) 

        # Apply dropout
        x_dropout = F.dropout(x_pooled, p=self.dropout, training=self.training)

        # Get the raw output (logit) for classification
        out_logits = self.linear(x_dropout)
        
        # Calculate the training loss
        loss = torch.nn.BCEWithLogitsLoss()(out_logits, targets.reshape(-1, 1).type_as(out_logits))

        # Convert logit to probability for making predictions
        out_proba = torch.sigmoid(out_logits)
        return out_proba, loss
```

**Training and Fine-Tuning the GCN:**
We trained our GCN using PyTorch. A big part of making deep learning models sing is finding the right settings – hyperparameters like the learning rate, how many hidden channels to use, and the dropout rate. We used a smart search strategy (Bayesian optimization) to explore different combinations, and **Weights & Biases (wandb)** helped us keep track of all these experiments. You can see the details in our `hyperparameters search.ipynb` notebook. 

During training, the model's goal was to minimize the BCE loss, effectively learning to match its predictions with the true "soluble" or "poorly soluble" labels. We constantly checked its performance on a separate validation set to ensure it was learning generalizable patterns and not just memorizing the training examples.

## Results: How Did Our Models Do?

Alright, moment of truth! We pitted our QSPR LightGBM model against our GCN to see which one was better at classifying compounds as "soluble" or "insoluble." We used a test set of molecules the models had never encountered. (Quick reminder: "soluble" means logS > -3.699, based on our work in `analytics.ipynb`).

**The Scoreboard Highlights:**

Interestingly, in our hands and on this dataset, the classic QSPR LightGBM model actually pulled slightly ahead of the GCN:
*   **QSPR (LightGBM) Model:**
    *   AUC (validation): A very strong **~0.98**
    *   Accuracy (test): **93%**
    *   F1-Score (test, weighted avg): **0.93**
*   **GCN Model:**
    *   AUC (test): A respectable **~0.88**
    *   Accuracy (test): **85%**
    *   F1-Score (test, weighted avg): **0.85**

Let's unpack these numbers a bit:

*   **Area Under the ROC Curve (AUC):** This is a great all-around measure. It tells us how well the model can distinguish between the "soluble" and "insoluble" guys. 1.0 is perfect, 0.5 is just guessing. The QSPR's ~0.98 AUC is impressive!

*   **Accuracy:** This is the straightforward "what percentage did it get right?" The 93% for QSPR is solid.

*   **F1-Score:** This is a balanced score considering both false positives and false negatives. The 0.93 for QSPR is excellent.

You can find even more metrics like precision and recall in the classification reports within the `descriptor-based-model.ipynb` and `model training and evaluation.ipynb` notebooks.

**What This Might Mean:**
The QSPR model's win here was a neat result! While GCNs are very powerful for learning from raw molecular structures, it seems that for this particular dataset and task, the 123 carefully chosen 2D descriptors gave the LightGBM model a very effective set of clues to work with.
*   The QSPR model's high **AUC and Accuracy** show it was generally very reliable.
*   A detailed look at its **confusion matrix** would tell us more about the types of mistakes it made (or avoided!).
*   The strong **F1-score** means it struck a good balance in its predictions.

**A Quick Take on Strengths & Weaknesses (from this study):**

*   **Descriptor-based (LightGBM/QSPR):**
    *   *Shone here!* Generally quicker to train. Plus, it's easier to see which molecular features (descriptors) were most important for its decisions.
    *   *But,* its success hinges on those initial descriptors being good ones.

*   **Graph Convolutional Network (GCN):**
    *   *The cool part:* It learns features on its own from the molecule's graph. With more data, it might even generalize better to totally new types of molecules.
    *   *But,* in our case, it didn't quite top the QSPR. GCNs often need lots of data, can be trickier to tune, and are sometimes seen as "black boxes" because figuring out *why* they made a certain prediction can be complex.

**Good to Keep in Mind:**
Science is all about context! Our dataset had about 9,000 molecules – pretty good, but deep learning models like GCNs sometimes get even better with huge amounts of data. Also, just splitting solubility into two classes is a simplification of a continuous property. And, of course, we only tried specific versions of QSPR and GCN models; others might perform differently. The ultimate test? Seeing how these predictions hold up in the lab!

## Conclusion and Future Outlook

So, what did we learn? In our face-off between a QSPR (LightGBM) model and a GCN for classifying aqueous solubility, the QSPR method came out slightly on top based on key metrics like AUC and accuracy. It's a great reminder that while newer methods like GCNs are exciting and powerful, traditional approaches with well-chosen features can still be highly competitive, especially when you value speed and being able to easily interpret the model's reasoning.

This project is just a one example test of what is possible. There are many exciting ways to push this further:

*   **Beyond Yes/No (Regression):** Instead of just classifying, we could train models (both QSPR and GCNs) to predict the actual logS value. This gives much finer-grained information that's super useful for drug development.
*   **Trying New Model Flavors:** We could experiment with different types of GNNs (like Graph Attention Networks, which can weigh the importance of different atoms) or explore other QSPR algorithms and a wider array of molecular descriptors.
*   **Bigger, More Diverse Data:** Training these models on even larger and more varied collections of chemical data could make them more robust and better at predicting for totally new molecules.
*   **Peeking Inside the "Black Box" (Interpretability):** For QSPR models, we can often see which descriptors are most important. For GCNs, digging into techniques like attention mechanisms or identifying which parts of a molecule the GNN "looks at" can help us understand their decision-making. This builds trust and can even give chemists new ideas!
*   **Best of Both Worlds (Hybrid Models):** Why not try to combine the interpretability and speed of QSPR with the feature-learning power of GNNs? Hybrid models are a promising area.
*   **Predictions with Confidence (Conformal Prediction):** Wouldn't it be great if a model could say, "I predict this is soluble, and I'm 90% sure"? Conformal prediction frameworks can add this kind of statistically sound confidence level to predictions, which is incredibly valuable for making go/no-go decisions.

Want to see the code and dig deeper? Check out the full project on my [GitHub repo](https://github.com/rnepal2/Solubility-Prediction-with-Graph-Neural-Networks)!
