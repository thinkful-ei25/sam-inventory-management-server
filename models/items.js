'use strict';

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {type: String, required: true},
  category: {type: String, required: true},
  weight: {type: String, required: true},
  quantity: {type: String, required: true},
  location: {type: String, required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

itemSchema.set('timestamps', true);

const config = {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, result) => {
    // result.id = doc._id;
    delete result._id;
    delete result.__v;
  }
};

itemSchema.set('toObject', config);
itemSchema.set('toJSON', config);

module.exports = mongoose.model('Item', itemSchema);