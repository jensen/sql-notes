const pg = require('pg');

var config = {
  user: 'kjensen', //env var: PGUSER 
  database: 'w2d2', //env var: PGDATABASE 
  password: '', //env var: PGPASSWORD 
  host: 'localhost', // Server hosting the postgres database 
  port: 5432 //env var: PGPORT 
};

module.exports = {
  connect: (done) => {
    const client = new pg.Client(config);

    client.connect((error) => {
      if (error) throw error;
      done(error, client);
    });
  },
  close: (client) => {
    client.end((error) => {
      if (error) throw error;
    });
  }
}
