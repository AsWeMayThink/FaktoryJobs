const faktory = require('faktory-worker');

const workers = require('./workers');

async function updateProductsJob() {
  const client = await faktory.connect();

  await client.job(workers.UPDATE_PRODUCTS, {}).push();

  await client.close();
}

module.exports = {
  updateProductsJob
};
