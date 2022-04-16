import fetch from 'cross-fetch';
import _ from 'lodash';
import moment from 'moment';
import { generatePostRequestHeaders } from './apiHelper';


const fetchAvailabilities = async ({ targetDate, courts, headers, userId }: {
  headers: Record<string, string>,
  userId: number,
  targetDate: Date,
  courts: {
    name: string,
    items: {
      resourceId: number, name: string,
    }[],
    siteId: number,
  }[],
}): Promise<{
  resourceId: number,
  blocks: { startDate: string, endDate: string }[],
}[]> => {
  const bukzaStartDate = moment(targetDate).startOf('day').toDate().toISOString()
  const availabities = await fetch(`https://app.bukza.com/api/clientReservations/getAvailability/${userId}?t=${new Date().getTime()}`, {
    ...generatePostRequestHeaders(headers),
    body: JSON.stringify({
      reservationId: null,
      resourceIds: _.flatten(courts.map(({ items }) => items.map(({ resourceId }) => resourceId))),
      date: bukzaStartDate,
      includeWorkRuleNames: false,
      includeHours: false,
      dayCount: 1,
      includeRentalPoints: true,
    }),
  });
  const { resources }: {
    resources: {
      resourceId: number,
      days: { // only fetching for one day, so array of one
        date: string,
        levels: {
          shares: number,
          value: number,
          total: number, // if there is availability, shares > 0
          startDate: string,
          endDate: string,
        }[],
      }[]
    }[]
  } = await availabities.json();
  const availableBlocks = resources
    .map(({ resourceId, days }) => ({
      resourceId,
      blocks: _.head(days).levels
        .filter(({ shares }) => (shares > 0 ))
        .map(({ startDate, endDate }) => ({
          startDate: moment(startDate).format('MM/DD hh:mm'),
          endDate: moment(endDate).format('MM/DD hh:mm'),
        })),
    }))
    .filter(({ blocks }) => blocks.length > 0);
  return availableBlocks;
};


export default fetchAvailabilities;
