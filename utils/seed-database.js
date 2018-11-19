'use strict';

const mongoose = require('mongoose');

const {DATABASE_URL} = require('../config');

const Item = require('../models/items');

const {items} = require('../db/seed/data');

mongoose.connect(DATABASE_URL, {useNewUrlParser:true})
  .then(()=> mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      Item.insertMany(items)
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(err);
  });