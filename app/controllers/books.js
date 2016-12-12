'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');


//         request, response, next
const index = (req, res, next) => {
  // Book.find() in Mongo is like Book.all in sql
  Book.find()
    .then(books => res.json({ books }))
    // ABSOLUTELY NEED THIS LINE TO PROPOGATE OUR ERRORS
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Book.findByID(req.params.id)
    .then(book => book ? res.json({ book }) : next())
    .catch(err => next(err));
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
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Book.findOne(search)
    .then(book => {
      if (!book) {
        return next();
      }

      delete req.body._owner;
      return book.update(req.body.book)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Book.findOne(search)
    .then(book => {
      if (!book) {
        return next();
      }

      return book.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
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
