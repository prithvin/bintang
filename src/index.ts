import _ from 'lodash';
import fetchAuthHeader from './headerFetch';
import fetchCourts from './courts';

const scrapeBintang = async () => {
  const headers = await fetchAuthHeader();
  console.log(await fetchCourts(headers));
}

scrapeBintang();
