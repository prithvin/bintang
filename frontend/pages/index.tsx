import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from 'react-bootstrap';
import Blocks from './Blocks';
import server from './server.json';

const Home: NextPage = () => (
  <div className="bg-light h-100 py-3 px-2">
    <Head>
      <title>Bintang Scraping Application</title>
      <meta name="description" content="Bintang Scraping Application" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    {server.url == null && (
      <div className="w-100 bg-warning p-5 display-6 text-center">
        Please turn on your backend to get started
        <Button
          variant="danger"
          className="px-3 py-2 d-block mx-auto mt-5"
          onClick={() => {
            window.location.reload();
          }}
        >
          Try again
        </Button>
      </div>
    )}
    {server.url != null && (
      <Blocks />
    )}
  </div>
);

export default Home
