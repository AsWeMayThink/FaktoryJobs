const faktory = require('faktory-worker');

const triggerIftttMakerWebhook = require('./models/makerWebhook');

const SEND_NOTIFICATION = 'send-notification';
const UPDATE_GEEKLIST = 'update-geeklist';

async function sendNotificationWorker(event, key, value1, value2, value3) {
  await triggerIftttMakerWebhook(event, key, value1, value2, value3);
}

// Try up to three times to get the geeklist. It often seems like the first call fails and then another call
// immediately after will succeed. This tries to hide those retries, which are different from what Faktory
// facilitates.
async function getGeeklistWithRetriesWorker(geeklistId, page) {
  let bggGeeklist = await bgg.getGeeklist(geeklistId, page);

  if (
    bggGeeklist.message &&
    bggGeeklist.message.includes('Please try again later for access.')
  ) {
    bggGeeklist = await bgg.getGeeklist(geeklistId, page);
  } else {
    return bggGeeklist;
  }

  if (
    bggGeeklist.message &&
    bggGeeklist.message.includes('Please try again later for access.')
  ) {
    bggGeeklist = await bgg.getGeeklist(geeklistId, page);
  }

  return bggGeeklist;
}

async function registerWorkers() {
  // Register a worker for each job type you plan to have.
  faktory.register(SEND_NOTIFICATION, sendNotificationWorker);
  faktory.register(UPDATE_GEEKLIST, updateGeeklistWorker);

  console.log('Waiting for work...');
  await faktory.work();
}

module.exports = {
  SEND_NOTIFICATION,
  UPDATE_GEEKLIST,
  registerWorkers
};
