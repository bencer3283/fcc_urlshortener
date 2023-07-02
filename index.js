require('dotenv').config();
let dns = require('dns');
const express = require('express');
const cors = require('cors');
const app = express();

let mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let Address = require('./address');
const bodyParser = require('body-parser');

let testAddr = new Address({
  originalURL: 'example.com',
  proxy: '0'
});
testAddr.save().then(
  (doc) => {
    console.log('connect success');
  },
  (err) => {
    console.error(err);
  }
);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.use((req, res, next) => {
  console.log(req.method, " ", req.path, " ", req.ip);
  next();
})

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const findMaxProxy = function(done, url, response){
  Address.findOne().sort('-proxy').exec((err, doc) => {
    done(err, doc, url, response);
  });
}

const computeProxyAndSend = function(err, doc, originalUrl, res){
  res.json({
    original_url: originalUrl, 
    short_url: doc.proxy + 1
  });
}

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.route('/api/shorturl').post((req, res) => {
  let submittedUrl = req.body.url;
  dns.lookup(submittedUrl, (err, addr, fami) => {
    if (err) res.json({error: 'invalid url'});
    else findMaxProxy(computeProxyAndSend, submittedUrl, res);
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
