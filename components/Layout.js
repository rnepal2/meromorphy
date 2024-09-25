import Head from 'next/head'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="John Doe's professional portfolio and blog"
        />
        <meta name="og:title" content="John Doe - Professional Portfolio" />
      </Head>

      <main className={styles.main}>{children}</main>
      
      <footer className={styles.footer}>
        © {new Date().getFullYear()} John Doe. All rights reserved.
      </footer>
    </div>
  )
}
