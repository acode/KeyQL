const KeyQLQueryCommand = require('./querycommand.js');

class KeyQL  {

  constructor (dataset = [], mapFunction = v => v) {
    this.dataset = this.validateDataset(dataset);
    this.mapFunction = this.validateMapFunction(mapFunction);
    this._keys = this.validateKeys(this.dataset, this.mapFunction);
    this.initialize();
  }

  initialize () {
    this._rows = this.validateRows(this.dataset, this.mapFunction, this._keys);
  }

  validateKeys (dataset, mapFunction) {
    return dataset.length
     ? Object.keys(mapFunction(dataset[0]))
     : [];
  }

  validateRows (dataset, mapFunction, keys) {
    return dataset
      .map((row, i) => {
        row = mapFunction(row);
        let refRow = Object.defineProperty(
          Object.create(null),
          '__keyqlid__',
          {value: i}
        );
        return keys.reduce((refRow, key) => {
          refRow[key] = row[key];
          return refRow;
        }, refRow);
      });
  }

  validateDataset (dataset) {
    if (!Array.isArray(dataset)) {
      throw new Error('Dataset must be a valid array.');
    }
    return dataset;
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
      let blocks = key.split(KeyQL.DELIMITER);
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

  query () {
    return new KeyQLQueryCommand(this);
  }

  keys () {
    return this._keys.slice();
  }

  rows () {
    return this._rows.slice();
  }

}

KeyQL.DELIMITER = '__';
KeyQL.DEFAULT_OPERATOR = 'is';
KeyQL.OPERATORS = require('./operators.js');

module.exports = KeyQL;
