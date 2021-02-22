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
  AirtableFormula: {
    operators: require('./languages/AirtableFormula.js'),
    translate: (keyQLQuery, operators) => {
      return 'OR(' + keyQLQuery.map(queryObj => {
        return 'AND(' + queryObj.map(entry => {
          return operators[entry.operator](entry.key, entry.value);
        }).join(',') + ')';
      }).join(',') + ')';
    }
  },
  HeightFilter: {
    operators: require('./languages/HeightFilter.js'),
    translate: (keyQLQuery, operators) => {
      let filter = {
        "or": keyQLQuery.map(queryObj => {
          return {
            "and": queryObj.map(entry => {
              return operators[entry.operator](entry.key, entry.value);
            })
          }
        })
      }
      return JSON.stringify(filter);
    }
  }
};
