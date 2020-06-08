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

  static validateQuery (keyQLQuery, validFields = [], operators = KeyQL.OPERATORS) {
    if (!Array.isArray(keyQLQuery)) {
      throw new Error('KeyQL Query must be a valid array');
    }
    return keyQLQuery.map(keyQLQueryObject => this.validateQueryObject(keyQLQueryObject, validFields, operators));
  }

  static validateQueryObject (keyQLQueryObject, validFields = [], operators = KeyQL.OPERATORS) {
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
      } else if (!operators[operator]) {
        throw new Error(`Unavailable KeyQL Operator: "${operator}"`);
      }
      var parsedKey = blocks.join('__');
      if (validFields.length && validFields.indexOf(parsedKey) === -1) {
        throw new Error(`Invalid KeyQL Query object field: "${parsedKey}", valid fields are "${validFields.join('", "')}"`);
      }
      return {
        key: parsedKey,
        value: keyQLQueryObject[key],
        compare: compare,
        operator: operator
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

  static validateOrder (keyQLOrder, validFields = []) {
    if (!Array.isArray(keyQLOrder)) {
      throw new Error('KeyQL Order must be a valid array');
    }
    return keyQLOrder.map(keyQLOrderObject => this.validateOrderObject(keyQLOrderObject));
  }

  static validateOrderObject (keyQLOrderObject, validFields = []) {
    if (!keyQLOrderObject || typeof keyQLOrderObject !== 'object' || Array.isArray(keyQLOrderObject)) {
      throw new Error('KeyQL Order object must be a valid object');
    }
    keyQLOrderObject = Object.keys(keyQLOrderObject).reduce((order, key) => {
      order[key] = keyQLOrderObject[key];
      return order;
    }, {});
    if (!keyQLOrderObject.hasOwnProperty('sort')) {
      keyQLOrderObject.sort = 'ASC';
    }
    if (!keyQLOrderObject.hasOwnProperty('field')) {
      throw new Error('KeyQL Order object must have a "field" property');
    } else if (typeof keyQLOrderObject.field !== 'string') {
      throw new Error('KeyQL Order "field" property must be a string');
    } else if (!{'ASC': true, 'DESC': true}[keyQLOrderObject.sort]) {
      throw new Error('KeyQL Order "sort" property must be "ASC" or "DESC"');
    } else if (Object.keys(keyQLOrderObject).length > 2) {
      throw new Error('KeyQL Order object must only contain "field" and "sort" properties');
    } else if (validFields.length && validFields.indexOf(keyQLOrderObject.field) === -1) {
      throw new Error(`KeyQL Order "field" property invalid: "${keyQLOrderObject.field}", valid fields are "${validFields.join('", "')}"`);
    }
    return keyQLOrderObject;
  }

  static validateMapFunction (mapFunction) {
    if (typeof mapFunction !== 'function') {
      throw new Error('KeyQL mapFunction must be a valid function');
    }
    return mapFunction;
  }

  static translate (keyQLQuery, language, validFields = []) {
    if (!(language in KeyQL.TRANSLATORS)) {
      throw new Error(`Invalid KeyQL Translator: "${language}"`);
    }
    let translator = KeyQL.TRANSLATORS[language];
    return translator.translate(
      KeyQL.validateQuery(keyQLQuery, validFields, translator.operators),
      translator.operators
    );
  };

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

  sort (keyQLOrder, a, b) {
    var val = {'DESC': -1, 'ASC': 1}[keyQLOrder.sort];
    var a__uniq = a.__keyqlid__;
    var b__uniq = b.__keyqlid__;
    a = a[keyQLOrder.field];
    b = b[keyQLOrder.field];
    if(a === b) { return a__uniq > b__uniq ? (val) : -(val); }
    if(a === undefined) { return 1; }
    if(b === undefined) { return -1; }
    if(a === null) { return 1; }
    if(b === null) { return -1; }
    if(typeof a === 'function') {
      if(typeof b === 'function') { return a__uniq > b__uniq ? (val) : -(val); }
      return -1;
    }
    if(typeof a === 'object') {
      if(typeof b === 'function') { return 1; }
      if(typeof b === 'object') {
        if(a instanceof Date && b instanceof Date) {
          return a.valueOf() > b.valueOf() ? (val) : -(val);
        }
        if(a instanceof Date) { return 1; }
        if(b instanceof Date) { return -1; }
        return a__uniq > b__uniq ? (val) : -(val);
      }
      return -1;
    }
    if(typeof a === 'string') {
      if(typeof b === 'function') { return 1; }
      if(typeof b === 'object') { return 1; }
      if(typeof b === 'string') { return a > b ? (val) : -(val); }
      return -1;
    }
    if(typeof a === 'boolean') {
      if(typeof b === 'boolean') { return a > b ? (val) : -(val); }
      if(typeof b === 'number') { return -1; }
      return 1;
    }
    if(typeof a === 'number') {
      if(typeof b === 'number') {
        if(isNaN(a) && isNaN(b)) { return a__uniq > b__uniq ? (val) : -(val); }
        if(isNaN(a)) { return 1; }
        if(isNaN(b)) { return -1; }
        return a > b ? (val) : -(val);
      }
      return 1;
    }
    return a__uniq > b__uniq ? (val) : -(val);
  }

}

KeyQL.DELIMITER = '__';
KeyQL.DEFAULT_OPERATOR = 'is';
KeyQL.OPERATORS = require('./operators/operators.js');
KeyQL.TRANSLATORS = require('./operators/translators.js');

module.exports = KeyQL;
