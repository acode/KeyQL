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

});
