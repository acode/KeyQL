const expect = require('chai').expect;
const moment = require('moment');

const KeyQL = require('../module/index.js');

const mockDateMs = 1607471504386;

describe('KeyQL to AirtableQL Translation Tests', () => {

  let language = 'AirtableQL';
  let originalMomentNow;

  beforeEach(function () {
    originalMomentNow = moment.now;
    moment.now = () => {
      return moment(new Date(mockDateMs));
    };
  });

  afterEach(function () {
    moment.now = originalMomentNow;
  });

  it('Should translate query with a specific field (default)', () => {

    let translation;

    translation = KeyQL.translate([{Title: 'T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}='T-Shirt'))`);

    translation = KeyQL.translate([{Title: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}='Blue T-Shirt'))`);

    translation = KeyQL.translate([{Title: `'Quotes' + "In" + 'fields'`}], language);
    expect(translation).to.equal(`OR(AND({Title}=''&"'"&'Quotes'&"'"&' + "In" + '&"'"&'fields'&"'"&''))`);

  });

  it('Should translate query with "is" operator', () => {

    let translation;

    translation = KeyQL.translate([{Title__is: 'T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}='T-Shirt'))`);

    translation = KeyQL.translate([{Title__is: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}='Blue T-Shirt'))`);

    translation = KeyQL.translate([{Title__is: `'Quotes' + "In" + 'fields'`}], language);
    expect(translation).to.equal(`OR(AND({Title}=''&"'"&'Quotes'&"'"&' + "In" + '&"'"&'fields'&"'"&''))`);

  });

  it('Should translate query with "not" operator', () => {

    let translation;

    translation = KeyQL.translate([{Title__not: 'T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}!='T-Shirt'))`);

    translation = KeyQL.translate([{Title__not: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(`OR(AND({Title}!='Blue T-Shirt'))`);

    translation = KeyQL.translate([{Title__not: `'Quotes' + "In" + 'fields'`}], language);
    expect(translation).to.equal(`OR(AND({Title}!=''&"'"&'Quotes'&"'"&' + "In" + '&"'"&'fields'&"'"&''))`);

  });

  it('Should translate query with "gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gt: '99'}], language);
    expect(translation).to.equal(`OR(AND({price}>'99'))`);

    translation = KeyQL.translate([{price__gt: 99}], language);
    expect(translation).to.equal(`OR(AND({price}>'99'))`);

    translation = KeyQL.translate([{price__gt: 99.99}], language);
    expect(translation).to.equal(`OR(AND({price}>'99.99'))`);

    translation = KeyQL.translate([{price__gt: '99.99'}], language);
    expect(translation).to.equal(`OR(AND({price}>'99.99'))`);

    translation = KeyQL.translate([{price__gt: 100.00}], language);
    expect(translation).to.equal(`OR(AND({price}>'100'))`);

    translation = KeyQL.translate([{price__gt: '100.00'}], language);
    expect(translation).to.equal(`OR(AND({price}>'100.00'))`);

    translation = KeyQL.translate([{created_at__gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}>'2020-05-18T19:13:00Z'))`);

  });

  it('Should translate query with "gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__gte: '99'}], language);
    expect(translation).to.equal(`OR(AND({price}>='99'))`);

    translation = KeyQL.translate([{price__gte: 99}], language);
    expect(translation).to.equal(`OR(AND({price}>='99'))`);

    translation = KeyQL.translate([{price__gte: 99.99}], language);
    expect(translation).to.equal(`OR(AND({price}>='99.99'))`);

    translation = KeyQL.translate([{price__gte: '99.99'}], language);
    expect(translation).to.equal(`OR(AND({price}>='99.99'))`);

    translation = KeyQL.translate([{price__gte: 100.00}], language);
    expect(translation).to.equal(`OR(AND({price}>='100'))`);

    translation = KeyQL.translate([{price__gte: '100.00'}], language);
    expect(translation).to.equal(`OR(AND({price}>='100.00'))`);

    translation = KeyQL.translate([{created_at__gte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}>='2020-05-18T19:13:00Z'))`);

  });

  it('Should translate query with "lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lt: '99'}], language);
    expect(translation).to.equal(`OR(AND({price}<'99'))`);

    translation = KeyQL.translate([{price__lt: 99}], language);
    expect(translation).to.equal(`OR(AND({price}<'99'))`);

    translation = KeyQL.translate([{price__lt: 99.99}], language);
    expect(translation).to.equal(`OR(AND({price}<'99.99'))`);

    translation = KeyQL.translate([{price__lt: '99.99'}], language);
    expect(translation).to.equal(`OR(AND({price}<'99.99'))`);

    translation = KeyQL.translate([{price__lt: 100.00}], language);
    expect(translation).to.equal(`OR(AND({price}<'100'))`);

    translation = KeyQL.translate([{price__lt: '100.00'}], language);
    expect(translation).to.equal(`OR(AND({price}<'100.00'))`);

    translation = KeyQL.translate([{created_at__lt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}<'2020-05-18T19:13:00Z'))`);

  });

  it('Should translate query with "lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{price__lte: '99'}], language);
    expect(translation).to.equal(`OR(AND({price}<='99'))`);

    translation = KeyQL.translate([{price__lte: 99}], language);
    expect(translation).to.equal(`OR(AND({price}<='99'))`);

    translation = KeyQL.translate([{price__lte: 99.99}], language);
    expect(translation).to.equal(`OR(AND({price}<='99.99'))`);

    translation = KeyQL.translate([{price__lte: '99.99'}], language);
    expect(translation).to.equal(`OR(AND({price}<='99.99'))`);

    translation = KeyQL.translate([{price__lte: 100.00}], language);
    expect(translation).to.equal(`OR(AND({price}<='100'))`);

    translation = KeyQL.translate([{price__lte: '100.00'}], language);
    expect(translation).to.equal(`OR(AND({price}<='100.00'))`);

    translation = KeyQL.translate([{created_at__lte: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}<='2020-05-18T19:13:00Z'))`);

  });

  it('Should translate query with "contains" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__contains: '@autocode.com'}], language);
    expect(translation).to.equal(`OR(AND(IF(T({email}),SEARCH('@autocode.com',{email}),SEARCH('¤¤¤'&'@autocode.com'&'¤¤¤','¤¤¤'&ARRAYJOIN({email},'¤¤¤')&'¤¤¤'))))`);

  });

  it('Should translate query with "icontains" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__icontains: '@AuTOCodE.com'}], language);
    expect(translation).to.equal(`OR(AND(IF(T({email}),SEARCH(LOWER('@AuTOCodE.com'),LOWER({email})),SEARCH('¤¤¤'&LOWER('@AuTOCodE.com')&'¤¤¤','¤¤¤'&LOWER(ARRAYJOIN({email},'¤¤¤'))&'¤¤¤'))))`);

  });

  it('Should translate query with "startswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__startswith: 'person@'}], language);
    expect(translation).to.equal(`OR(AND(LEFT({email},7)='person@'))`);

  });

  it('Should translate query with "istartswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__istartswith: 'person@'}], language);
    expect(translation).to.equal(`OR(AND(LOWER(LEFT({email},7))=LOWER('person@')))`);

  });

  it('Should translate query with "endswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__endswith: '@autocode.com'}], language);
    expect(translation).to.equal(`OR(AND(RIGHT({email},13)='@autocode.com'))`);

  });

  it('Should translate query with "iendswith" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__iendswith: '@aUTOcoDe.com'}], language);
    expect(translation).to.equal(`OR(AND(LOWER(RIGHT({email},13))=LOWER('@aUTOcoDe.com')))`);

  });

  it('Should translate query with "is_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__is_null: true}], language);
    expect(translation).to.equal('OR(AND({email}=BLANK()))');

  });

  it('Should translate query with "not_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{email__not_null: true}], language);
    expect(translation).to.equal('OR(AND({email}!=BLANK()))');

  });

  it('Should translate query with "is_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_true: true}], language);
    expect(translation).to.equal('OR(AND({is_price_reduced}=TRUE()))');

  });

  it('Should translate query with "not_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_true: true}], language);
    expect(translation).to.equal('OR(AND({is_price_reduced}!=TRUE()))');

  });

  it('Should translate query with "is_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__is_false: true}], language);
    expect(translation).to.equal('OR(AND({is_price_reduced}=FALSE()))');

  });

  it('Should translate query with "not_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{is_price_reduced__not_false: true}], language);
    expect(translation).to.equal('OR(AND({is_price_reduced}!=FALSE()))');

  });

  it('Should translate query with "in" operator', () => {

    let translation;

    translation = KeyQL.translate([{Title__in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal(`OR(AND(OR({Title}='T-Shirt',{Title}='Jeans',{Title}='Shoes')))`);

    translation = KeyQL.translate([{Title__in: ['T-Shirt']}], language);
    expect(translation).to.equal(`OR(AND(OR({Title}='T-Shirt')))`);

    translation = KeyQL.translate([{Title__in: []}], language);
    expect(translation).to.equal('OR(AND(OR()))');

  });

  it('Should translate query with "not_in" operator', () => {

    let translation;

    translation = KeyQL.translate([{Title__not_in: ['T-Shirt', 'Jeans', 'Shoes']}], language);
    expect(translation).to.equal(`OR(AND(AND({Title}!='T-Shirt',{Title}!='Jeans',{Title}!='Shoes')))`);

    translation = KeyQL.translate([{Title__not_in: ['T-Shirt']}], language);
    expect(translation).to.equal(`OR(AND(AND({Title}!='T-Shirt')))`);

    translation = KeyQL.translate([{Title__not_in: []}], language);
    expect(translation).to.equal('OR(AND(AND()))');

  });

  it('Should translate query with "recency_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{created_at__recency_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND(AND({created_at}>'${twoHoursAgo.toISOString()}',{created_at}<='${nowUTC.toISOString()}')))`);

  });

  it('Should translate query with "recency_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{created_at__recency_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND(AND({created_at}>='${twoHoursAgo.toISOString()}',{created_at}<='${nowUTC.toISOString()}')))`);

  });

  it('Should translate query with "recency_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{created_at__recency_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND({created_at}<'${twoHoursAgo.toISOString()}'))`);

  });

  it('Should translate query with "recency_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{created_at__recency_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND({created_at}<='${twoHoursAgo.toISOString()}'))`);

  });

  it('Should translate query with "upcoming_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{created_at__upcoming_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND(AND({created_at}>='${nowUTC.toISOString()}',{created_at}<'${twoHoursFromNow.toISOString()}')))`);

  });

  it('Should translate query with "upcoming_lte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{created_at__upcoming_lte: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND(AND({created_at}>='${nowUTC.toISOString()}',{created_at}<='${twoHoursFromNow.toISOString()}')))`);

  });

  it('Should translate query with "upcoming_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{created_at__upcoming_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND({created_at}>'${twoHoursFromNow.toISOString()}'))`);

  });

  it('Should translate query with "upcoming_gte" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{created_at__upcoming_gte: secondsInTwoHours}], language);
    expect(translation).to.equal(`OR(AND({created_at}>='${twoHoursFromNow.toISOString()}'))`);

  });

  it('Should translate query with "date_lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lt: '2020-05-18T19:13:00.000Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}<'2020-05-18T19:13:00.000Z'))`);

    translation = KeyQL.translate([{created_at__date_lt: new Date('2020-04-06T10:25:49-07:00')}], language);
    expect(translation).to.equal(`OR(AND({created_at}<'2020-04-06T17:25:49.000Z'))`);

  });

  it('Should translate query with "date_lte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_lte: '2020-05-18T19:13:00.000Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}<='2020-05-18T19:13:00.000Z'))`);

    translation = KeyQL.translate([{created_at__date_lte: new Date('2020-04-06T10:25:49-07:00')}], language);
    expect(translation).to.equal(`OR(AND({created_at}<='2020-04-06T17:25:49.000Z'))`);

  });

  it('Should translate query with "date_gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gt: '2020-05-18T19:13:00Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}>'2020-05-18T19:13:00.000Z'))`);

    translation = KeyQL.translate([{created_at__date_gt: new Date('2020-04-06T10:25:49-07:00')}], language);
    expect(translation).to.equal(`OR(AND({created_at}>'2020-04-06T17:25:49.000Z'))`);

  });

  it('Should translate query with "date_gte" operator', () => {

    let translation;

    translation = KeyQL.translate([{created_at__date_gte: '2020-05-18T19:13:00.000Z'}], language);
    expect(translation).to.equal(`OR(AND({created_at}>='2020-05-18T19:13:00.000Z'))`);

    translation = KeyQL.translate([{created_at__date_gte: new Date('2020-04-06T10:25:49-07:00')}], language);
    expect(translation).to.equal(`OR(AND({created_at}>='2020-04-06T17:25:49.000Z'))`);

  });

  it('Should translate chained operators', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans'}], language);
    expect(translation).to.equal(`OR(AND({title}='T-Shirt',{title}!='Jeans'))`);

    translation = KeyQL.translate([{title: 'T-Shirt', title__not: 'Jeans', price__gt: '99'}], language);
    expect(translation).to.equal(`OR(AND({title}='T-Shirt',{title}!='Jeans',{price}>'99'))`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}], language);
    expect(translation).to.equal(`OR(AND({title}='T-Shirt'),AND({title}!='Jeans'))`);

    translation = KeyQL.translate([{title: 'T-Shirt'}, {title__not: 'Jeans'}, {title__not: 'Shoes'}], language);
    expect(translation).to.equal(`OR(AND({title}='T-Shirt'),AND({title}!='Jeans'),AND({title}!='Shoes'))`);

    translation = KeyQL.translate([{title: 'T-Shirt', price__lt: 99.99}, {title__not: 'Jeans', is_price_reduced__is_true: true}, {title__not: 'Shoes', created_at__recency_lte: secondsInTwoHours }], language);
    expect(translation).to.equal(`OR(AND({title}='T-Shirt',{price}<'99.99'),AND({title}!='Jeans',{is_price_reduced}=TRUE()),AND({title}!='Shoes',AND({created_at}>='${twoHoursAgo.toISOString()}',{created_at}<='${nowUTC.toISOString()}')))`);

    translation = KeyQL.translate([
      {
        title__in: ['Shoes', 'Hat', 'Jeans'],
        created_at__lte: '2020-05-18T19:13:00.000Z'
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
    expect(translation).to.equal(`OR(AND(OR({title}='Shoes',{title}='Hat',{title}='Jeans'),{created_at}<='2020-05-18T19:13:00.000Z'),AND({price}>='99.99',{is_price_reduced}!=TRUE()),AND({inventory_total}='1000'),AND({out_of_stock_somewhere}=FALSE()))`);

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
