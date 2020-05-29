const KeyQLQueryCommand = require('./query_command.js');

class KeyQL  {

  static validateKeys (dataset, mapFunction) {
    return dataset.length
     ? Object.keys(mapFunction(dataset[0]))
     : [];
  }

  static validateRows (dataset, mapFunction, keys) {
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

  static validateDataset (dataset) {
    if (!Array.isArray(dataset)) {
      throw new Error('Dataset must be a valid array.');
    }
    return dataset;
  }

  static validateFields (fields) {
    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      throw new Error('fields must be a valid object');
    }
    return fields;
  }

  static validateQuery (keyQLQuery, validKeys = []) {
    if (!Array.isArray(keyQLQuery)) {
      throw new Error('KeyQL Query must be a valid array');
    }
    return keyQLQuery.map(keyQLQueryObject => this.validateQueryObject(keyQLQueryObject, validKeys));
  }

  static validateQueryObject (keyQLQueryObject, validKeys = []) {
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
      var parsedKey = blocks.join('__');
      if (validKeys.length && validKeys.indexOf(parsedKey) === -1) {
        throw new Error(`Invalid KeyQL Key: "${parsedKey}", valid keys are "${validKeys.join('", "')}"`);
      }
      return {
        key: parsedKey,
        value: keyQLQueryObject[key],
        compare: compare
      };
    });
  }

  static validateLimit (keyQLLimit) {
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

  static validateMapFunction (mapFunction) {
    if (typeof mapFunction !== 'function') {
      throw new Error('KeyQL mapFunction must be a valid function');
    }
    return mapFunction;
  }

  constructor (dataset = [], mapFunction = v => v) {
    this._dataset = this.constructor.validateDataset(dataset);
    this._mapFunction = this.constructor.validateMapFunction(mapFunction);
    this._keys = this.constructor.validateKeys(this._dataset, this._mapFunction);
    this._updated = {};
    this.__initialize__();
  }

  __initialize__ () {
    this._rows = this.constructor.validateRows(this._dataset, this._mapFunction, this._keys);
  }

  __updateRow__ (keyQLID = -1, keys, fields) {
    let row = this._dataset[keyQLID];
    if (!row) {
      throw new Error(`Could not find row index: "${keyQLID}"`);
    }
    let mapped = this._mapFunction(row);
    keys.forEach(key => mapped[key] = fields[key]);
    this._updated[keyQLID] = true;
    return row;
  }

  changeset () {
    return Object.keys(this._updated)
      .map(id => parseInt(id))
      .sort()
      .map(id => this._dataset[id]);
  }

  commit () {
    return new KeyQL(this._dataset, this._mapFunction);
  }

  query () {
    return new KeyQLQueryCommand(this);
  }

  keys () {
    return this._keys.slice();
  }

  dataset () {
    return this._dataset.slice();
  }

  rows () {
    return this._rows.slice();
  }

}

KeyQL.DELIMITER = '__';
KeyQL.DEFAULT_OPERATOR = 'is';
KeyQL.OPERATORS = require('./operators/operators.js');

module.exports = KeyQL;
