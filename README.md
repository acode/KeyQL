# KeyQL

![travis-ci build](https://travis-ci.org/FunctionScript/KeyQL.svg?branch=master)

KeyQL is a language for querying datasets using key-value pairs. It is primarily
intended to be used with [FunctionScript](https://github.com/FunctionScript/functionscript)
APIs, where JSON or HTTP Query Parameter key-value pairs can be used to encode
query requests to underlying datasets.

By adhering to the KeyQL specification, your developers and users will have a
significantly easier time learning how to work with your APIs and datasets.

For example, you may have an HTTP API built on [Standard Library](https://stdlib.com/).
In this project, you have set up a `users/select` endpoint and want to query your
user dataset for **every username that contains `"ke"`** in a case-insensitive
fashion.

```
HTTP POST
https://$user.api.stdlib.com/project@dev/users/select
{
  "query": {
    "username__icontains": "ke"
  }
}
```

With the intended response being something like:
```
[
  {username: 'Kelly', profile_image: 'boop.jpg'},
  {username: 'Kevin', profile_image: 'snoot.jpg'}
]
```

The KeyQL specification removes the cognitive overhead of choosing how to
structure your query requests.

## Comparison vs. GraphQL

KeyQL is not meant to act as a stand-in or replacement for GraphQL. You can
think of it more like a lightweight cousin: a midpoint between the wild-west of
loosely opinionated SOAP and REST requests and the highly-structured, opinionated
and complex world of GraphQL.

Whereas GraphQL provides an interface and opinions around manipulating large,
graph-structured datasets and can define an entire backend architecture,
KeyQL takes a more minimalistic and piecemeal approach -- providing a simple
structure for writing queries using JSON.

## Specification

The KeyQL specification is heavily inspired by [Django](https://www.djangoproject.com/)'s ORM
and over five years of work manipulating datasets on both the front and back-end
of web projects, primarily working with JSON and SQL queries. It's the culmination
of best practices learned implementing [DataCollection.js](https://github.com/keithwhor/DataCollection.js) and
[Nodal](https://github.com/keithwhor/nodal)'s ORM.

*This README will be updated shortly with a structured description and breakdown
of KeyQL queries.*

## Installation and Usage

The KeyQL implementation provided as part of this GitHub repository is intended
for use in the Node.js ecosystem, using the package `keyql`. Right now, it can
be used to automatically filter JSON datasets (arrays of objects) based on a specified
query. In the future, we intend to migrate the [Nodal](https://github.com/keithwhor/nodal) Query Composer (ORM)
to be able to automatically generate SQL queries from a provided KeyQL statement.

*This README will be updated shortly with usage examples*

## Acknowledgements

KeyQL is (c) 2019 Polybit Inc.
