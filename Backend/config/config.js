module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'database_name'
  },
  dburl: process.env.DB_URL ,
  JWT_AUTH_TOKEN:process.env.DB_HOST
};