# KeyQL

![travis-ci build](https://travis-ci.org/FunctionScript/KeyQL.svg?branch=master)
![npm version](https://badge.fury.io/js/keyql.svg)

KeyQL is a language for querying datasets using key-value pairs. The provided
package can be used to filter large JSON datasets in Node.js, but the primary
purpose of KeyQL is to be used with [FunctionScript](https://github.com/FunctionScript/FunctionScript)
APIs, where JSON or HTTP Query Parameter key-value pairs can be used to encode
query requests to underlying datasets.

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
| lte | Finds all entries **less than or equal to** specified value. Returns `entryValue < queryValue`. |
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
| recency_lt | Finds all entries where `DATE(entryValue)` is recent within less than `queryValue` in number of seconds. i.e. `"field__is_recent": 3600` would look for entries that have `field` as a date/timestamp that has happened in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_lt | Finds all entries where `DATE(entryValue)` is recent within less than or equal to `queryValue` in number of seconds. i.e. `"field__is_recent": 3600` would look for entries that have `field` as a date/timestamp that has happened in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_gt | Finds all entries where `DATE(entryValue)` has a recency greater than `queryValue` in number of seconds. i.e. `"field__is_recent": 3600` would look for entries that have `field` as a date/timestamp that has happened in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| recency_gte | Finds all entries where `DATE(entryValue)` has a recency greater than or equal to `queryValue` in number of seconds. i.e. `"field__is_recent": 3600` would look for entries that have `field` as a date/timestamp that has happened in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_lt | Finds all entries where `DATE(entryValue)` is going to occur within less than `queryValue` in number of seconds. i.e. `"field__is_upcoming": 3600` would look for entries that have `field` as a date/timestamp that is going to happen in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_lte | Finds all entries where `DATE(entryValue)` is going to occur within less than or equal to `queryValue` in number of seconds. i.e. `"field__is_upcoming": 3600` would look for entries that have `field` as a date/timestamp that is going to happen in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_gt | Finds all entries where `DATE(entryValue)` is going to occur within greater than `queryValue` in number of seconds. i.e. `"field__is_upcoming": 3600` would look for entries that have `field` as a date/timestamp that is going to happen in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
| upcoming_gte | Finds all entries where `DATE(entryValue)` is going to occur within greater than or equal to `queryValue` in number of seconds. i.e. `"field__is_upcoming": 3600` would look for entries that have `field` as a date/timestamp that is going to happen in the past hour. ISO8601 Timestamps suggested, if no timezone entered UTC will be assumed. |
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
```

## Methods

As of right now, KeyQL supports two methods when querying native JavaScript datasets:
`select()` and `update()`:

### KeyQL.select

```
select (dataset = [], keyQLQuery = [], keyQLLimit = {offset: 0, count: 0}, mapFunction = v => v)
```

- **`dataset`** is an `array` of objects you wish to parse through
- **`keyQLQuery`** is an `array` of `objects` intended to be used as the query
- **`keyQLLimit`** is an `object` containing the `offset` and `count` of records to return
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

### KeyQL.update

```
update (dataset = [], fields = {}, keyQLQuery = [], keyQLLimit = {offset: 0, count: 0}, mapFunction = v => v) {
```

- **`dataset`** is an `array` of objects you wish to parse through
- **`fields`** is an `object` containing key-value pairs you wish to update for match entries
- **`keyQLQuery`** is an `array` of `objects` intended to be used as the query
- **`keyQLLimit`** is an `object` containing the `offset` and `count` of records to return
- **`mapFunction`** gives us information on how to query each object in a dataset, see above

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

Thanks for checking out KeyQL. There's a lot more to come as the API is improved.

## Roadmap

- **(High Priority)** Support type coercion of `entryValue` and `queryValue`
- **(High Priority)** Query immutability (return subsets of a dataset)
- **(Medium Priority)** Change tracking for update queries
- **(Low Priority)** PostgreSQL Support (re: [Nodal](https://github.com/keithwhor/nodal))

KeyQL is (c) 2019 Polybit Inc.
