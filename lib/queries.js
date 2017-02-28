const db = require('./db');

module.exports = {
  getAllUsers: (done) => {
    db.connect((error, client) => {
      client.query("SELECT * FROM users", (err, result) => {
        done(result.rows);
        db.close(client);
      });
    });
  },
  getAllUrlsForUser: (user, done) => {
    db.connect((error, client) => {
      client.query("SELECT short, long FROM urls WHERE user_id = $1::integer", [user], (err, result) => {
        done(result.rows);
        db.close(client);
      });
    });
  },
  createUrl: (data, done) => {
    db.connect((error, client) => {
      client.query("INSERT INTO urls (short, long, user_id) VALUES ($1::text, $2::text, $3::integer)", [data.short, data.long, data.user_id], (err, result) => {
        done();
        db.close(client);
      });
    });
  },
  getUrl: (short, done) => {
    db.connect((error, client) => {
      client.query("SELECT short, long from urls WHERE short = $1::text", [short], (err, result) => {
        done(result.rows[0]);
        db.close(client);
      });
    });
  },
  updateUrl: (short, long, done) => {
    db.connect((error, client) => {
      client.query("UPDATE urls SET long = $1::text WHERE short = $2::text", [long, short], (err, result) => {
        done();
        db.close(client);
      });
    });
  },
  deleteUrl: (short, done) => {
    db.connect((error, client) => {
      client.query("DELETE FROM urls WHERE short = $1::text", [short], (err, result) => {
        done();
        db.close(client);
      });
    });
  }
};