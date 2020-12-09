const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const arraySeparator = '¤¤¤';

const formatKey = (key) => {
  return `{${key}}`;
};

const formatValue = (value) => {
  if (typeof value === 'boolean') {
    return value ? 'TRUE()' : 'FALSE()';
  } else if (!value) {
    return `BLANK()`;
  } else if (moment.isMoment(value)) {
    return `'${value.toISOString()}'`;
  } else {
    return `'${value.toString().replace(/'/g, '\'&"\'"&\'')}'`;
  }
};

module.exports = {
  'is': (a, b) => `${formatKey(a)}=${formatValue(b)}`,
  'not': (a, b) => `${formatKey(a)}!=${formatValue(b)}`,
  'gt': (a, b) => `${formatKey(a)}>${formatValue(b)}`,
  'lt': (a, b) => `${formatKey(a)}<${formatValue(b)}`,
  'gte': (a, b) => `${formatKey(a)}>=${formatValue(b)}`,
  'lte': (a, b) => `${formatKey(a)}<=${formatValue(b)}`,
  'contains': (a, b) => {
    return `IF(T(${formatKey(a)}),SEARCH(${formatValue(b)},${formatKey(a)}),SEARCH('${arraySeparator}'&${formatValue(b)}&'${arraySeparator}','${arraySeparator}'&ARRAYJOIN(${formatKey(a)},'${arraySeparator}')&'${arraySeparator}'))`;
  },
  'icontains': (a, b) => {
    return `IF(T(${formatKey(a)}),SEARCH(LOWER(${formatValue(b)}),LOWER(${formatKey(a)})),SEARCH('${arraySeparator}'&LOWER(${formatValue(b)})&'${arraySeparator}','${arraySeparator}'&LOWER(ARRAYJOIN(${formatKey(a)},'${arraySeparator}'))&'${arraySeparator}'))`;
  },
  'startswith': (a, b) => {
    if (!b) {
      return 'BLANK()';
    }
    return `LEFT(${formatKey(a)},${b.toString().length})=${formatValue(b)}`;
  },
  'istartswith': (a, b) => {
    if (!b) {
      return 'BLANK()';
    }
    return `LOWER(LEFT(${formatKey(a)},${b.toString().length}))=LOWER(${formatValue(b)})`
  },
  'endswith': (a, b) => {
    if (!b) {
      return 'BLANK()';
    }
    return `RIGHT(${formatKey(a)},${b.toString().length})=${formatValue(b)}`;
  },
  'iendswith': (a, b) => {
    if (!b) {
      return 'BLANK()';
    }
    return `LOWER(RIGHT(${formatKey(a)},${b.toString().length}))=LOWER(${formatValue(b)})`;
  },
  'is_null': (a, b) => `OR(${formatKey(a)}=BLANK(),${formatKey(a)}='')`,
  'is_true': (a, b) => `${formatKey(a)}=TRUE()`,
  'is_false': (a, b) => `${formatKey(a)}=FALSE()`,
  'not_null': (a, b) => `AND(${formatKey(a)}!=BLANK(),${formatKey(a)}!='')`,
  'not_true': (a, b) => `${formatKey(a)}!=TRUE()`,
  'not_false': (a, b) => `${formatKey(a)}!=FALSE()`,
  'in': (a, b) => `OR(${b.map(elem => `${formatKey(a)}=${formatValue(elem)}`).join(',')})`,
  'not_in': (a, b) => `AND(${b.map(elem => `${formatKey(a)}!=${formatValue(elem)}`).join(',')})`,
  'recency_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `AND(${formatKey(a)}>${formatValue(cutOff)},${formatKey(a)}<=${formatValue(nowUTC)})`;
  },
  'recency_lte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `AND(${formatKey(a)}>=${formatValue(cutOff)},${formatKey(a)}<=${formatValue(nowUTC)})`;
  },
  'recency_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}<${formatValue(cutOff)}`;
  },
  'recency_gte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).subtract(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}<=${formatValue(cutOff)}`;
  },
  'upcoming_lt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `AND(${formatKey(a)}>=${formatValue(nowUTC)},${formatKey(a)}<${formatValue(cutOff)})`;
  },
  'upcoming_lte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `AND(${formatKey(a)}>=${formatValue(nowUTC)},${formatKey(a)}<=${formatValue(cutOff)})`;
  },
  'upcoming_gt': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}>${formatValue(cutOff)}`;
  },
  'upcoming_gte': (a, b) => {
    let nowUTC = moment.utc(moment.now());
    let cutOff;
    try {
      cutOff = moment(nowUTC).add(b, 'seconds');
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}>=${formatValue(cutOff)}`;
  },
  'date_lt': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}<${formatValue(date)}`;
  },
  'date_lte': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}<=${formatValue(date)}`;
  },
  'date_gt': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}>${formatValue(date)}`;
  },
  'date_gte': (a, b) => {
    let date;
    try {
      date = moment(b);
    } catch (e) {
      return 'BLANK()';
    }
    return `${formatKey(a)}>=${formatValue(date)}`;
  }
};
