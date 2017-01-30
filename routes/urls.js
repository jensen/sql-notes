const shortid = require('shortid');

const utils = require('../lib/utils');

module.exports = (database) => {
  const router = require('express').Router();

  router.get('/urls', (request, response) => {
    let user = request.cookies['userid'];
    let urls = database[user].urls;

    response.render('urls_index', {
      urls: urls
    });
  });

  router.post('/urls', (request, response) => {
    let user = request.cookies['userid'];
    let long = utils.cleanUrl(request.body.long);
    let short = shortid();

    database[user].urls.push({
      short: short,
      long: long
    });

    response.redirect('/urls');
  });

  router.get('/urls/:short', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;

    let url = database[user].urls.find((url) => {
      return url.short === short;
    });

    response.render('urls_show', {
      short: url.short,
      long: url.long
    });
  });

  router.post('/urls/:short/edit', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;
    let long = request.body.long;

    let index = database[user].urls.findIndex((url) => {
      return url.short === short;
    });

    database[user].urls[index].long = utils.cleanUrl(long);

    response.redirect('/urls');
  });

  router.post('/urls/:short/delete', (request, response) => {
    let user = request.cookies['userid'];
    let short = request.params.short;

    let index = database[user].urls.findIndex((url) => {
      return url.short === short; 
    });

    database[user].urls.splice(index, 1);

    response.redirect('/urls');
  });

  return router;
}