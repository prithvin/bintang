import fetch from 'cross-fetch';


const COURT_URL = 'https://app.bukza.com/api/timetables/getSettings/16509/15296';

const fetchCourts = async (headers: Record<string, string>) => {
  const resp = await fetch(`${COURT_URL}?t=${new Date().getTime()}`, {
    headers,
    body: null,
    method: 'GET',
  });
  const timetablePayload: {
    account: { userId: number },
    timetable: { id: number, resourceGroupId: number },
    items: {
      resourceGroupId: number,
      name: string,
    }[],
  } = await resp.json();
  console.log(timetablePayload.items.map(({ name }) => (name)));

};


export default fetchCourts;
