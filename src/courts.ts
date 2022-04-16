import fetch from 'cross-fetch';


const SITE_LIST_ENDPOINT = 'https://app.bukza.com/api/timetables/getSettings/16509/15296';
const COURT_LIST_ENDPOINT = ({ userId, siteId }: { userId: number, siteId: number }) => (
  `https://app.bukza.com/api/resource-groups/getClientCatalog/${String(userId)}/${String(siteId)}?t=${new Date().getTime()}`
);

const fetchSites = async (headers: Record<string, string>) => {
  const resp = await fetch(`${SITE_LIST_ENDPOINT}?t=${new Date().getTime()}`, {
    headers,
    body: null,
    method: 'GET',
  });
  const { items, account: { userId } }: {
    account: { userId: number },
    timetable: { id: number, resourceGroupId: number },
    items: {
      resourceGroupId: number,
      name: string,
    }[],
  } = await resp.json();
  return {
    sites: items.map(({ name, resourceGroupId: id }) => ({ name, id })),
    userId,
  };
};

const fetchCourts = async (headers: Record<string, string>) => {
  const { sites, userId } = await fetchSites(headers);
  // avoid rate limiting with reduce
  const siteBySiteInfo: {
    name: string,
    items: {
      resourceId: number, name: string,
    }[],
    siteId: number,
  }[] = await sites.reduce(async (acc, { id: siteId }) => {
    const resp = await fetch(COURT_LIST_ENDPOINT({ siteId, userId }), {
      headers,
      body: null,
      method: 'GET',
    });
    const { name, items }: {
      name: string,
      items: {
        resourceId: number, name: string,
      }[],
    } = await resp.json();
    return [
      ...(await acc),
      {
        name,
        items: items.map(({ resourceId, name }) => ({
          resourceId, name,
        })),
        siteId,
      }
    ];
  }, Promise.resolve([]));
  return { courts: siteBySiteInfo, userId };
}

export default fetchCourts;
