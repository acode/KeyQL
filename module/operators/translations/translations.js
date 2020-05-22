const ShopifyQL = require('./shopifyQL.js');

module.exports = {
  'is': {
    'shopifyQL': ShopifyQL.is
  },
  'not': {
    'shopifyQL': ShopifyQL.not
  },
  'gt': {
    'shopifyQL': ShopifyQL.gt
  },
  'lt': {
    'shopifyQL': ShopifyQL.lt
  },
  'gte': {
    'shopifyQL': ShopifyQL.gte
  },
  'lte': {
    'shopifyQL': ShopifyQL.lte
  },
  'icontains': {
    'shopifyQL': ShopifyQL.icontains // Not Supported by Shopify, returns '()' TODO: remove
  },
  'contains': {
    'shopifyQL': ShopifyQL.contains // Not Supported by Shopify, returns '()' TODO: remove
  },
  'startswith': {
    'shopifyQL': ShopifyQL.startswith // Not Supported by Shopify, returns '()' TODO: remove
  },
  'istartswith': {
    'shopifyQL': ShopifyQL.istartswith
  },
  'endswith': {
    'shopifyQL': ShopifyQL.endswith // Not Supported by Shopify, returns '()' TODO: remove
  },
  'iendswith': {
    'shopifyQL': ShopifyQL.iendswith // Not Supported by Shopify, returns '()' TODO: remove
  },
  'is_null': {
    'shopifyQL': ShopifyQL.is_null
  },
  'is_true': {
    'shopifyQL': ShopifyQL.is_true
  },
  'is_false': {
    'shopifyQL': ShopifyQL.is_false
  },
  'not_null': {
    'shopifyQL': ShopifyQL.not_null
  },
  'not_true': {
    'shopifyQL': ShopifyQL.not_true
  },
  'not_false': {
    'shopifyQL': ShopifyQL.not_false
  },
  'in': {
    'shopifyQL': ShopifyQL.in
  },
  'not_in': {
    'shopifyQL': ShopifyQL.not_in
  },
  'recency_lt': {
    'shopifyQL': ShopifyQL.recency_lt
  },
  'recency_lte': {
    'shopifyQL': ShopifyQL.recency_lte
  },
  'recency_gt': {
    'shopifyQL': ShopifyQL.recency_gt
  },
  'recency_gte': {
    'shopifyQL': ShopifyQL.recency_gte
  },
  'upcoming_lt': {
    'shopifyQL': ShopifyQL.upcoming_lt
  },
  'upcoming_lte': {
    'shopifyQL': ShopifyQL.upcoming_lte
  },
  'upcoming_gt': {
    'shopifyQL': ShopifyQL.upcoming_gt
  },
  'upcoming_gte': {
    'shopifyQL': ShopifyQL.upcoming_gte
  },
  'date_lt': {
    'shopifyQL': ShopifyQL.date_lt
  },
  'date_lte': {
    'shopifyQL': ShopifyQL.date_lte
  },
  'date_gt': {
    'shopifyQL': ShopifyQL.date_gt
  },
  'date_gte': {
    'shopifyQL': ShopifyQL.date_gte
  }
};
