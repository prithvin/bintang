import _ from 'lodash';
import fs from 'fs';
import ngrok from 'ngrok';
import fastifyApp from 'fastify';
import moment from 'moment';
import fetchAuthHeader from './headerFetch';
import fetchCourts from './courts';
import fetchAvailabilities from './availabilities';

const targetDate = moment('04/17/2022', 'MM/DD/YYYY').toDate();

const fastify = fastifyApp({ logger: true })

fastify.get('/', async (request, reply) => {
  const headers = await fetchAuthHeader();
  const { courts, userId, timeTableId } = await fetchCourts(headers);
  const availableBlocks = await fetchAvailabilities({ targetDate, courts, headers, userId });
  const courtResourceMapping = _.keyBy(_.flatten(courts
    .map(({ items }) => items)), 'resourceId');
  await fs.promises.writeFile(
    __dirname + '/../frontend/pages/availabilities.json',
    JSON.stringify({
      userId,
      timeTableId,
      blocks: availableBlocks.map(({ resourceId, blocks }) => ({
        resourceId, blocks, name: courtResourceMapping[resourceId].name,
      }))
    }),
  );

  return { success: true };
})

const SERVER_PORT = 5000;

const start = async () => {
  try {
    await fastify.listen(SERVER_PORT)
    const url = await ngrok.connect();
    await fs.promises.writeFile(
      __dirname + '/../frontend/pages/server.json',
      JSON.stringify({
        url,
      }),
    );
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
