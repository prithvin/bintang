import type { NextPage } from 'next'
import _ from 'lodash';
import { Card } from 'react-bootstrap';
import availabilities from './availabilities.json';
import ReloadButton from './ReloadButton';
import TimeBlock from './TimeBlock';

const Home: NextPage = () => {
  return (
    <div className="bg-light h-100 py-3 px-2">
      <ReloadButton />
      {availabilities != null && (
        <div className="border-top mt-4 p-3 d-flex flex-wrap justify-content-between w-100">
          {availabilities.courts.map(({ siteId, siteName, blockData }) => (
            <Card className="p-3 w-25 mx-2 my-3" key={siteId}>
              <div className="text-large text-secondary">
                {siteName}
              </div>
              {_.toPairs(blockData).map(([startTime, courtBlocks]) => (
                <TimeBlock currentTime={startTime} availabilityBlocks={courtBlocks} />
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home
