import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Bintang Scraping Application</title>
        <meta name="description" content="Bintang Scraping Application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl font-bold underline">
        Bintang Frontend
      </h1>
    </div>
  )
}

export default Home
