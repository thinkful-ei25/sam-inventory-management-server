'use strict';

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Item = require('../models/items');

router.get('/', (req,res,next)=>{
  
  let projection = {name: 1, category: 1, quantity: 1, weight: 1, location: 1}
  
  Item.find({}, projection)
    .then(result=>{
      res.json(result);
    })
    .catch(err=>{
      next(err);
    });
    
});

module.exports = router;