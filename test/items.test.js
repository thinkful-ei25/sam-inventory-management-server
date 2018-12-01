'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const {app} = require('../index');
const Item = require('../models/items');
const User = require('../models/users');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');

const {items, users} = require('../db/seed/data');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Inventory Manager API - Items', ()=>{

  let user = {};
  let token;

  before(function(){
    return mongoose.connect(TEST_DATABASE_URL, {userNewUrlParser: true});
  });

  beforeEach(function(){
    return Promise.all([
      Item.insertMany(items),
      User.insertMany(users)
    ])
      .then(([items,users])=>{
        user = users[0];
        token = jwt.sign({user:{username: user.username, id: user._id}}, JWT_SECRET, {subject: user.username});
      });
  });

  afterEach(function(){
    sandbox.restore();
    return Promise.all([Item.deleteMany(), User.deleteMany()]);
  });

  after(function(){
    return mongoose.connection.db.dropDatabase()
      .then(()=> mongoose.disconnect());
  });

  describe('GET /api/items', ()=>{
    it('should return the correct number of items', ()=>{
      return Promise.all([
        Item.find({userId: user.id}),
        chai.request(app)
          .get('/api/items')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data,res])=>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
  });

  describe('GET /api/items/:id', ()=>{
    it('should return correct item', ()=>{
      let data;
      return Item.findOne({})
        .then(_data => {
          data = _data;
          return chai.request(app)
            .get(`/api/items/${data._id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });
  });

  describe('POST /api/items', ()=>{
    it('should create and return a new item', ()=>{
      const newItem = {
        name: 'Test Item',
        category: 'weapon',
        quantity: '1',
        weight: '1',
        location: 'locker'
      };
      let res;
      return chai.request(app)
        .post('/api/items')
        .send(newItem)
        .set('Authorization', `Bearer ${token}`)
        .then((_res)=>{
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('id', 'name', 'category', 'quantity', 'weight', 'location', 'userId');
          return Item.findOne({_id: res.body.id});
        })
        .then(data=>{
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(res.body.category).to.equal(data.category);
          expect(res.body.quantity).to.equal(data.quantity);
          expect(res.body.weight).to.equal(data.weight);
          expect(res.body.location).to.equal(data.location);
        });
    });
  });

  describe('PUT /api/items/:id', ()=>{
    it('Should update the item', ()=>{
      const updateItem = {
        name: 'updated name'
      };
      let data;
      return Item.findOne({})
        .then(_data=>{
          data = _data;
          return chai.request(app)
            .put(`/api/items/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateItem);
        })
        .then((res)=>{
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.include.keys('id', 'name', 'quantity', 'weight', 'location', 'category');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(updateItem.name);
          expect(res.body.quantity).to.equal(data.quantity);
          expect(res.body.location).to.equal(data.location);
          expect(res.body.weight).to.equal(data.weight);
          expect(res.body.quantity).to.equal(data.quantity);
        });
    });
  });

  describe('DELETE /api/items/:id', ()=>{
    it('Should delete an existing item and respond with 204', ()=>{
      let data;
      return Item.findOne({})
        .then(_data=>{
          data = _data;
          return chai.request(app)
            .delete(`/api/items/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res=>{
          expect(res).to.have.status(204);
          return Item.countDocuments({_id: data.id});
        })
        .then(count=>{
          expect(count).to.equal(0);
        });
    });
  });



});