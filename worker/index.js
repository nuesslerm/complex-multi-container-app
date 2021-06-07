const redis = require('redis');

const keys = require('./apiKeys');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const subscriber = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

subscriber.on('message', (_channel, message) => {
  if (Number.isNaN(Number(message))) return;
  redisClient.hset('values', message, fib(Number(message)));
});
subscriber.subscribe('insert');
