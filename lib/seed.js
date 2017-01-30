const shortid = require('shortid');

const data = {
  'users': [
    {
      email: 'first@user.com',
      password: '123456'
    },
    {
      email: 'second@user.com',
      password: '123456'
    }
  ],
  'urls': [
    {
      long: 'http://www.google.com/',
      user_id: 0
    },
    {
      long: 'http://www.duckduckgo.com/',
      user_id: 0
    },
    {
      long: 'http://www.bing.com/',
      user_id: 1
    },
    {
      long: 'http://www.yahoo.com/',
      user_id: 1
    },
    {
      long: 'http://www.ask.com/',
      user_id: 1
    }
  ]
};

function urlsForUser(id) {
  return data['urls'].reduce((previous, url) => {
    if(url.user_id === id) {
      previous.push({
        short: shortid(),
        long: url.long
      });
    }
    return previous;
  }, []);
}

module.exports = () => {
  return data['users'].reduce((previous, user, index) => {
    previous[index] = {};
    for(let info in user) {
      previous[index][info] = user[info];
    }
    previous[index].urls = urlsForUser(index);
    return previous;
  }, {});
}