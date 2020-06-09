class KeyQLQueryCommand {

  constructor (keyQL, previousKeyQLQueryCommand, command) {
    this.keyQL = keyQL;
    this.previousKeyQLQueryCommand = previousKeyQLQueryCommand || null;
    this.command = command || null;
  }

  select (keyQLQuery = []) {
    let query = this.keyQL.constructor.validateQuery(keyQLQuery);
    return new this.constructor(
      this.keyQL,
      this,
      {
        type: 'select',
        value: query
      }
    );
  }

  limit (keyQLLimit = {offset: 0, count: 0}) {
    let limit = this.keyQL.constructor.validateLimit(keyQLLimit);
    return new this.constructor(
      this.keyQL,
      this,
      {
        type: 'limit',
        value: limit
      }
    );
  }

  order (keyQLOrder = [{field: null, sort: 'ASC'}]) {
    let order = this.keyQL.constructor.validateOrder(keyQLOrder);
    return new this.constructor(
      this.keyQL,
      this,
      {
        type: 'order',
        value: order
      }
    );
  }

  values () {
    return this.__query__().map(row => this.keyQL._dataset[row.__keyqlid__]);
  }

  update (fields = {}) {
    fields = this.keyQL.constructor.validateFields(fields);
    let keys = Object.keys(fields);
    let rows = this.__query__();
    let values = rows.map(row => this.keyQL.__updateRow__(row.__keyqlid__, keys, fields));
    this.keyQL.__initialize__(); // commit changes to dataset
    return values;
  }

  __query__ () {
    let commands = [];
    let rows = this.keyQL.rows();
    let keyQLInstruction = this;
    while (keyQLInstruction.command) {
      commands.push(keyQLInstruction.command);
      keyQLInstruction = keyQLInstruction.previousKeyQLQueryCommand;
    }
    while (commands.length) {
      let command = commands.pop();
      rows = this.__executeCommand__(rows, command);
    }
    return rows;
  }

  __executeCommand__ (rows, command) {
    switch (command.type) {
      case 'order':
      let list = command.value;
        while (list.length) {
          rows = rows.slice().sort(
            this.keyQL.sort.bind(
              this.keyQL,
              list.pop()
            )
          );
        }
        return rows;
        break;
      case 'select':
        return rows.filter(row => this.__selectMapFunction__(command.value, row));
        break;
      case 'limit':
        return rows.slice(
          command.value.offset,
          command.value.count
            ? command.value.offset + command.value.count
            : command.value.offset + rows.length
          );
        break;
      default:
        return rows;
        break;
    }
  }

  __selectMapFunction__ (keyQLQuery, row) {
    for (let i = 0; i < keyQLQuery.length; i++) {
      if (this.__matchQueryEntry__(keyQLQuery[i], row)) {
        return true;
      }
    }
    return false;
  }

  __matchQueryEntry__ (keyQLQueryEntry, row) {
    for (let i = 0; i < keyQLQueryEntry.length; i++) {
      let statement = keyQLQueryEntry[i];
      let result;
      try {
        result = statement.compare(row[statement.key], statement.value);
      } catch (e) {
        return false;
      }
      if (!result) {
        return false;
      }
    }
    return true;
  }

}

module.exports = KeyQLQueryCommand;
