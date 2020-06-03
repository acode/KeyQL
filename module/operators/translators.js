module.exports = {
  shopifyQL: {
    operators: require('./languages/shopifyQL.js'),
    translate: (keyQLQuery, operators) => {
      return '(' + keyQLQuery.map(queryObj => {
        return queryObj.map(entry => {
          return operators[entry.operator](entry.key, entry.value);
        }).join(' AND ');
      }).join(') OR (') + ')';
    }
  }
};
