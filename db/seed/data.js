'use strict';
const items = [
  {
    '_id': '000000000000000000000000',
    'name' : 'Short Hunting Rifle',
    'category' : 'weapons',
    'weight' : '6.8',
    'quantity' : '1',
    'location' : 'backpack',
    'userId': '5c0292ef4059bf69183f6646'
  },
  {
    '_id': '000000000000000000000001',
    'name' : 'Short Level Action Rifle',
    'category' : 'weapons',
    'weight' : '8.4',
    'quantity' : '1',
    'location' : 'backpack',
    'userId': '5c0292ef4059bf69183f6646'
  },
  {
    '_id': '000000000000000000000002',
    'name' : 'Straitjacket',
    'category' : 'apparel',
    'weight' : '0.1',
    'quantity' : '1',
    'location' : 'backpack',
    'userId': '5c0292ef4059bf69183f6646'
  }
];

const users = [
  {
    '_id': '5c0292ef4059bf69183f6646',
    'username' : 'testUser',
    'password': 'password',
  },
  {
    '_id': '5c0292ef4059bf69183f6600',
    'username' : 'test',
    'password' : 'password'
  }
];

module.exports = {items, users};