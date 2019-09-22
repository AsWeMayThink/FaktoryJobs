const CronJob = require('cron').CronJob;

const jobs = require('./jobs');
const workers = require('./workers');

// Update on a regular schedule, plus one extra that kicks off as soon as we start the
// sequence.
// new CronJob({
//   cronTime: '0 8 * * * *',
//   onTick: () => {
//     // Find all products which need updating.
//     // Kick off a job for each product.
//   },
//   start: true,
//   runOnInit: true
// });

jobs.updateProductsJob();
