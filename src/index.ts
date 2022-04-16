import _ from 'lodash';
import fetchAuthHeader from './headerFetch';
import fetchCourts from './courts';
import fetchAvailabilities from './availabilities';

const scrapeBintang = async () => {
  const headers = await fetchAuthHeader();
  const { courts, userId } = await fetchCourts(headers);
  const availableBlocks = await fetchAvailabilities({ courts, headers, userId });
  const courtResourceMapping = _.keyBy(_.flatten(courts
    .map(({ items }) => items)), 'resourceId');
  console.log(JSON.stringify(
    availableBlocks.map(({ resourceId, blocks }) => ({
      resourceId, blocks, name: courtResourceMapping[resourceId].name,
    }))
  ));
}

scrapeBintang();
