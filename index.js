require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let Address = require('./address');

let testAddr = new Address({
  originalURL: 'https://economist.com',
  proxy: '0'
});
testAddr.save().then(
  (doc) => {
    console.log(doc);
  },
  (err) => {
    console.error(err);
  }
);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use((req, res, next) => {
  console.log(req.method, " ", req.path, " ", req.ip);
  next();
})

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
