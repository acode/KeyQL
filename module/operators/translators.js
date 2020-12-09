module.exports = {
  ShopifyQL: {
    operators: require('./languages/ShopifyQL.js'),
    translate: (keyQLQuery, operators) => {
      return '(' + keyQLQuery.map(queryObj => {
        return queryObj.map(entry => {
          return operators[entry.operator](entry.key, entry.value);
        }).join(' AND ');
      }).join(') OR (') + ')';
    }
  },
  AirtableQL: {
    operators: require('./languages/AirtableQL.js'),
    translate: (keyQLQuery, operators) => {
      return 'OR(' + keyQLQuery.map(queryObj => {
        return 'AND(' + queryObj.map(entry => {
          return operators[entry.operator](entry.key, entry.value);
        }).join(',') + ')';
      }).join(',') + ')';
    }
  }
};
