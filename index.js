class KeyQL  {

  query (dataset = [], keyQLQuery = [], keyQLLimit = {offset: 0, count: 0}, mapFunction = v => v) {
    let query = this.validateQuery(keyQLQuery);
    let limit = this.validateLimit(keyQLLimit);
    return dataset
      .filter(data => this.queryItem(query, mapFunction(data)))
      .slice(limit.offset, limit.count ? limit.offset + limit.count : dataset.length);
  }

  queryItem (keyQLQuery, item) {
    for (let i = 0; i < keyQLQuery.length; i++) {
      if (this.matchQueryEntry(keyQLQuery[i], item)) {
        return true;
      }
    }
    return false;
  }

  matchQueryEntry (keyQLQueryEntry, item) {
    for (let i = 0; i < keyQLQueryEntry.length; i++) {
      let statement = keyQLQueryEntry[i];
      if (!statement.compare(item[statement.key], statement.value)) {
        return false;
      }
    }
    return true;
  }

  validateQuery (keyQLQuery) {
    if (!Array.isArray(keyQLQuery)) {
      throw new Error('KeyQL Query must be a valid array');
    }
    return keyQLQuery.map(keyQLQueryObject => this.validateQueryObject(keyQLQueryObject));
  }

  validateQueryObject (keyQLQueryObject) {
    if (!keyQLQueryObject || typeof keyQLQueryObject !== 'object') {
      throw new Error('KeyQL Query Object must be a valid object');
    }
    let keys = Object.keys(keyQLQueryObject);
    return keys.map(key => {
      let blocks = key.split(KeyQL.DELIMETER);
      blocks.length === 1 && blocks.push(KeyQL.DEFAULT_OPERATOR);
      let operator = blocks.pop();
      let compare = KeyQL.OPERATORS[operator];
      if (!compare) {
        throw new Error(`Invalid KeyQL Operator: "${operator}"`);
      }
      return {
        key: blocks.join('__'),
        value: keyQLQueryObject[key],
        compare: compare
      };
    });
  }

  validateLimit (keyQLLimit) {
    if (!keyQLLimit || typeof keyQLLimit !== 'object') {
      throw new Error('KeyQL Limit object must be a valid object');
    }
    if (!(
      Object.keys(keyQLLimit).length === 2
      && keyQLLimit.hasOwnProperty('offset')
      && keyQLLimit.hasOwnProperty('count')
    )) {
      throw new Error('KeyQL Limit object must contain "offset" and "count"');
    }
    if (!(
      parseInt(keyQLLimit.offset) === keyQLLimit.offset
      && parseInt(keyQLLimit.count) === keyQLLimit.count
      && keyQLLimit.offset >= 0
      && keyQLLimit.count >= 0
    )) {
      throw new Error('KeyQL Limit "offset" and "count" must be integers and greater than or equal to 0');
    }
    return keyQLLimit;
  }

}

KeyQL.DELIMETER = '__';
KeyQL.DEFAULT_OPERATOR = 'is';

KeyQL.OPERATORS = {
  'is': (a, b) => a === b,
  'not': (a, b) => a !== b,
  'gt': (a, b) => a > b,
  'lt': (a, b) => a < b,
  'gte': (a, b) => a >= b,
  'lte': (a, b) => a <= b,
  'icontains': (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) > -1,
  'contains': (a, b) => a.indexOf(b) > -1,
  'startswith': (a, b) => a.startsWith(b),
  'istartswith': (a, b) => a.toLowerCase().startsWith(b.toLowerCase()),
  'endswith': (a, b) => a.endsWith(b),
  'iendswith': (a, b) => a.toLowerCase().endsWith(b.toLowerCase()),
  // 'like': (a, b) => a === b, // TODO: Implement basic LIKE operator
  // 'ilike': (a, b) => a.toLowerCase() === b.toLowerCase(), // TODO: Implement basic LIKE operator
  'is_null': (a, b) => a === null,
  'is_true': (a, b) => a === true,
  'is_false': (a, b) => a === false,
  'not_null': (a, b) => a !== null,
  'not_true': (a, b) => a !== true,
  'not_false': (a, b) => a !== false,
  'in': (a, b) => b.indexOf(a) > -1,
  'not_in': (a, b) => b.indexOf(a) === -1
};

module.exports = new KeyQL();
