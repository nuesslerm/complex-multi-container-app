const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const keys = require('./apiKeys');

const PORT = 5000;

// express app setup
const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// postgres client setup
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => {
      console.error(err);
    });
});

// redis client setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  // if we ever lose connection to the redis client, retry connection every 1s
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

// express route handlers
app.get('/', (req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const { index } = req.body;
  if (Number(index) > 40) {
    return res.status(422).send('index too high');
  }

  // set initial fib value to 'Nothing yet!', to verify whether the worker overwrote the initial value
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
