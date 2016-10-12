'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
// declaring Example as a const
const Example = models.example;

// require the provided file path
const authenticate = require('./concerns/authenticate');

// defining an index action and giving it parameters
const index = (req, res, next) =>
// looking through all examples
  Example.find()
  // returning all examples in JSON format
    .then(examples => res.json({ examples }))
  // catching and returning any found error(s)
    .catch(err => next(err));
};

// defining a show action and giving it parameters
const show = (req, res, next) => {
  // looking through all examples that were passed to the router with a given ID
  Example.findById(req.params.id)
  // if an example is found, render in JSON. If no example is found,
  // move on to middleware
    .then(example => example ? res.json({ example }) : next())
  // catching and returning any found error(s)
    .catch(err => next(err));
};

// defining a create action and giving it parameters
const create = (req, res, next) => {
  // assining values of req.body.example a new object called example
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  Example.create(example)
    .then(example => res.json({ example }))
    .catch(err => next(err));
};
// defining an update action and giving it parameters
const update = (req, res, next) => {
  // defining a search object with attributes of ID and owner.
  // ID is looking for an example ID nested inside request, owner is looking
  // for a user ID nested inside currentUser
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // search for and return an example with ID given
  Example.findOne(search)
    .then(example => {
      // if no example is found, pass to to middleware
      if (!example) {
        return next();
      }
      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    // if an error is found, then return an error
    .catch(err => next(err));
};

// defining an destroy action and giving it parameters
const destroy = (req, res, next) => {
  // defining a search object with attributes of ID and owner.
  // ID is looking for an example ID nested inside request, owner is looking
  // for a user ID nested inside currentUser
  let search = { _id: req.params.id, _owner: req.currentUser._id };
    // search for and return an example with ID given
  Example.findOne(search)
    .then(example => {
      // if no example is found, pass to to middleware
      if (!example) {
        return next();
      }

      return example.remove()
        .then(() => res.sendStatus(200));
    })
      // if an error is found, then return the error
    .catch(err => next(err));
};

// export the methods, you damn foo
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
