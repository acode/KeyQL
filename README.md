# KeyQL

![KeyQL Logo](/images/keyql-logo.png)

![travis-ci build](https://travis-ci.org/FunctionScript/KeyQL.svg?branch=master)
![npm version](https://badge.fury.io/js/keyql.svg)

KeyQL is a language, specification and package for querying datasets using key-value pairs.
It is heavily inspired by the simplicity and ease-of-use of [Django](https://djangoproject.com)
and similar ORMs.
The provided Node.js package can be used to filter large JSON datasets from within any
codebase, but the primary purpose of KeyQL is to be used with [FunctionScript](https://github.com/FunctionScript/FunctionScript)
APIs, where JSON or HTTP Query Parameter key-value pairs can be used to encode
query requests to underlying datasets.

KeyQL is meant for easy querying of JSON datasets, spreadsheet data,
information retrieved from APIs such as [Airtable](https://airtable.com) and
more. It can be used to add robust querying capabilities to existing APIs
without a massive architectural lift and shift.

The motivation for KeyQL differs from that of GraphQL. KeyQL is intended to provide a
simple querying interface to existing imperative APIs and relatively flat
datasets. The operators (comparators) are the most important feature and are
meant to be easily interpretable by even the newest developer. KeyQL and GraphQL
can, in theory, coexist within a single codebase or API implementation.
KeyQL is **not intended** to be used to define an entire backend architecture
and provides no opinions on the graph-based structure of output data
(you do not define schemas with it).

# Live Demo

You can play with KeyQL live, as part of a [FunctionScript](https://github.com/FunctionScript/FunctionScript) API endpoint,
by using [Code on Standard Library](https://code.stdlib.com/?gist=1b9b61e12b8ae86f689fd07cc0f9f136&filename=functions/keyql.js). A link has been provided to a demo below.

**Note:** *In order to use Code on Standard Library you must have a registered account on [stdlib.com](https://stdlib.com), available for free.*

https://code.stdlib.com/?gist=1b9b61e12b8ae86f689fd07cc0f9f136&filename=functions/keyql.js

[![KeyQL Demo](/images/keyql-demo.gif)](https://code.stdlib.com/?gist=1b9b61e12b8ae86f689fd07cc0f9f136&filename=functions/keyql.js)

# Quick Example

A quick example of using KeyQL with a [FunctionScript](https://github.com/FunctionScript/FunctionScript)
API would look like:

**Filename:** `/dataset.json`
```json
[
  {
    "id": 1,
    "fields": {
      "name": "Alice",
      "birthdate": "12/01/1988",
      "pets": 2
    }
  },
  {
    "id": 2,
    "fields": {
      "name": "Bernard",
      "birthdate": "11/11/1972",
      "pets": 5
    }
  },
  {
    "id": 3,
    "fields": {
      "name": "Christine",
      "birthdate": "01/05/1991",
      "pets": 0
    }
  }
]
```

**Filename:** `/functions/__main__.js`
```javascript
const KeyQL = require('keyql');
const dataset = require('../dataset.json');
// Searching through the "fields" object in each row
const kqlDataset = new KeyQL(dataset, row => row.fields);

/**
* Query a dataset based on an Array of Objects
* @param {object.keyql.query} where A list of fields to query for
* @returns {array} result The result list
*/
module.exports = async (where = {}) => {

  return kqlDataset.query()
    .select([where]) // Wrap in array if provided a raw object
    .values();

};
```

An HTTP POST request containing:

```json
{
  "where": {
    "pets__gt": 3
  }
}
```

Would return:

```json
[
  {
    "id": 2,
    "fields": {
      "name": "Bernard",
      "birthdate": "11/11/1972",
      "pets": 5
    }
  }
]
```

# Table of Contents

1. [Introduction](#introduction)
1. [Specification](#specification)
   1. [Writing Queries](#writing-queries)
   1. [Supported Operators](#supported-operators)
1. [Installation and Usage](#installation-and-usage)
   1. [Methods](#methods)
1. [Comparison to GraphQL](#comparison-to-graphql)
1. [Acknowledgements](#acknowledgements)
   1. [Roadmap](#roadmap)

# Introduction

By adhering to the KeyQL specification, your developers and users will have a
significantly easier time learning how to work with your APIs and datasets.

For example, you may have an HTTP API built on [Standard Library](https://stdlib.com/).
In this project, you have set up a `users/select` endpoint and want to query your
user dataset for **every username that contains `"ke"`** in a case-insensitive
fashion.

```
HTTP POST https://$user.api.stdlib.com/project@dev/users/select
{
  "query": {
    "username__icontains": "ke"
  }
}
```

With the intended response being something like:
```json
[
  {
    "username": "Kelly",
    "profile_image": "boop.jpg"
  },
  {
    "username": "Kevin",
    "profile_image": "snoot.jpg"
  }
]
```

The KeyQL specification removes the cognitive overhead of choosing how to
structure your query requests.

# Specification

The KeyQL specification is heavily inspired by [Django](https://www.djangoproject.com/)'s ORM
and over five years of work manipulating datasets on both the front and back-end
of web projects, primarily working with JSON and SQL queries. It's the culmination
of best practices learned implementing [DataCollection.js](https://github.com/keithwhor/DataCollection.js) and
[Nodal](https://github.com/keithwhor/nodal)'s ORM.

## Writing Queries

Writing KeyQL Queries is as simple as preparing a JSON Object. For example,
in a dataset that has records that look like...

```javascript
// Example dataset in JavaScript
[
  {
    first_name: 'Dolores',
    last_name: 'Abernathy',
    is_host: true,
    eye_color: 'blue',
    hair_color: 'blonde',
    location_in_park: null,
    age: 250
  }
]
```

You could write a query against it that returns...

### Query: All entries with `first_name` = `Dolores`

```json
[
  {
    "first_name": "Dolores"
  }
]
```

### Query: `first_name` = `Dolores` AND `eye_color` in `blue`, `green`

```json
[
  {
    "first_name": "Dolores",
    "eye_color__in": ["blue", "green"]
  }
]
```

### Query: `first_name` = `Dolores` OR `first_name` = `Teddy`

```json
[
  {
    "first_name": "Dolores"
  },
  {
    "first_name": "Teddy"
  }
]
```

## Supported Operators

All operators in KeyQL queries are preceded by a `__` delimiter. To reiterate
from the previous section, this means you can query the field `first_name` with;

```javascript
"first_name" // (default to "is" operator)
"first_name__is"
"first_name__startswith"
"first_name__gte"
```

### Full List of Supported Operators

The following table assumes that `queryValue` is the value you're searching for
provided a specified key, and `entryValue` is the matching entry in a dataset.

| Operator | Behavior |
| -------- | -------- |
| is | Finds all matching entries. Returns `entryValue === queryValue` (exact match, type included). |
| not | Finds all non-matching entries. Returns `entryValue !== queryValue` (exact match, type included). |
| gt | Finds all entries **greater than** specified value. Returns `entryValue > queryValue`. |
| gte | Finds all entries **greater than or equal to** specified value. Returns `entryValue >= queryValue`. |
| lt | Finds all entries **less than** specified value. Returns `entryValue < queryValue`. |
| lte | Finds all entries **less than or equal to** specified value. Returns `entryValue <= queryValue`. |
| contains | Finds all entries **containing** the **exact** provided value. Works when `entryValue` is a `string` or an `array`. |
| icontains | Finds all entries **containing** the provided value, **case-insensitive**. Works when `entryValue` is a `string` or an `array`. |
| startswith | Finds all entries **starting with** the **exact** provided value. Works when `entryValue` is a `string`.
| istartswith | Finds all entries **starting with** the provided value, **case-insensitive**. Works when `entryValue` is a `string`. |
| endswith | Finds all entries **ending with** the **exact** provided value. Works when `entryValue` is a `string`. |
| iendswith | Finds all entries **ending with** the provided value, **case-insensitive**. Works when `entryValue` is a `string`. |
| is_null | Finds all entries where `entryValue === null`, **`queryValue` is ignored**. |
| is_true | Finds all entries where `entryValue === true`, **`queryValue` is ignored**. |
| is_false | Finds all entries where `entryValue === false`, **`queryValue` is ignored**. |
| not_null | Finds all entries where `entryValue !== null`, **`queryValue` is ignored**. |
| not_true | Finds all entries where `entryValue !== true`, **`queryValue` is ignored**. |
| not_false | Finds all entries where `entryValue !== false`, **`queryValue` is ignored**. |
| in | Finds all entries **within** the provided value, intended to match when `queryValue` is an `array` but works with `string` input. |
| not_in | Finds all entries **not in** the provided value, intended to match when `queryValue` is an `array` but works with `string` input. |
| recency_lt | Finds all entries where `DATE(entryValue)` is recent within less than `queryValue` in number of seconds. i.e. `"field__recency__lt": 3600` would look for entries that have `field` as a date/timestamp within the past hour (exclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_lte | Finds all entries where `DATE(entryValue)` is recent within less than or equal to `queryValue` in number of seconds. i.e. `"field__recency__lte": 3600` would look for entries that have `field` as a date/timestamp within the past hour (inclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_gt | Finds all entries where `DATE(entryValue)` has a recency greater than `queryValue` in number of seconds. i.e. `"field__recency__gt": 3600` would look for entries that have `field` as a date/timestamp outside the past hour (exclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_gte | Finds all entries where `DATE(entryValue)` has a recency greater than or equal to `queryValue` in number of seconds. i.e. `"field__recency__gte": 3600` would look for entries that have `field` as a date/timestamp outside the past hour (inclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_lt | Finds all entries where `DATE(entryValue)` is going to occur within less than `queryValue` in number of seconds. i.e. `"field__upcoming_lt": 3600` would look for entries that have `field` as a date/timestamp within the next hour (exclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_lte | Finds all entries where `DATE(entryValue)` is going to occur within less than or equal to `queryValue` in number of seconds. i.e. `"field__upcoming_lte": 3600` would look for entries that have `field` as a date/timestamp within the next hour (inclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_gt | Finds all entries where `DATE(entryValue)` is going to occur within greater than `queryValue` in number of seconds. i.e. `"field__upcoming_gt": 3600` would look for entries that have `field` as a date/timestamp outside the next hour (exclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_gte | Finds all entries where `DATE(entryValue)` is going to occur within greater than or equal to `queryValue` in number of seconds. i.e. `"field__upcoming_gte": 3600` would look for entries that have `field` as a date/timestamp outside the next hour (inclusive). ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| date_lt | Finds all entries where `DATE(entryValue)` is less than `DATE(queryValue)`, i.e. '12-06-1988' < '01-01-2019'.  ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| date_lte | Finds all entries where `DATE(entryValue)` is less than or equal to `DATE(queryValue)`, i.e. '12-06-1988' <= '12-06-1988'. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| date_gt | Finds all entries where `DATE(entryValue)` is greater than `DATE(queryValue)`, i.e. '12-06-1988' > '01-01-1980'. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| date_gte | Finds all entries where `DATE(entryValue)` is greater than or equal to `DATE(queryValue)`, i.e. '12-06-1988' >= '12-06-1988'. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |

# Installation and Usage

The KeyQL implementation provided as part of this GitHub repository is intended
for use in the Node.js ecosystem, using the package `keyql`. Right now, it can
be used to automatically filter JSON datasets (arrays of objects) based on a specified
query. In the future, we intend to migrate the [Nodal](https://github.com/keithwhor/nodal) Query Composer (ORM)
to be able to automatically generate SQL queries from a provided KeyQL statement.

You can install the package simply using [Node.js](https://nodejs.org) (10 or higher) and NPM:

```shell
$ npm i keyql --save
```

And use it in your Node.js project with:

```javascript
const KeyQL = require('keyql');

let dataset = [/* my dataset */]; // Your array of objects

const myDataset = new KeyQL(dataset);
myDataset.query()
  .select({value__gte: 5})
  .values(); // gets all records where "value" is > 5
```

## Node.js Examples

```javascript
const KeyQL = require('keyql');

const kqlDataset = new KeyQL(
  [
    {
      "id": 1,
      "fields": {
        "name": "Alice",
        "birthdate": "12/01/1988",
        "pets": 2
      }
    },
    {
      "id": 2,
      "fields": {
        "name": "Bernard",
        "birthdate": "11/11/1972",
        "pets": 5
      }
    },
    {
      "id": 3,
      "fields": {
        "name": "Christine",
        "birthdate": "01/05/1991",
        "pets": 0
      }
    }
  ],
  row => row.fields // mapping
);

// Basic query
kqlDataset.query()
  .select([{pets__gt: 3}])
  .values(); // gives Bernard

// OR query is adding additional array elements
kqlDataset.query()
  .select([{pets__gt: 3}, {pets__lt: 2}])
  .values(); // gives Bernard, Christine

// AND query is additional parameters in a single object
kqlDataset.query()
  .select([{name__in: ['Bernard', 'Christine'], pets: 5}])
  .values(); // gives Bernard

// Chaining will continue to filter datasets
kqlDataset.query()
  .select([{name__in: ['Bernard', 'Christine']}])
  .select([{pets__lt: 5})
  .values(); // gives Christine

// Updating can modify the base dataset
kql.query()
  .select([{birthdate__date_gt: '01-01-1980'}])
  .update({pets: 100}); // Sets Alice and Christine to have 100 pets
```

## KeyQL

The main KeyQL constructor. Used to wrap datasets to be able to query them.

### KeyQL#constructor

```
constructor (dataset = [], mapFunction = v => v)
```

Initializes a KeyQL Dataset

- **`dataset`** is an `array` of objects you wish to parse through
- **`mapFunction`** gives us information on how to query each object in a dataset

By default, **`mapFunction`** is a no-op. This works when your dataset looks like:

```json
[
  {"id": 1, "name": "Jane", "age": 27},
  {"id": 2, "name": "Stewart", "age": 43}
]
```

However, your dataset may not be this straightforward. Some APIs return nested field
values. For example, in the case of something like:

```json
[
  {
    "id": 1,
    "fields": {"name": "Jane", "age": 27}
  },
  {
    "id": 2,
    "fields": {"name": "Stewart", "age": 43}
  }
]
```

We would provide the **`mapFunction`** as `v => v.fields` instead.

### KeyQL#keys

```
keys ()
```

Returns the keys for the Dataset, extracted from the first object provided.

### KeyQL#rows

```
rows ()
```

Returns all rows in the Dataset as initially provided (**`mapFunction` applied**).

### KeyQL#dataset

```
dataset ()
```

Returns all entries in the Dataset as initially provided (**no `mapFunction` applied**).

### KeyQL#changeset

```
changeset ()
```

Returns all entries in the dataset that have been updated as a result of `KeyQLQueryCommand#update`
method calls. To create a copy of your dataset with all new changes committed
(reset the updated rows tracker), use `KeyQL#commit`

### KeyQL#commit

```
commit ()
```

Returns a copy of your KeyQL instance with the same dataset, but the changeset
will have been reset.

### KeyQL#query

```
query ()
```

Instantiates a `KeyQLQueryCommand` instance, which will create an immutable
history of all query commands.

## KeyQLQueryCommand

Created from `KeyQL#query`, an immutable record of a query history. Can be
chained indefinitely without overwriting previous `KeyQLQueryCommand` data.

For example:

```javascript
let kqlDataset = new KeyQL([/* my dataset */]);

let q1 = kqlDataset.query().select({first_name: 'Tim'});
let q2 = q1.select({age__gt: 20});

q1 === q2; // false
q1.values(); // Everybody named "Tim"
q2.values(); // Everybody named "Tim" with age > 20
```

### KeyQLQueryCommand#select

Returns a new `KeyQLQueryCommand` instance with a `select` command added.
Used to select values given a `KeyQLQuery`.

```
select (keyQLQuery = [])
```

- **`keyQLQuery`** is an `array` of `objects` intended to be used as the query

### KeyQLQueryCommand#limit

Returns a new `KeyQLQueryCommand` instance with a `limit` command added.
Used to select values given a `KeyQLLimit`.

```
select (keyQLLimit = {offset: 0, count: 0})
```

- **`keyQLLimit`** is an `object` containing the `offset` and `count` of records to return

### KeyQLQueryCommand#values

Executes a query and returns a subset of your primary `dataset` based
on previous `KeyQLQueryCommand`s in the chain.

```
values ()
```

Will return an `array` of `objects` from your primary `dataset`.

### KeyQLQueryCommand#update

Executes a query and returns a subset of your primary `dataset` based
on previous `KeyQLQueryCommand`s in the chain. Updates all values with the fields
provided.

```
update (fields = {})
```

- **`fields`** is an `object` containing key-value pairs you wish to update for match entries

Will update and return an `array` of `objects` from your primary `dataset`.

# Comparison to GraphQL

KeyQL is not meant to act as a stand-in or replacement for GraphQL. You can
think of it more like a lightweight cousin: a midpoint between the wild-west of
loosely opinionated SOAP and REST requests and the highly-structured, opinionated
and complex world of GraphQL.

Whereas GraphQL provides an interface and opinions around manipulating large,
graph-structured datasets and can define an entire backend architecture,
KeyQL takes a more minimalistic and piecemeal approach -- providing a simple
structure for writing queries using JSON.

# Acknowledgements

Thanks for checking out KeyQL. There's a lot more to come as the API is improved!

## Corporate Interests

Via investments in Polybit Inc., parent of [Standard Library](https://stdlib.com),
the following companies have invested countless hours in and provided financial
support for our team, which has made this project possible.

[Stripe](https://stripe.com), the global leader in online payments

[![Stripe Logo](/images/stripe-logo-300.png)](https://stripe.com)

[Slack](https://slack.com), the online platform for work and communication

[![Slack Logo](/images/slack-logo-300.png)](https://slack.com)

## Special Thanks

There have been a number of helpful supporters and contributors along the way,
and both KeyQL and [FunctionScript](https://github.com/FunctionScript/FunctionScript)
would not be possible without any of them.

### Core Contributors

- [**Keith Horwood**](https://twitter.com/keithwhor)
- [**Jacob Lee**](https://twitter.com/hacubu)
- [**Steve Meyer**](https://twitter.com/notoriaga)

### Thanks to Airtable

A special thanks to [Airtable](https://airtable.com) for providing a wonderful
product and service. It has allowed our team to focus more on making backend tooling
and development accessible to a larger number of developers and developers-to-be.
Without it, this project would be unlikely to exist in present form.

[![Airtable Logo](/images/airtable-logo-300.png)](https://airtable.com)

## Roadmap

- **(High Priority)** Support type coercion of `entryValue` and `queryValue`
- **(Low Priority)** PostgreSQL Support (re: [Nodal](https://github.com/keithwhor/nodal))

KeyQL is (c) 2019 Polybit Inc.
