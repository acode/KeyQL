class KeyQLQueryCommand {

  constructor (keyQL, previousKeyQLQueryCommand, command) {
    this.keyQL = keyQL;
    this.previousKeyQLQueryCommand = previousKeyQLQueryCommand || null;
    this.command = command || null;
  }

  select (keyQLQuery = []) {
    let query = this.keyQL.validateQuery(keyQLQuery);
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
    let limit = this.keyQL.validateLimit(keyQLLimit);
    return new this.constructor(
      this.keyQL,
      this,
      {
        type: 'limit',
        value: limit
      }
    );
  }

  values () {
    return this.__query__();
  }

  update (fields = {}) {
    fields = this.keyQL.validateFields(fields);
    let keys = Object.keys(fields);
    let mapFunction = this.keyQL.mapFunction;
    let rows = this.__query__();
    rows.forEach(row => {
      keys.forEach(key => mapFunction(row)[key] = fields[key]);
    });
    this.keyQL.initialize(); // commit changes to dataset
    return rows;
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
    return rows.map(row => this.keyQL.dataset[row.__keyqlid__]);
  }

  __executeCommand__ (rows, command) {
    switch (command.type) {
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
      result = statement.compare(row[statement.key], statement.value)
      if (!result) {
        return false;
      }
    }
    return true;
  }

}

module.exports = KeyQLQueryCommand;
