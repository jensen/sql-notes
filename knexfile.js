module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'w4d2',
      user:     'kjensen',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
