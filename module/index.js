const moment = require('moment');
moment.suppressDeprecationWarnings = true;

class KeyQL  {

  select (dataset = [], keyQLQuery = [], keyQLLimit = {offset: 0, count: 0}, mapFunction = v => v) {
    let query = this.validateQuery(keyQLQuery);
    let limit = this.validateLimit(keyQLLimit);
    let transform = this.validateMapFunction(mapFunction);
    return dataset
      .filter(data => this.queryItem(query, transform(data)))
      .slice(limit.offset, limit.count ? limit.offset + limit.count : dataset.length);
  }

  update (dataset = [], fields = {}, keyQLQuery = [], keyQLLimit = {offset: 0, count: 0}, mapFunction = v => v) {
    fields = this.validateFields(fields);
    let transform = this.validateMapFunction(mapFunction);
    let result = this.select(dataset, keyQLQuery, keyQLLimit, mapFunction);
    result.forEach(data => this.updateItem(fields, transform(data)));
    return result;
  }

  queryItem (keyQLQuery, item) {
    for (let i = 0; i < keyQLQuery.length; i++) {
      if (this.matchQueryEntry(keyQLQuery[i], item)) {
        return true;
      }
    }
    return false;
  }

  updateItem (fields, item) {
    Object.keys(fields).forEach(key => item[key] = fields[key]);
    return item;
  }

  matchQueryEntry (keyQLQueryEntry, item) {
    for (let i = 0; i < keyQLQueryEntry.length; i++) {
      let statement = keyQLQueryEntry[i];
      let result;
      result = statement.compare(item[statement.key], statement.value)
      if (!result) {
        return false;
      }
    }
    return true;
  }

  validateFields (fields) {
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      throw new Error('fields must be a valid object');
    }
    return fields;
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
    if (!keyQLLimit || typeof keyQLLimit !== 'object' || Array.isArray(keyQLLimit)) {
      throw new Error('KeyQL Limit object must be a valid object');
    }
    keyQLLimit = Object.keys(keyQLLimit).reduce((limit, key) => {
      limit[key] = keyQLLimit[key];
      return limit;
    }, {});
    keyQLLimit.offset = keyQLLimit.hasOwnProperty('offset')
      ? keyQLLimit.offset
      : 0;
    keyQLLimit.count = keyQLLimit.hasOwnProperty('count')
      ? keyQLLimit.count
      : 0;
    if (Object.keys(keyQLLimit).length !== 2) {
      throw new Error('KeyQL Limit object must only contain "offset" and "count" properties');
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

  validateMapFunction (mapFunction) {
    if (typeof mapFunction !== 'function') {
      throw new Error('KeyQL mapFunction must be a valid function');
    }
    return mapFunction;
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
  'not_in': (a, b) => b.indexOf(a) === -1,
  'is_recent': (a, b) => {
    let delta;
    try {
      delta = moment.now() - moment.parseZone(a).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta >= 0 && delta <= (b * 1000);
  },
  'is_upcoming': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.now();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0 && delta <= (b * 1000);
  }
};

module.exports = new KeyQL();
