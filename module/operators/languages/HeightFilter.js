const moment = require('moment');
moment.suppressDeprecationWarnings = true;

module.exports = {
  'is': (a, b) => {
    let filter = {};
    filter[a] = {
      "values": [
        `${b}`
      ]
    };
    return filter;
  },
  'not': (a, b) => {
    let filter = {"not": [{}]};
    filter.not[0][a] = {
      "values": [
        `${b}`
      ]
    };
    return filter;
  },
  'is_null': (a, b) => {
    let filter = {};
    filter[a] = {
      "values": ["NONE_VALUE_ID"]
    };
    return filter;
  },
  'is_true': (a, b) => {
    let filter = {};
    filter[a] = {
      "values": [true]
    };
    return filter;
  },
  'is_false': (a, b) => {
    let filter = {};
    filter[a] = {
      "values": [false]
    };
    return filter;
  },
  'not_null': (a, b) => {
    let filter = {"not": [{}]};
    filter.not[0][a] = {
      "values": ["NONE_VALUE_ID"]
    };
    return filter;
  },
  'not_true': (a, b) => {
    let filter = {"not": [{}]};
    filter.not[0][a] = {
      "values": [true]
    };
    return filter;
  },
  'not_false': (a, b) => {
    let filter = {"not": [{}]};
    filter.not[0][a] = {
      "values": [false]
    };
    return filter;
  },
  'in': (a, b) => {
    let filter = {};
    filter[a] = {
      "values": b
    };
    return filter;
  },
  'not_in': (a, b) => {
    let filter = {"not": [{}]};
    filter.not[0][a] = {
      "values": b
    };
    return filter;
  },
  'recency_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return '';
    }
    let filter = {"and": [{}, {}]};
    filter.and[0][a] = {"gt": {"date": cutOff.toISOString()}};
    filter.and[1][a] = {"lt": {"date": nowUTC.toISOString()}};
    return filter;

  },
  'recency_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return '';
    }
    let filter = {};
    filter[a] = {
      "lt": {"date": cutOff.toISOString()}
    };
    return filter;
  },
  'upcoming_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return '';
    }
    let filter = {"and": [{}, {}]};
    filter.and[0][a] = {"gt": {"date": nowUTC.toISOString()}};
    filter.and[1][a] = {"lt": {"date": cutOff.toISOString()}};
    return filter;
  },
  'upcoming_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return '';
    }
    let filter = {};
    filter[a] = {
      "gt": {"date": cutOff.toISOString()}
    }
    return filter;
  },
  'date_lt': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return '';
    }
    let filter = {};
    filter[a] = {
      "lt": {"date": date.toISOString()}
    }
    return filter;
  },
  'date_gt': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return '';
    }
    let filter = {};
    filter[a] = {
      "gt": {"date": date.toISOString()}
    }
    return filter;
  }
};
