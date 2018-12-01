'use strict';

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Item = require('../models/items');

router.get('/',(req,res,next)=>{
  const userId = req.body.userId;
  let filter = {userId: ObjectId(userId)};
  let projection = {name: 1, category: 1, quantity: 1, weight: 1, location: 1, userId: 1};
  
  Item.find({filter}, projection)
    .then(result=>{
      res.json(result);
    })
    .catch(err=>{
      next(err);
    });

});

router.get('/:id', (req,res,next)=>{

  let projection = {name: 1, category: 1, quantity: 1, weight: 1, location: 1, userId: 1};
  const id = req.params.id;
  const userId = req.body.userId;
  Item.findById({_id:id, userId},projection)
    .then(result=>{
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err=>next(err));

});

router.post('/', (req,res,next)=>{
  const {name, category, quantity, weight, location} = req.body;
  const userId = req.body.userId;

  const newItem = {name, category, quantity, weight, location, userId};

  Item.create(newItem)
    .then(result=>{
      let returned = {
        name: result.name, 
        category:result.category, 
        quantity: result.quantity,
        weight: result.weight,
        location: result.location,
        userId: result.userId,
        id: result.id
      };
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(returned);
    })
    .catch(err=>next(err));
  
});

router.put('/:id', (req,res,next)=>{
  const id = req.params.id;
  const userId = req.body.userId;
  const {name, category, quantity, weight, location} = req.body;
  const updatedItem = {name, category, quantity, weight, location};
  const updateNew = {new: true};

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('Invalid `ID` entered');
    err.status = 400;
    return next(err);
  }

  Item.findOneAndUpdate({_id:id, userId},updatedItem, updateNew)
    .then(result=>{
      if(result){
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err=>{
      next(err);
    });

});

router.delete('/:id', (req,res,next)=>{
  const id = req.params.id;
  const userId = req.body.userId;

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    return next(err);
  }

  Item.findOneAndRemove({_id:id, userId})
    .then(()=>{
      res.status(204).end();
    })
    .catch(err=>next(err));
});

module.exports = router;