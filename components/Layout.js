import Head from 'next/head'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="John Doe's professional portfolio and blog"
        />
        <meta name="og:title" content="John Doe - Professional Portfolio" />
      </Head>

      <main className="flex-grow">{children}</main>
      
      <footer className="w-full h-24 border-t border-gray-200 flex justify-center items-center">
        © {new Date().getFullYear()} John Doe. All rights reserved.
      </footer>
    </div>
  )
}
