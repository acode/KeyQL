const moment = require('moment');
moment.suppressDeprecationWarnings = true;

const { isMatch, iIsMatch } = require('./wildcard');

module.exports = {
  'is': (a, b) => a === b,
  'not': (a, b) => a !== b,
  'gt': (a, b) => a > b,
  'lt': (a, b) => a < b,
  'gte': (a, b) => a >= b,
  'lte': (a, b) => a <= b,
  'icontains': (a, b) => (Array.isArray(a) ? a.map(v => v.toLowerCase()) : a.toLowerCase()).indexOf(b.toLowerCase()) > -1,
  'contains': (a, b) => a.indexOf(b) > -1,
  'startswith': (a, b) => a.startsWith(b),
  'istartswith': (a, b) => a.toLowerCase().startsWith(b.toLowerCase()),
  'wordstartswith': (a, b) => a.split(' ').reduce((matched, word) => matched || word.startsWith(b), false),
  'iwordstartswith': (a, b) => a.toLowerCase().split(' ').reduce((matched, word) => matched || word.startsWith(b.toLowerCase()), false),
  'endswith': (a, b) => a.endsWith(b),
  'iendswith': (a, b) => a.toLowerCase().endsWith(b.toLowerCase()),
  'wordendswith': (a, b) => a.split(' ').reduce((matched, word) => matched || word.endsWith(b), false),
  'iwordendswith': (a, b) => a.toLowerCase().split(' ').reduce((matched, word) => matched || word.endsWith(b.toLowerCase()), false),
  'like': (a, b) => isMatch(a, b),
  'ilike': (a, b) => iIsMatch(a, b),
  'is_null': (a, b) => a === null,
  'is_true': (a, b) => a === true,
  'is_false': (a, b) => a === false,
  'not_null': (a, b) => a !== null,
  'not_true': (a, b) => a !== true,
  'not_false': (a, b) => a !== false,
  'in': (a, b) => b.indexOf(a) > -1,
  'not_in': (a, b) => b.indexOf(a) === -1,
  'recency_lt': (a, b) => {
    let delta;
    try {
      delta = moment.now() - moment.parseZone(a).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta >= 0 && delta < (b * 1000);
  },
  'recency_lte': (a, b) => {
    let delta;
    try {
      delta = moment.now() - moment.parseZone(a).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta >= 0 && delta <= (b * 1000);
  },
  'recency_gt': (a, b) => {
    let delta;
    try {
      delta = moment.now() - moment.parseZone(a).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta > (b * 1000);
  },
  'recency_gte': (a, b) => {
    let delta;
    try {
      delta = moment.now() - moment.parseZone(a).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta >= (b * 1000);
  },
  'upcoming_lt': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.now();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0 && delta < (b * 1000);
  },
  'upcoming_lte': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.now();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0 && delta <= (b * 1000);
  },
  'upcoming_gt': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.now();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0 && delta > (b * 1000);
  },
  'upcoming_gte': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.now();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0 && delta >= (b * 1000);
  },
  'date_lt': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.parseZone(b).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta < 0;
  },
  'date_lte': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.parseZone(b).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta <= 0;
  },
  'date_gt': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.parseZone(b).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta > 0;
  },
  'date_gte': (a, b) => {
    let delta;
    try {
      delta = moment.parseZone(a).valueOf() - moment.parseZone(b).valueOf();
    } catch (e) {
      delta = NaN;
    }
    return delta >= 0;
  }
};
