const redis = require("redis");
// require('dotenv').config()
const client = redis.createClient({
  port: 6379,
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || ''
});

client.on("error", function(error) {
  console.error(error);
});

module.exports = client