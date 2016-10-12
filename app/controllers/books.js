'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Book.find() //comes from the model that follows a mongoose schema.
  //this is like calling Book.all in rails ^
    .then(books => res.json({ books })) //passing the books array. pojo ish
    .catch(err => next(err));  //next is a 3rd preperty that goes into the
    //error passed to the express error middleware
};

const show = (/*req, res, next*/) => {

};

const create = (req, res, next) => {
  let book = Object.assign(req.body.book, {
    _owner: req.currentUser._id,
  });
  Book.create(book)
    .then(book => res.json({ book }))
    .catch(err => next(err));
};

const update = (/*req, res, next*/) => {

};

const destroy = (/*req, res, next*/) => {

};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
