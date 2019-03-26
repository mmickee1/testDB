'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const dotenv = require('dotenv');
const mongojs = require('mongojs');
const ObjectId = require('mongodb').ObjectID;

const Schema = mongoose.Schema;

/*
const blogSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date, author: String }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});*/


const catSchema = new Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  color: String,
  weight: Number
});
const Cat = mongoose.model('cat', catSchema);

//console.log(process.env);

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/cat`).then(() => {
  console.log('Connected successfully.');
  app.listen(process.env.APP_PORT);
}, err => {
  console.log('Connection to db failed :( ' + err);
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  /*Demo.create({ test: 'Hello more data', more: 5 }).then(post => {
      console.log(post.id);
      res.send('created dummy data!' + post.id);
    });*/
  res.send('whatsup!');
});


app.get('/all', (req, res) => {
  Cat.find().then(all => {
    console.log(all);
    res.send(all);
  });
});

app.get('/cat', (req, res) => {
  Cat.find()
    .where('age').gt(5)
    .where('weight')
    .then(
      d => {
        console.log(d);
        res.send(d);
      },
      err => {
        res.send('Error: ' + err);
      });
});


app.get('/cat/name/:name', (req, res) => {
  Cat.find()
    .where('name').equals(req.params.name)
    .then(
      d => {
        console.log(d);
        res.send(d);
      },
      err => {
        res.send('Error: ' + err);
      });
});


app.get('/cat/color/:color', (req, res) => {
  Cat.find()
    .where('color').equals(req.params.color)
    .then(
      x => {
        console.log(x);
        res.send(x);
      },
      err => {
        res.send('Error: ' + err);
      });
});

/*
app.patch('/cat/:name', function (req, res) {
  var updateObject = req.body; 
  var name = req.params.name;
  db.cat.update({name  : Object(name)}, {$set: updateObject});
});*/


app.post('/update', bodyParser.urlencoded({ extended: true }), (req, res) => {
  console.log('reqbody: ' + req.body);
  console.log('reqbodyname: ' + req.body.name);
  const editedCat = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    color: req.body.color,
    weight: req.body.weight
  };

  Cat.find()
    .where('name').equals(req.body.name)
    .then(
      d => {
        console.log('THIS IS THE D' + d);
        Cat.updateOne({_id  : ObjectId(d.id)}).then(c => {
          res.send('Cat edited: ' + c.name + ' :' + editedCat);
        }, err => {
          res.send('Error: ' + err);
        });
      },
      err => {
        res.send('Error: ' + err);
      });

});



/*
app.delete('/delete', (req, res) => {
  //same way as update, just use delete.
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) return res.status(404).send("Couldnt find course");

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);

});*/

app.post('/cat',
  bodyParser.urlencoded({ extended: true }),
  (req, res) => {
    console.log(req.body);
    Cat.create({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      color: req.body.color,
      weight: req.body.weight
    }).then(c => {
      res.send('Cat created: ' + c.id);
    }, err => {
      res.send('Error: ' + err);
    });
  });

