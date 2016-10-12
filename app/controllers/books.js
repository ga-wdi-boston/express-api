'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Book = models.book;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Book.find()
    .then(books => res.json({ books }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Book.findById(req.params.id)
    .then(Book => Book ? res.json({ Book }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let Book = Object.assign(req.body.Book, {
    _owner: req.currentUser._id,
  });
  Book.create(Book)
    .then(Book => res.json({ Book }))
    .catch(err => next(err));
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Book.findOne(search)
    .then(Book => {
      if (!Book) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return Book.update(req.body.Book)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Book.findOne(search)
    .then(Book => {
      if (!Book) {
        return next();
      }

      return Book.remove()
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
