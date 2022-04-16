import _ from 'lodash';
import { remote, Browser } from 'webdriverio';

const BUKZA_URL = 'https://app.bukza.com';
const SOURCE_URL = 'https://bintangbadminton.org';

const navigateToBukza = async ({ bukzaFrameURL, browser }: {
  bukzaFrameURL: string, browser: Browser<'async'>,
}): Promise<Record<string, string>> => (
  new Promise(async (resolve) => {
    // setup request interception
    const puppeteer = await browser.getPuppeteer()
    const page = _.head(await puppeteer.pages());
    await page.setRequestInterception(true);

    page.on('request', function handler (request) {
      const url = request.url();
      if (!url.startsWith(BUKZA_URL)) {
        request.continue();
        return;
      }


      const headers = request.headers();
      if ('authorization' in headers) {
        // https://stackoverflow.com/questions/4950115/removeeventlistener-on-anonymous-functions-in-javascript
        page.off('request', handler);
        resolve((headers));
      }
      request.continue();
    });

    // navigate to target page
    await browser.navigateTo(bukzaFrameURL);
  }));


const fetchAuthHeader = async () => {
  const browser = await remote({
    capabilities: {
        browserName: 'chrome'
    }
  });
  await browser.url(`${SOURCE_URL}/court-reservations/`);
  const bukzaFrame = await browser.$('iframe')
  await bukzaFrame.waitForDisplayed({ timeout: 100000 })
  const bukzaFrameURL = await bukzaFrame.getAttribute('src');
  if (!bukzaFrameURL.startsWith('https://app.bukza.com')) {
    throw new Error('Invalid iframe. Website probably reformatted');
  }
  // need to navigate to iframe url directly in order to intercept requests
  return navigateToBukza({ browser, bukzaFrameURL });
}

export default fetchAuthHeader;