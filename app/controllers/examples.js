'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  // using mongoose method find on Example model.
  Example.find()
    // .find returns a promise, then we convert the response into json, naming it examples 
    .then(examples => res.json({ examples }))
    // if an error occurs, this will send it down until it is catched and printed to the console.
    .catch(err => next(err));
};

const show = (req, res, next) => {
  // findById is called on Example which searches the Example collection
  // and it searches for a book with the id passed through req.params.id
  Example.findById(req.params.id)
  // defining a function which checks to see if the example exists and renders
  // it in json, otherwise, pass the error to the catch
    .then((example) => example ? res.json({ example }) : next())
    // sends error 
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // defining example as an Object with a 
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  Example.create(example)
    .then(example => res.json({ example }))
    .catch(err => next(err));
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

      return example.remove()
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
