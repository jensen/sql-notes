module.exports = (database) => {
  return (request, response, next) => {
    response.locals.users = Object.keys(database).reduce((previous, user) => {
      previous.push({
        id: user,
        email: database[user].email,
        password: database[user].password
      });
      return previous;
    }, []);
    next();
  }
};