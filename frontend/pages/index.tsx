import type { NextPage } from 'next'
import Head from 'next/head'
import cx from 'classnames';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import availabilities from './availabilities.json';
import server from './server.json';

const Home: NextPage = () => {
  const [refetching, setRefetching] = useState(false);
  useEffect(() => {
    if (refetching) {
      axios.get(`${server.url}/`)
        .then(function (response) {
          // handle success
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [refetching]);
  return (
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
        <Button
          variant={availabilities == null ? 'danger' : 'primary'}
          className="px-3 py-2 d-block mx-auto my-3"
        >
          {availabilities == null && (
            'Fetch Available Blocks'
          )}
          {availabilities != null && (
            'Reload Available Blocks'
          )}
        </Button>
      )}
    </div>
  );
}

export default Home
