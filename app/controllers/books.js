'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Book.find()
    .then(books => res.json({ books }))
     // this is going to be an array ^^
     // books and books need to be the same bc this is invoking a new function on the books data to turn it into json
    .catch(err => next(err));

};

const show = (req, res, next) => {

};

const create = (req, res, next) => {
  let book = Object.assign(req.body.book, {
    _owner: req.currentUser._id,
  });
  Book.create(book)
    .then(book => res.json({ book }))
    .catch(err => next(err));

};

const update = (req, res, next) => {

};

const destroy = (req, res, next) => {

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
