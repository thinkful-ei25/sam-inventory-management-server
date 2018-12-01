'use strict';

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Item = require('../models/items');

router.get('/', (req,res,next)=>{
  
  let projection = {name: 1, category: 1, quantity: 1, weight: 1, location: 1};
  
  Item.find({}, projection)
    .then(result=>{
      res.json(result);
    })
    .catch(err=>{
      next(err);
    });

});

router.get('/:id', (req,res,next)=>{

  let projection = {name: 1, category: 1, quantity: 1, weight: 1, location: 1};
  const id = req.params.id;
  Item.findById({_id:id},projection)
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

  const newItem = {name, category, quantity, weight, location};

  Item.create(newItem)
    .then(result=>{
      let returned = {
        name: result.name, 
        category:result.category, 
        quantity: result.quantity,
        weight: result.weight,
        location: result.location,
        id: result.id
      };
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(returned);
    })
    .catch(err=>next(err));
  
});

router.put('/:id', (req,res,next)=>{

  const id = req.params.id;
  const updatedItem = {};

  const updatableFields = ['name', 'category', 'weight', 'quantity', 'location'];

  updatableFields.forEach(field=>{
    if(field in req.body){
      updatedItem[field] = req.body[field];
    }
  });

  const updateNew = {new: true};

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('Invalid `ID` entered');
    err.status = 400;
    return next(err);
  }

  Item.findByIdAndUpdate({_id:id},updatedItem, updateNew)
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

  if(!mongoose.Types.ObjectId.isValid(id)){
    const err = new Error('The `id` is not valid');
    return next(err);
  }

  Item.findOneAndRemove({_id:id})
    .then(()=>{
      res.status(204).end();
    })
    .catch(err=>next(err));
});

module.exports = router;