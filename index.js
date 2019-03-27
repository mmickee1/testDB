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

//testing
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

//model for cat
const catSchema = new Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ['male', 'female'] },
  color: String,
  weight: Number
});
const Cat = mongoose.model('cat', catSchema);

//console.log(process.env);
//connecting to DB
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/cat`).then(() => {
  console.log('Connected successfully.');
  app.listen(process.env.APP_PORT);
}, err => {
  console.log('Connection to db failed :( ' + err);
});

app.use(express.static('public'));


//main view. 
app.get('/', (req, res) => {
  res.send('whatsup!');
});


//getting all cats
app.get('/all', (req, res) => {
  Cat.find().then(all => {
    console.log(all);
    res.send(all);
  });
});


//getting catz
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


//getting cat by name
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


//getting cat with specific color
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



//editing an existing cat
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
        Cat.updateOne({ name: req.body.name }, {
          name: req.body.name,
          age: req.body.age,
          gender: req.body.gender,
          color: req.body.color,
          weight: req.body.weight
        }).then(c => {
          res.send('Cat edited: ' + req.body.name);
        }, err => {
          res.send('Error: ' + err);
        });
      },
      err => {
        res.send('Error: ' + err);
      });

});



//Deleting a ccatzzooo
app.post('/delete', bodyParser.urlencoded({ extended: true }), (req, res) => {
  console.log('reqbody: ' + req.body);
  console.log('reqbodyname: ' + req.body.name);
  const editedCat = {
    name: req.body.name,
   /* age: req.body.age,
    gender: req.body.gender,
    color: req.body.color,
    weight: req.body.weight*/
  };

  Cat.find()
    .where('name').equals(req.body.name)
    .then(
      d => {
        console.log('THIS IS THE D' + d);
        Cat.deleteOne({ name: req.body.name }).then(c => {
          res.send('Cat deleted: ' + req.body.name);
        }, err => {
          res.send('Error: ' + err);
        });
      },
      err => {
        res.send('Error: ' + err);
      });

});


//creating cat.
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

