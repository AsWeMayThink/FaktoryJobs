const natural = require('natural');
const Xray = require('x-ray');

let x = Xray();

function calculateDiceCoefficientsAndSelectBestMatch(results, product) {
  results.forEach(result => {
    result.dice = natural.DiceCoefficient(result.name, product);
  });

  // Sort all of the products by a name distance from our target product.
  const sortBy = key => {
    return (a, b) => {
      a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
    };
  };

  // Select the one that appears to be our product out of the scraped list.
  results.sort(sortBy('dice'));

  let result = results[0];
  delete result.dice;

  return result;
}

function getProductOnAmazon(product, asin) {
  // If we have an ASIN, we can use this as a search string: https://www.amazon.com//dp/${asin}
  const amazonProductUrl = `https://www.amazon.com//dp/${asin}`;

  return x(amazonProductUrl, 'body', [
    {
      name: '#productTitle',
      price: '#priceblock_ourprice'
    }
  ]).then(results => {
    // We only expect one value back, we should be on the page for a specific product.
    result = results[0];

    // Remove all the noise around the name.
    result.name = result.name.replace(/\s+\s|\\n/g, '');

    // And add a URL directly to the product.
    result.asin = asin;
    result.source = 'Amazon.com';
    result.url = amazonProductUrl;

    return result;
  });
}

function getProductOnCardhaus(product, asin) {
  const cardHausSearchUrl = `https://www.cardhaus.com/search.php?search_query=${encodeURI(
    product
  )}&section=product`;

  return x(cardHausSearchUrl, 'li.product', [
    {
      url: 'h4.card-title a@href',
      name: 'h4.card-title a',
      price: 'div.card-text span.price.price--withoutTax'
    }
  ]).then(results => {
    let result = calculateDiceCoefficientsAndSelectBestMatch(results, product);

    result.source = 'Cardhaus';

    return result;
  });
}

function getProductOnCoolStuffInc(product, asin) {
  const coolStuffSearchUrl = `https://www.coolstuffinc.com/main_search.php?pa=searchOnName&page=1&resultsPerPage=25&q=${product.replace(
    /\s/g,
    '+'
  )}`;

  return x(coolStuffSearchUrl, 'div.row.product-search-row', [
    {
      url: 'a.productLink@href',
      name: 'a.productLink span',
      price:
        'div.row.product-search-row > div div.search-info-cell div.row:nth-child(5) div span'
    }
  ]).then(results => {
    let result = calculateDiceCoefficientsAndSelectBestMatch(results, product);

    result.source = 'CoolStuffInc';

    return result;
  });
}

module.exports = {
  getProductOnAmazon,
  getProductOnCardhaus,
  getProductOnCoolStuffInc
};
