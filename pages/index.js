import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Rabindra Nepal</title>
          <meta name="description" content="Rabindra Nepal's Space" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>Rabindra's</span> Space
          </h1>

          <div className={styles.profile}>
            <Image
              src="/public/profile.jpg"
              alt="Rabindra Nepal"
              width={200}
              height={200}
              className={styles.avatar}
            />
            <p className={styles.description}>
              Data Scientist | Physics PhD
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h2>About Me</h2>
              <p>Data Scientist and A PhD in Physics</p>
            </div>

            <div className={styles.card}>
              <h2>Skills</h2>
              <ul>
                <li>Data Science, Machine Learning, Generative AI</li>
                <li>Cloud Technologies (AWS, Azure)</li>
              </ul>
            </div>

            <div className={styles.card}>
              <h2>Let's Connect</h2>
              <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
              <a href="mailto:rabindranepal@yahoo.com" className={styles.button}>
                Email
              </a>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://github.com/rnepal2"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/nepalrabindra"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://x.com/ccRabindra"
            target="_blank"
            rel="noopener noreferrer"
          >
            X/Twitter
          </a>
        </footer>
      </div>
    </Layout>
  )
}
