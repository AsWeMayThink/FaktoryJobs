const CronJob = require('cron').CronJob;

const jobs = require('./jobs');
const workers = require('./workers');

// Update on a regular schedule, plus one extra that kicks off as soon as we start the
// sequence.
new CronJob({
  cronTime: '0 8 * * * *',
  onTick: () => {
    jobs.updateBggUserJob('JohnMunsch');
  },
  start: true,
  runOnInit: true
});

// This updates more frequently than the above job.
new CronJob({
  cronTime: '0 */15 * * * *',
  onTick: () => {
    // https://boardgamegeek.com/geeklist/261365/virtual-flea-market-delivery-bggcon-2019
    jobs.updateGeeklistJob(261365, 1);
  },
  start: true,
  runOnInit: true
});

workers.registerWorkers();
