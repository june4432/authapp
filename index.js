require("dotenv").config();
const express = require('express');
const cors = require('cors');
const port = process.env.DEF_PORT;
const Redis = require('redis'); // Redis 모듈 불러오기

const redisClient = new Redis.createClient({
  socket:{
    url:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  },
  legacyMode:true
}); 

redisClient.connect();
redisClient.auth(process.env.REDIS_PASSWORD);

// Redis 접속 확인
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Redis 접속 에러 처리
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const app = express();
app.use(cors(), express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', function(req, res, next) {
  res.send(`Listening on port ${port}`);
});

app.get('/session/get/:key', function(req, res, next) {
  const key = req.params.key;
  redisClient.get(key, (err , result) => {
    if(err){
      console.log(err);
    }else{
      res.send(result);
      console.log(result);
    }
  });
});

app.post('/session/set', function(req, res, next) {
  const key = req.query.key;
  const value = req.query.value;
  redisClient.set(key, value, (err, result) => {
    if(err){
      console.log(err);
    }else{
      res.send(result);
      console.log(result);
    }
  });
});

app.post('/login', function(req, res, next) {
  const id = req.query.id;
  const password = req.query.password;
  redisClient.set(key, value, (err, result) => {
    if(err){
      console.log(err);
    }else{
      res.send(result);
      console.log(result);
    }
  });
});
