const faktory = require('faktory-worker');

const scrapers = require('./scrapers');

const UPDATE_PRODUCT = 'update-product';
const UPDATE_PRODUCTS = 'update-products';

async function updateProductJob(product, asin) {
  const client = await faktory.connect();

  await client
    .job(UPDATE_PRODUCT, {
      product,
      asin
    })
    .push();

  await client.close();
}

async function updateProductWorker({ product, asin }) {
  // Update each product at a variety of sites which sell games.
  // Note: Each of these could easily be a separate job which this job
  // generates (and probably should be).

  // Amazon.com
  let amazonProduct = await scrapers.getProductOnAmazon(product, asin);

  // CardHaus
  let cardhausProduct = await scrapers.getProductOnCardhaus(product, asin);

  // CoolStuffInc
  let coolstuffProduct = await scrapers.getProductOnCoolStuffInc(product, asin);

  console.log(amazonProduct, cardhausProduct, coolstuffProduct);
}

async function updateProductsWorker() {
  // Get a list of all the products we're monitoring at the moment and update
  // each one.
  updateProductJob('machi koro legacy', 'B07MJM6D6Z');
}

async function registerWorkers() {
  // Register a worker for each job type you plan to have.
  faktory.register(UPDATE_PRODUCT, updateProductWorker);
  faktory.register(UPDATE_PRODUCTS, updateProductsWorker);

  console.log('Waiting for work...');
  await faktory.work();
}

registerWorkers();

module.exports = {
  UPDATE_PRODUCT,
  UPDATE_PRODUCTS,
  registerWorkers
};
