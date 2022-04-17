import _ from 'lodash';
import fs from 'fs';
import fastifyApp from 'fastify';
import moment from 'moment';
import fetchAuthHeader from './headerFetch';
import fetchCourts from './courts';
import fetchAvailabilities from './availabilities';

const targetDate = moment('04/17/2022', 'MM/DD/YYYY').toDate();

const fastify = fastifyApp({ logger: true })

type SiteData = {
  [startDate: string]: {
    startDate: string,
    endDate: string,
    courtResourceId: string,
    courtName: string,
  }[]
};

fastify.get('/', async (request, reply) => {
  const headers = await fetchAuthHeader();
  const { courts, userId, timeTableId } = await fetchCourts(headers);
  const availableBlocks = await fetchAvailabilities({ targetDate, courts, headers, userId });
  const siteMapping = _.keyBy(courts, 'siteId');
  const courtResourceMapping = _.keyBy(
    _.flatten(courts.map(({ items, name: siteName, siteId }) => (
      items.map(({ resourceId: courtResourceId, name: courtName }) => ({
        courtResourceId, courtName, siteName, siteId: String(siteId),
      }))))),
      'courtResourceId',
    );

  const groupedBlocks: Record<string, SiteData> = availableBlocks.reduce((acc: Record<string, SiteData>, { startDate, endDate, resourceId }) => {
    const { siteId, courtName } = courtResourceMapping[resourceId];
    return {
      ...acc,
      [siteId]: {
        ...(acc[siteId] || {}),
        [startDate]: [
          ...((acc[siteId] || {})[startDate] || []),
          {
            startDate, endDate, courtResourceId: resourceId, courtName,
          },
        ],
      },
    }
  }, {});

  await fs.promises.writeFile(
    __dirname + '/../frontend/pages/availabilities.json',
    JSON.stringify({
      userId,
      timeTableId,
      lastUpdated: new Date().getTime(),
      courts: _.toPairs(groupedBlocks)
        .map(([siteId, blockData]) => ({
          siteId, siteName: siteMapping[siteId].name, blockData,
        })),
    }),
  );

  return { success: true };
})

const SERVER_PORT = 5000;

fastify.register(require('fastify-cors'), function () {
  return (req: any, callback: Function) => {
    let corsOptions;
    const origin = req.headers.origin
    // do not include CORS headers for requests from localhost
    const hostname = new URL(origin).hostname
    if(hostname === "localhost"){
      corsOptions = { origin: false }
    } else {
      corsOptions = { origin: true }
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
  }
});

const start = async () => {
  try {
    const hostedURL = await fastify.listen(SERVER_PORT)
    await fs.promises.writeFile(
      __dirname + '/../frontend/pages/server.json',
      JSON.stringify({
        url: hostedURL,
      }),
    );
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
