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

Once we have a databas with some initial values we can think about making queries to that data.

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

## Ensuring secure user input

### Unsafe

```javascript
client.query('INSERT ', (error, result) => {

});
```

```javascript
client.query('INSERT ', (error, result) => {

});
```