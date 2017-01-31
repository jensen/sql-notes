# SQL from Apps 

When you were building TinyApp you stored the user and url data in an object. This object was in memory and when the server was stopped the data was lost. A database is the most common solution for storing persistant data for an application.

The data requirements for TinyApp were quite basic. If we were to model this in a relational database we would create two tables. One table would be for the users of the app. The other table would be used to store the urls. The urls table would have a foreign key reference back to a user to represent url ownership.

- A 'user' has many 'urls'
- A 'url' belongs to a 'user'

### Users Table

```
+----+-----------------+----------+
| id | email           | password |
+----+-----------------+----------+
|  1 | first@user.com  | 123456   |
|  2 | second@user.com | 123456   |
+----+-----------------+----------+
```

### Urls Table

```
+----+-------+----------------------------+---------+
| id | short | long                       | user_id |
+----+-------+----------------------------+---------+
|  1 | abc   | http://www.google.com/     | 1       |
|  2 | def   | http://www.duckduckgo.com/ | 1       |
|  3 | ghi   | http://www.bing.com/       | 2       |
|  4 | jkl   | http://www.yahoo.com/      | 2       |
|  5 | mno   | http://www.ask.com/        | 2       |
+----+-------+----------------------------+---------+
```

> The easiest way to generate this schema and seed the database is to call `\i tinyapp.sql` in the `psql` console. 

Once we have a database with some initial values we can think about making queries to that data. 

## Reading & Writing data using SQL

### `GET /login`

Get all the users from the database

```sql
SELECT * FROM users;
```

### `GET /urls`

Get all the urls for a user

```sql
SELECT short,long FROM urls WHERE user_id = 1;
```

### `POST /urls`

Add a new url for a user

```sql
INSERT INTO urls (short, long, user_id) VALUES ('abc', 'http://www.lighthouselabs.ca', 1);
```

### `GET /urls/:short`

Get a single url by short name

```sql
SELECT short, long FROM urls WHERE short = 'abc';
```

### `POST /urls/:short/edit`

Update an existing url by short name

```sql
UPDATE urls SET long = 'http://www.lighthouselabs.ca' WHERE short = 'abc';
```

### `POST /urls/:short/delete`

Remove an existing url by short name

```sql
DELETE FROM urls WHERE short = 'abc';
```

## Executing queries asynchronously

In order to execute any queries we need to make a connection to the PostgreSQL database.

First install `pg` with `npm install pg --save`. Once the module is available you can use it in your project.

```javascript
const pg = require('pg');

const client = new pg.Client();

client.connect((error) => {
  if(error) throw error;

  client.query("SELECT * FROM users WHERE id = 1;", (error, results) => {
    if(error) throw error;

    console.log(results);

    client.end((error) => {
      if(error) throw error;
    });
  });
});
```

Our client has a `query` method that takes multiple arguments. In the basic case the arguments are:

- A string that represents the query being made.
- A callback function that is called when the query is done and the results are ready.

This process is **asynchronous**. JavaScript does not stop executing while the database is generating the results. This is different than what you will find in Ruby. You can use a gem in Ruby to interact with PostgreSQL, unlike in Node the code will pause execution until the results are generated.

```ruby
require 'pg'

conn = PG.connect( dbname: 'w4d2' )
conn.exec( "SELECT * FROM users" ) do |result|
  result.each do |row|
    puts " %d | %-16s | %s " %
      row.values_at('id', 'email', 'password')
  end
end
```

## Using modules to organize your application

We are seeing a lot of of repetative code. This is a pattern that should be addressed early. Organizing our program into modules allows us to hide some of the repetition.

We could create a module that allows us to connect to the database, and when it is done call our callback.

**lib/db.js**

```javascript
const pg = require('pg');

var config = {
  user: 'kjensen', //env var: PGUSER 
  database: 'w4d2', //env var: PGDATABASE 
  password: '', //env var: PGPASSWORD 
  host: 'localhost', // Server hosting the postgres database 
  port: 5432 //env var: PGPORT 
};

module.exports = {
  connect: (done /* our callback */) => {
    const client = new pg.Client(config);
    client.connect((error) => {
      done(error, client);
    });
  }
}
```

This gives us access to a simpler pattern for making queries to our database. We require our new module and use the `connect` method to create the connection to our PostgreSQL server.

```javascript
const db = require('./db');

function getAllUsers(done /* our callback */) {
  db.connect((error, client) => {
    client.query("SELECT * FROM users;", (err, users) => {
      done(users.rows);
      db.close(client);
    });
  });
}

getAllUsers((users) => {
  console.log(users);
});
```

## Ensuring secure user input

### Unsafe

```javascript
client.query("INSERT INTO urls (short, long, user_id) VALUES ('" + short + "', '" + long + "', " + user_id + ");", (error, results) => {
  console.log(results);
});
```

With the above examples. As long as the users enters a url like `http://www.lighthouselabs.ca/` then there are no issues. A user with the intent to damage your business could instead enter a url like `http://www.lighthouselabs.ca/', 1); DELETE FROM urls WHERE 1 = 1; --`.

Because the input is included in the query without any sanitization it becomes two queries.

Insert the url as expected.

```
INSERT INTO urls (short, long, user_id) VALUES ('abc', 'http://www.lighthouselabs.ca/', 1);
```

Delete all the urls from the database. The `--` on the end is a SQL comment, so anything after the user input would be commented out to ensure that the query is valid. In this example that would be the `', 1);`.

```
DELETE FROM urls WHERE 1 = 1; --
```

If you would like to include variable values in your query you can use the built in parameterization functionality. This changes the usage of the `query` function. The second parameter is now an array of values to be injected into the query. 

### Safe

```javascript
client.query("INSERT INTO urls (short, long, user_id) VALUES ($1::text, $2::text, $3::integer);", [short, long, user_id], (error, result) => {
  console.log(results);
});
```

## Bonus

# REVIEW THIS

The repository has three branches.

- master (the pg sql version)
- base (the in memory object version)
- knex (the knex version with migrations)

Use file comparison software to review the differences between versions of these files. An interesting one to look at is the `routes/urls.js` file for the base and master versions..