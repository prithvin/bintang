import type { NextPage } from 'next'
import { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button } from 'react-bootstrap';
import availabilities from './availabilities.json';
import server from './server.json';

dayjs.extend(relativeTime);

const ReloadButton: NextPage = () => {
  const [refetching, setRefetching] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (refetching) {
      axios.get(`${server.url}/`)
        .then(function (response) {
          setRefetching(false);
          window.location.reload();
        })
        .catch(function (error) {
          setError(error);
        })
    }
  }, [refetching]);
  return (
    <>
      {error && (
        <div className="p-3 display-6 bg-danger text-white text-center">
          {error}
        </div>
      )}
      <Button
        variant={availabilities == null ? 'danger' : 'primary'}
        className="px-3 py-2 d-block mx-auto mt-3 mb-2"
        onClick={() => {
          setRefetching(true);
        }}
        disabled={refetching}
      >
        {availabilities == null && (
          'Fetch Available Blocks'
        )}
        {availabilities != null && (
          'Reload Available Blocks'
        )}
        {refetching && (
          <div className="text-center text-small">
            Loading...
          </div>
        )}
      </Button>
      <div className="text-small text-secondary text-center">
        {`Last loaded ${availabilities == null ? 'never' : dayjs(availabilities.lastUpdated).fromNow()}`}
      </div>
    </>
  );
}

export default ReloadButton
