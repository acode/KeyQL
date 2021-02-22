const expect = require('chai').expect;

const moment = require('moment');

const KeyQL = require('../module/index.js');

const mockDateMs = 1607471504386;

describe('KeyQL to HeightFilter Translation Tests', () => {

  let language = 'HeightFilter';
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

    translation = KeyQL.translate([{status: 'backLog'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}]}]}));

    translation = KeyQL.translate([{title: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"title": {"values": ["Blue T-Shirt"]}}]}]}));

  });

  it('Should translate query with "is" operator', () => {
    let translation;

    translation = KeyQL.translate([{status__is: 'backLog'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}]}]}));

    translation = KeyQL.translate([{title__is: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"title": {"values": ["Blue T-Shirt"]}}]}]}));

  });

  it('Should translate query with "not" operator', () => {
    let translation;

    translation = KeyQL.translate([{status__not: 'backLog'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{ "not": [{"status": {"values": ["backLog"]}}]}]}]}));

    translation = KeyQL.translate([{title__not: 'Blue T-Shirt'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"title": {"values": ["Blue T-Shirt"]}}]}]}]}));

  });

  it('Should translate query with "is_null" operator', () => {
    let translation;

    translation = KeyQL.translate([{assigneesIds__is_null: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{ "assigneesIds": {"values": ["NONE_VALUE_ID"]}}]}]}));

  });

  it('Should translate query with "is_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{completed__is_true: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"completed": {"values": [true]}}]}]}));

  });

  it('Should translate query with "is_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{completed__is_false: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"completed": {"values": [false]}}]}]}));

  });

  it('Should translate query with "not_null" operator', () => {

    let translation;

    translation = KeyQL.translate([{completed__not_null: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"completed": {"values": ["NONE_VALUE_ID"]}}]}]}]}));

  });

  it('Should translate query with "not_true" operator', () => {

    let translation;

    translation = KeyQL.translate([{completed__not_true: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"completed": {"values": [true]}}]}]}]}));

  });

  it('Should translate query with "not_false" operator', () => {

    let translation;

    translation = KeyQL.translate([{completed__not_false: true}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"completed": {"values": [false]}}]}]}]}));

  });

  it('Should translate query with "in" operator', () => {

    let translation;

    translation = KeyQL.translate([{status__in: ['backLog', 'inProgress']}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog", "inProgress"]}}]}]}));

    translation = KeyQL.translate([{status__in: ['backLog']}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}]}]}));

    translation = KeyQL.translate([{status__in: []}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": []}}]}]}));

  });

  it('Should translate query with "not_in" operator', () => {

    let translation;

    translation = KeyQL.translate([{status__not_in: ['backLog', 'inProgress']}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"status": {"values": ["backLog", "inProgress"]}}]}]}]}));

    translation = KeyQL.translate([{status__not_in: ['backLog']}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"status": {"values": ["backLog"]}}]}]}]}));

    translation = KeyQL.translate([{status__not_in: []}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"not": [{"status": {"values": []}}]}]}]}));

  });

  it('Should translate query with "recency_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{createdAt__recency_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"and": [{"createdAt": {"gt": {"date": twoHoursAgo.toISOString()}}}, {"createdAt": {"lt": {"date": nowUTC.toISOString()}}}]}]}]}));

  });

  it('Should translate query with "recency_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');

    translation = KeyQL.translate([{createdAt__recency_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"createdAt": {"lt": {"date": twoHoursAgo.toISOString()}}}]}]}));

  });

  it('Should translate query with "upcoming_lt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{createdAt__upcoming_lt: secondsInTwoHours}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"and": [{"createdAt": {"gt": {"date": nowUTC.toISOString()}}}, {"createdAt": {"lt": {"date": twoHoursFromNow.toISOString()}}}]}]}]}));

  });

  it('Should translate query with "upcoming_gt" operator', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours');

    translation = KeyQL.translate([{createdAt__upcoming_gt: secondsInTwoHours}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"createdAt": {"gt": {"date": twoHoursFromNow.toISOString()}}}]}]}));

  });

  it('Should translate query with "date_lt" operator', () => {

    let translation;

    translation = KeyQL.translate([{createdAt__date_lt: '2021-02-22T09:56:57.726Z'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"createdAt": {"lt": {"date": "2021-02-22T09:56:57.726Z"}}}]}]}));

  });

  it('Should translate query with "date_gt" operator', () => {

    let translation;

    translation = KeyQL.translate([{createdAt__date_gt: '2021-02-22T09:56:57.726Z'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"createdAt": {"gt": {"date": "2021-02-22T09:56:57.726Z"}}}]}]}));

  });

  it('Should translate chained operators', () => {

    let translation;
    let secondsInTwoHours = 2 * 60 * 60;
    let nowUTC = moment.utc(moment.now());
    let twoHoursAgo = moment(nowUTC).subtract(2, 'hours');
    let twoHoursFromNow = moment(nowUTC).add(2, 'hours')

    translation = KeyQL.translate([{status: 'backLog', status__not: 'inProgress'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}, {"not": [{"status": {"values": ["inProgress"]}}]}]}]}));

    translation = KeyQL.translate([{status: 'backLog', status__not: 'inProgress', createdAt__date_gt: '2021-02-22T09:56:57.726Z'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}, {"not": [{"status": {"values": ["inProgress"]}}]}, {"createdAt": {"gt": {"date": "2021-02-22T09:56:57.726Z"}}}]}]}));

    translation = KeyQL.translate([{status: 'backLog'}, {status__not: 'inProgress'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}]}, {"and": [{"not": [{"status": {"values": ["inProgress"]}}]}]}]}));

    translation = KeyQL.translate([{status: 'backLog'}, {status__not: 'inProgress'}, {status__not: 'done'}], language);
    expect(translation).to.equal(JSON.stringify({"or": [{"and": [{"status": {"values": ["backLog"]}}]}, {"and": [{"not": [{"status": {"values": ["inProgress"]}}]}]}, {"and": [{"not": [{"status": {"values": ["done"]}}]}]}]}));

    translation = KeyQL.translate([{status: 'backLog', createdAt__date_lt: '2021-02-22T09:56:57.726Z'}, {status__not: 'inProgress', completed__is_true: true}, {status__not: 'done', createdAt__recency_lt: secondsInTwoHours }], language);
    expect(translation).to.equal(JSON.stringify({
      "or": [
        {
          "and": [
            {
              "status": {"values": ["backLog"]}
            },
            {
              "createdAt": {"lt": {"date": "2021-02-22T09:56:57.726Z"}}
            }
          ]
        },
        {
          "and": [
            {
              "not": [
                {
                  "status": {"values": ["inProgress"]}
                }
              ]
            },
            {
              "completed": {"values": [true]}
            }
          ]
        },
        {
          "and": [
            {
              "not": [
                {
                  "status": {"values": ["done"]}
                }
              ]
            },
            {
              "and": [
                {
                  "createdAt": {
                    "gt": {"date": twoHoursAgo.toISOString()}
                  }
                },
                {
                  "createdAt": {
                    "lt": {"date": nowUTC.toISOString()}
                  }
                }
              ]
            }
          ]
        }
      ]
    }));

    translation = KeyQL.translate([
      {
        status__in: ['backLog', 'inProgress', 'done'],
        createdAt__date_lt: '2020-05-18T19:13:00.000Z'
      },
      {
        completedAt__upcoming_gt: secondsInTwoHours,
        completed__not_true: true,
      },
      {
        index: 18
      },
      {
        deleted__is_false: true
      }
    ], language);

    expect(translation).to.equal(JSON.stringify({
      "or": [
        {
          "and": [
            {
              "status": {"values": ["backLog", "inProgress", "done"]}
            },
            {
              "createdAt": {"lt": {"date": "2020-05-18T19:13:00.000Z"}}
            }
          ]
        },
        {
          "and": [
            {
              "completedAt": {"gt": {"date": twoHoursFromNow.toISOString()}}
            },
            {
              "not": [
                {"completed": {"values": [true]}}
              ]
            }
          ]
        },
        {
          "and": [
            {"index": {"values": ["18"]}}
          ]
        },
        {
          "and": [
            {"deleted": {"values": [false]}}
          ]
        }
      ]
    }));

  });

  it('Should throw an error with translating unsupported operator "gt"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__gt: 10}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"gt"');

  });

  it('Should throw an error with translating unsupported operator "lt"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__lt: 10}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"lt"');

  });

  it('Should throw an error with translating unsupported operator "gte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__gte: 10}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"gte"');

  });

  it('Should throw an error with translating unsupported operator "lte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__lte: 10}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"lte"');

  });

  it('Should throw an error with translating unsupported operator "icontains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__icontains: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"icontains"');

  });

  it('Should throw an error with translating unsupported operator "contains"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__contains: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"contains"');

  });

  it('Should throw an error with translating unsupported operator "startswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__startswith: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"startswith"');

  });

  it('Should throw an error with translating unsupported operator "istartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__istartswith: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"istartswith"');

  });

  it('Should throw an error with translating unsupported operator "wordstartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__wordstartswith: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"wordstartswith"');

  });

  it('Should throw an error with translating unsupported operator "iwordstartswith"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__iwordstartswith: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"iwordstartswith"');

  });

  it('Should throw an error with translating unsupported operator "like"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__like: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"like"');

  });

  it('Should throw an error with translating unsupported operator "ilike"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__ilike: 'something'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"ilike"');

  });

  it('Should throw an error with translating unsupported operator "recency_lte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__recency_lte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"recency_lte"');

  });

  it('Should throw an error with translating unsupported operator "recency_gte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__recency_gte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"recency_gte"');

  });

  it('Should throw an error with translating unsupported operator "upcoming_lte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__upcoming_lte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"upcoming_lte"');

  });

  it('Should throw an error with translating unsupported operator "upcoming_gte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__upcoming_gte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"upcoming_gte"');

  });

  it('Should throw an error with translating unsupported operator "date_lte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__date_lte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"date_lte"');

  });

  it('Should throw an error with translating unsupported operator "date_gte"', () => {

    let translation, error;

    try {
      translation = KeyQL.translate([{status__date_gte: '2020-05-18T19:13:00.000Z'}], language);
    } catch (e) {
      error = e;
    }
    expect(error).to.exist;
    expect(error.message).to.contain('"date_gte"');

  });

});
