const faktory = require('faktory-worker');

const workers = require('./workers');

async function updateGeeklistJob(geeklistId, page) {
  const client = await faktory.connect();

  const jid = await client.push({
    jobtype: workers.UPDATE_GEEKLIST,
    args: [geeklistId, page]
  });

  await client.close();
}

async function sendNotificationJob(item, user) {
  const client = await faktory.connect();

  const jid = await client.push({
    jobtype: workers.SEND_NOTIFICATION,
    args: [item.name, item.index]
  });

  await client.close();
}

module.exports = {
  updateGeeklistJob,
  sendNotificationJob
};
