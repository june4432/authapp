require("dotenv").config();
const express = require('express');
const cors = require('cors');
const port = process.env.DEF_PORT;
const Redis = require('redis'); // Redis 모듈 불러오기
const redis_url = process.env.REDIS_HOST || '192.168.0.56';
const redis_port = process.env.REDIS_PORT || 6379;

const redisClient = new Redis.createClient({
  // socket:{
  //   url:redis_url,
  //   port:redis_port,
  //   username: process.env.REDIS_USERNAME,
  //   password: process.env.REDIS_PASSWORD
  // },
  host:"redis://"+redis_url,
  port:redis_port,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  pingInterval: 1000,
  legacyMode:true,
  auth_pass: process.env.REDIS_PASSWORD
}); 

redisClient.connect().catch(console.error);

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
