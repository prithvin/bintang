import type { NextPage } from 'next'
import { useState } from 'react';
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './TimeBlock.module.scss';

type Props = {
  currentTime: string,
  availabilityBlocks: {
    startDate: string,
    endDate: string,
    courtResourceId: string,
    courtName: string,
  }[],
};

const TimeBlock: NextPage<Props> = ({
  currentTime, availabilityBlocks
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-light mt-2 border rounded ">
      <Button
        className="d-block w-100"
        variant="light"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div className="flex-0-0">{currentTime}</div>
          <FontAwesomeIcon className={styles.carrotIcon} size="xs" icon={expanded ? faAngleUp : faAngleDown} />
        </div>
      </Button>
      {expanded && JSON.stringify(availabilityBlocks)}
    </div>
  );
}

export default TimeBlock;
