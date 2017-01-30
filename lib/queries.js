require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public'
});

module.exports = {
  getAllUsers: (done) => {
    knex.select().from('users').then(done);
  },
  getAllUrlsForUser: (user, done) => {
    knex.select('short', 'long').from('urls').where({
      user_id: user
    }).then(done);
  },
  createUrl: (data, done) => {
    knex.insert({
      short: data.short,
      long: data.long,
      user_id: data.user_id
    }).into('urls').then(done);
  },
  getUrl: (short, done) => {
    knex.select('short', 'long').from('urls').where({
      short: short
    }).then((results) => {
      done(results[0]);
    });
  },
  updateUrl: (short, long, done) => {
    knex('urls').where({
      short: short
    }).update({
      long: long
    }).then(done);
  },
  deleteUrl: (short, done) => {
    knex('urls').where({
      short: short
    }).del().then(done);
  }
};