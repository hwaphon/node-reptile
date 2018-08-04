var express = require('express');
var postcontrol = require('./model/postctrl.js');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
var postControl = new postcontrol();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 5000);

app.get('/list/:page', function (req, res) {
  postControl.getLJList(req.query.city, req.params.page).then((list) => {
    res.send(list);
  });
});

app.get('/big/list/:page', function (req, res) {
  let page = req.params.page;
  let start = (page - 1) * 20;
  let end = page * 20;
  let city = req.query.city;

  let listPromise = [];
  for (let i = start; i < end; i++) {
    listPromise.push(postControl.getLJList(city, i));
  }
  Promise.all(listPromise).then((list) => {
    let result = [];
    list.forEach((value) => {
      result = result.concat(value);
    })
    res.send(result);
  });
});

app.get('/fang/:page', function (req, res) {
  let page = req.params.page;
  let city = req.query.city;

  postControl.
    getLJList(city, page).
    then((list) => {
      return list;
    })
    .then((list) => {
      let fangPromise = [];
      list.forEach((element) => {
        fangPromise.push(postControl.getLJFang(city, element.id));
      });
      return Promise.all(fangPromise);
    })
    .then(list => {
      res.send(list);
    });
});

app.get('/big/fang/:page', function (req, res) {
  let page = req.params.page;
  let start = (page - 1) * 10;
  let end = page * 10;
  let city = req.query.city;

  let listPromise = [];
  for (let i = start; i < end; i++) {
    listPromise.push(postControl.getLJList(city, i));
  }
  Promise.all(listPromise).then((list) => {
    let result = [];
    list.forEach((value) => {
      result = result.concat(value);
    })
      return result;  
    }).
    then((list) => {
      let fangPromise = [];
      list.forEach((element) => {
        fangPromise.push(postControl.getLJFang(city, element.id));
      });
      return Promise.all(fangPromise);
    })
    .then(list => {
      res.send(list);
    });
});