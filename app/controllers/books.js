'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
// request comes in wiht nothing
  Book.find()
  // is successful, creates response object with examples as json array
  .then(books => res.json({ books }))
  // if error, passes error through code to middleware to send error to client
  .catch(error => next(error));
};

const show = (req, res, next) => {

};

const create = (req, res, next) => {
  let book = Object.assign(req.body.book, {
    _owner: req.currentUser._id,
  });
  Book.create(book)
    .then(book => res.json({
      book
    }))
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
