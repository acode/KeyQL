const expect = require('chai').expect;
const moment = require('moment');

const KeyQL = require('../module/index.js');

describe('KeyQL to ShopifyQL Translation Tests', () => {

  let language = 'ShopifyQL';
  let dateTimeFormat = 'YYYY-MM-DDTHH:mm:ssZ';

  const formatDateTime = (dateTime) => dateTime.format(dateTimeFormat).replace(/\+00:00/g, 'Z');

  it('Should translate query with a specific field (default)', () => {
    let translation;

    translation = KeyQL.translate([{title: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:"T-Shirt")');

    translation = KeyQL.translate([{title: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "is" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__is: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:"T-Shirt")');

    translation = KeyQL.translate([{title__is: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title__is: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "not" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__not: 'T-Shirt'}], language);
    expect(translation).to.equal('(-title:"T-Shirt")');

    translation = KeyQL.translate([{title__not: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(-title:"Blue T-Shirt")');

    translation = KeyQL.translate([{title__not: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(-title:"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct")');

  });

  it('Should translate query with "gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gt: '99'}], language);
    expect(translation).to.equal('(price:>"99")');

    translation = KeyQL.translate([{price__gt: 99}], language);
    expect(translation).to.equal('(price:>"99")');

    translation = KeyQL.translate([{price__gt: 99.99}], language);
    expect(translation).to.equal('(price:>"99.99")');

    translation = KeyQL.translate([{price__gt: '99.99'}], language);
    expect(translation).to.equal('(price:>"99.99")');

    translation = KeyQL.translate([{price__gt: 100.00}], language);
    expect(translation).to.equal('(price:>"100")');

    translation = KeyQL.translate([{price__gt: '100.00'}], language);
    expect(translation).to.equal('(price:>"100.00")');

    translation = KeyQL.translate([{created_at__gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:>"2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gte: '99'}], language);
    expect(translation).to.equal('(price:>="99")');

    translation = KeyQL.translate([{price__gte: 99}], language);
    expect(translation).to.equal('(price:>="99")');

    translation = KeyQL.translate([{price__gte: 99.99}], language);
    expect(translation).to.equal('(price:>="99.99")');

    translation = KeyQL.translate([{price__gte: '99.99'}], language);
    expect(translation).to.equal('(price:>="99.99")');

    translation = KeyQL.translate([{price__gte: 100.00}], language);
    expect(translation).to.equal('(price:>="100")');

    translation = KeyQL.translate([{price__gte: '100.00'}], language);
    expect(translation).to.equal('(price:>="100.00")');

    translation = KeyQL.translate([{created_at__gte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:>="2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lt: '99'}], language);
    expect(translation).to.equal('(price:<"99")');

    translation = KeyQL.translate([{price__lt: 99}], language);
    expect(translation).to.equal('(price:<"99")');

    translation = KeyQL.translate([{price__lt: 99.99}], language);
    expect(translation).to.equal('(price:<"99.99")');

    translation = KeyQL.translate([{price__lt: '99.99'}], language);
    expect(translation).to.equal('(price:<"99.99")');

    translation = KeyQL.translate([{price__lt: 100.00}], language);
    expect(translation).to.equal('(price:<"100")');

    translation = KeyQL.translate([{price__lt: '100.00'}], language);
    expect(translation).to.equal('(price:<"100.00")');

    translation = KeyQL.translate([{created_at__lt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:<"2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lte: '99'}], language);
    expect(translation).to.equal('(price:<="99")');

    translation = KeyQL.translate([{price__lte: 99}], language);
    expect(translation).to.equal('(price:<="99")');

    translation = KeyQL.translate([{price__lte: 99.99}], language);
    expect(translation).to.equal('(price:<="99.99")');

    translation = KeyQL.translate([{price__lte: '99.99'}], language);
    expect(translation).to.equal('(price:<="99.99")');

    translation = KeyQL.translate([{price__lte: 100.00}], language);
    expect(translation).to.equal('(price:<="100")');

    translation = KeyQL.translate([{price__lte: '100.00'}], language);
    expect(translation).to.equal('(price:<="100.00")');

    translation = KeyQL.translate([{created_at__lte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal('(created_at:<="2020-05-18T19\\:13\\:00Z")');

  });

  it('Should translate query with "iwordstartswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__iwordstartswith: 'T-Shirt'}], language);
    expect(translation).to.equal('(title:\\"T-Shirt\\"*)');

    translation = KeyQL.translate([{title__iwordstartswith: 'Blue T-Shirt'}], language);
    expect(translation).to.equal('(title:\\"Blue T-Shirt\\"*)');

    translation = KeyQL.translate([{title__iwordstartswith: 'Spe:cial : (hars ( ) \\Pro)uct'}], language);
    expect(translation).to.equal('(title:\\"Spe\\:cial \\: \\(hars \\( \\) \\\\Pro\\)uct\\"*)');

  });

  it('Should translate query with "is_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__is_null: true}], language);
    expect(translation).to.equal('(-email:*)');

  });

  it('Should translate query with "not_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__not_null: true}], language);
    expect(translation).to.equal('(email:*)');

  });

  it('Should translate query with "is_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_true: true}], language);
    expect(translation).to.equal('(is_price_reduced:true)');

  });

  it('Should translate query with "not_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_true: true}], language);
    expect(translation).to.equal('(-is_price_reduced:true)');

  });

  it('Should translate query with "is_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_false: true}], language);
    expect(translation).to.equal('(is_price_reduced:false)');

  });

  it('Should translate query with "not_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_false: true}], language);
    expect(translation).to.equal('(-is_price_reduced:false)');

  });

  it('Should translate query with "in" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal('((title:"T-Shirt" OR title:"Jeans" OR title:"Shoes"))');

    translation = KeyQL.translate([{title__in: ['T-Shirt']}], language);
    expect(translation).to.equal('((title:"T-Shirt"))');

    translation = KeyQL.translate([{title__in: []}], language);
    expect(translation).to.equal('(())');

  });

  it('Should translate query with "not_in" operator', () => {

    let translation;

    translation = KeyQL.translate([{title__not_in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal('((-title:"T-Shirt" AND -title:"Jeans" AND -title:"Shoes"))');

    translation = KeyQL.translate([{title__not_in: ['T-Shirt']}], language);
    expect(translation).to.equal('((-title:"T-Shirt"))');

    translation = KeyQL.translate([{title__not_in: []}], language);
    expect(translation).to.equal('(())');

  });

  it('Should translate query with "recency_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>"${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

  });

  it('Should translate query with "recency_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

  });

  it('Should translate query with "recency_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:<"${twoHoursAgo}")`);

  });

  it('Should translate query with "recency_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{created_at__recency_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:<="${twoHoursAgo}")`);

  });

  it('Should translate query with "upcoming_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${formatDateTime(nowUTC)}" AND created_at:<"${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${formatDateTime(nowUTC)}" AND created_at:<="${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>"${twoHoursFromNow}")`);

  });

  it('Should translate query with "upcoming_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = formatDateTime(moment(nowUTC).add(2, 'hours'));

    translation = KeyQL.translate([{created_at__upcoming_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`(created_at:>="${twoHoursFromNow}")`);

  });

  it('Should translate query with "date_lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:<"2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_lt: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:<"2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:<="2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_lte: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:<="2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:>"2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_gt: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:>"2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate query with "date_gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`(created_at:>="2020-05-18T19\\:13\\:00Z")`);

    translation = KeyQL.translate([{created_at__date_gte: '2020-04-06T10:25:49-07:00'}], language);
    expect(translation).to.equal(`(created_at:>="2020-04-06T10\\:25\\:49-07\\:00")`);

  });

  it('Should translate chained operators', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = formatDateTime(moment(nowUTC).subtract(2, 'hours'));

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans'}], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND -title:"Jeans")`);

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans', price__gt: '99'}], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND -title:"Jeans" AND price:>"99")`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}], language);
    expect(translation).to.equal(`(title:"T-Shirt") OR (-title:"Jeans")`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}, {title__not: 'Shoes'}], language);
    expect(translation).to.equal(`(title:"T-Shirt") OR (-title:"Jeans") OR (-title:"Shoes")`);

    translation = KeyQL.translate([{title: 'T-Shirt', price__lt: 99.99}, {title__not: 'Jeans', is_price_reduced__is_true: true}, {title__not: 'Shoes', created_at__recency_lte: secondsInTwoHours }], language);
    expect(translation).to.equal(`(title:"T-Shirt" AND price:<"99.99") OR (-title:"Jeans" AND is_price_reduced:true) OR (-title:"Shoes" AND created_at:>="${twoHoursAgo}" AND created_at:<="${formatDateTime(nowUTC)}")`);

    translation = KeyQL.translate([
      {
        title__in: ['Shoes', 'Hat', 'Jeans'],
        created_at__lte: '2020-05-18T19:13:00Z'
      },
      {
        price__gte: 99.99,
        is_price_reduced__not_true: true,
      },
      {
        inventory_total: 1000
      },
      {
        out_of_stock_somewhere__is_false: true
      }
    ], language);
    expect(translation).to.equal('((title:"Shoes" OR title:"Hat" OR title:"Jeans") AND created_at:<="2020-05-18T19\\:13\\:00Z") OR (price:>="99.99" AND -is_price_reduced:true) OR (inventory_total:"1000") OR (out_of_stock_somewhere:false)');

  });

  it('Should throw an error with translating unsupported operator "icontains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__icontains: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"icontains"');

  });

  it('Should throw an error with translating unsupported operator "contains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__contains: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"contains"');

  });

  it('Should throw an error with translating unsupported operator "startswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__startswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"startswith"');

  });

  it('Should throw an error with translating unsupported operator "istartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__istartswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"istartswith"');

  });

  it('Should throw an error with translating unsupported operator "wordstartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__wordstartswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"wordstartswith"');

  });

  it('Should throw an error with translating unsupported operator "wordendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__wordendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"wordendswith"');

  });

  it('Should throw an error with translating unsupported operator "iwordendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__iwordendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"iwordendswith"');

  });

  it('Should throw an error with translating unsupported operator "endswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__endswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"endswith"');

  });

  it('Should throw an error with translating unsupported operator "iendswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__iendswith: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"iendswith"');

  });

  it('Should throw an error with translating unsupported operator "like"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__like: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"like"');

  });

  it('Should throw an error with translating unsupported operator "ilike"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{title__ilike: 'T-Shirt'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"ilike"');

  });

});
