// npm modules
const express = require('express');
const body = require('body-parser');
const cookies = require('cookie-parser');

// user libraries
const seed = require('./lib/seed');
const user = require('./lib/user');

// routes
const urls = require('./routes/urls');

const database = seed();
const app = express();

const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(body.urlencoded({ extended: false }));
app.use(cookies());
app.use(user(database));

app.use('/', urls(database));

app.get('/', (request, response) => {
  response.redirect(request.cookies['userid'] ? '/urls' : '/login');
});

app.get('/login', (request, response) => {
  response.render('login');
});

app.post('/login', (request, response) => {
  response.cookie('userid', request.body.userid);
  response.redirect('/');
});

app.listen(PORT, () => {
  console.log('TinyApp listening on port ' + PORT + '!');
  console.log(JSON.stringify(database, null, 2));
});