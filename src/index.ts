import _ from 'lodash';
import moment from 'moment';
import fetchAuthHeader from './headerFetch';
import fetchCourts from './courts';
import fetchAvailabilities from './availabilities';

const targetDate = moment('04/17/2022', 'MM/DD/YYYY').toDate();
const scrapeBintang = async () => {
  const headers = await fetchAuthHeader();
  const { courts, userId, timeTableId } = await fetchCourts(headers);
  const availableBlocks = await fetchAvailabilities({ targetDate, courts, headers, userId });
  const courtResourceMapping = _.keyBy(_.flatten(courts
    .map(({ items }) => items)), 'resourceId');
  console.log(JSON.stringify({
    userId,
    timeTableId,
    blocks: availableBlocks.map(({ resourceId, blocks }) => ({
      resourceId, blocks, name: courtResourceMapping[resourceId].name,
    }))
  }));
}

scrapeBintang();
