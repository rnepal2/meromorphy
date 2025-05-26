---
layout: post
title: Contact Me
permalink: /contact/
hide_meta: true
---


<div style="text-align:start; margin-bottom: 1.5em; margin-top: 2em; font-style: italic;">
  If you'd like to get in touch or have any questions for me, please use the form below.
</div>

<div style="display: flex; justify-content: center; align-items: center;">
  <form
    action="https://formspree.io/f/mldbypra"
    method="POST"
    style="
      background: var(--bg-secondary, #23272f);
      color: var(--text, #adb5bd);
      padding: 2.5em 2em;
      border-radius: 1em;
      box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
      max-width: 720px;
      width: 100%;
      font-family: inherit;
    "
  >
    <label for="email" style="font-weight: 600; display:block; margin-bottom:0.5em;">Your email</label>
    <input type="email" id="email" name="email" required style="
      width: 100%;
      padding: 0.7em;
      margin-bottom: 1.2em;
      border: 1px solid var(--bg, #1f242A);
      border-radius: 0.4em;
      background: var(--bg, #1f242A);
      color: var(--text, #adb5bd);
      font-size: 1em;
    ">

    <label for="subject" style="font-weight: 600; display:block; margin-bottom:0.5em;">Subject</label>
    <input type="text" id="subject" name="subject" style="
      width: 100%;
      padding: 0.7em;
      margin-bottom: 1.2em;
      border: 1px solid var(--bg, #1f242A);
      border-radius: 0.4em;
      background: var(--bg, #1f242A);
      color: var(--text, #adb5bd);
      font-size: 1em;
    ">

    <label for="message" style="font-weight: 600; display:block; margin-bottom:0.5em;">Your message</label>
    <textarea id="message" name="message" rows="6" required style="
      width: 100%;
      padding: 0.7em;
      margin-bottom: 1.5em;
      border: 1px solid var(--bg, #1f242A);
      border-radius: 0.4em;
      background: var(--bg, #1f242A);
      color: var(--text, #adb5bd);
      font-size: 1em;
      resize: vertical;
    "></textarea>

    <button type="submit" style="
      background: var(--links,rgb(28, 29, 61));
      color: #fff;
      border: none;
      border-radius: 0.4em;
      padding: 0.7em 2em;
      font-size: 1em;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.2s;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
    " onmouseover="this.style.background='#4f46e5'" onmouseout="this.style.background='var(--links, #6366f1)'">
      Send
    </button>
  </form>
</div>