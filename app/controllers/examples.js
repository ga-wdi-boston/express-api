'use strict';

// gives access to wiring controller,
// not sure what this controller does
const controller = require('lib/wiring/controller');
// gives access to models
// schemas are defined in this section
const models = require('app/models');
// defines Example
const Example = models.example;

// gives access to authentication
const authenticate = require('./concerns/authenticate');

// sets function for index
const index = (req, res, next) => {
  // returns all entries available from example
  Example.find()
    // pass array of examples to response as json
    .then(examples => res.json({ examples }))
    // pass error to middleware for resolution
    .catch(err => next(err));
};

// sets function for showing result
const show = (req, res, next) => {
  // search for item defined in passed request, looks at id
  Example.findById(req.params.id)
    // ? : works like an if else statement
    // if the example is true then render as json else throw next error
    .then(example => example ? res.json({ example }) : next())
    // find any errors and send to the middleware
    .catch(err => next(err));
};

// set function to handle creation
const create = (req, res, next) => {
  // set example as an object with sample info and owner id
  let example = Object.assign(req.body.example, {
    // set owner id value to object
    _owner: req.currentUser._id,
  });
  // create new instance of example object with example params
  Example.create(example)
    // render example as json
    .then(example => res.json({ example }))
    // find any errors and send to the middleware
    .catch(err => next(err));
};

// set function to handle updates
const update = (req, res, next) => {
  // set search parameters with id and owner
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // return a single result from examples
  Example.findOne(search)
    .then(example => {
      if (!example) {
        // throw error if not an example
        return next();
      }

      // remove the owner field so it cannot be edited
      delete req.body._owner;  // disallow owner reassignment.
      // update returned example with passed values
      return example.update(req.body.example)
        // send success message
        .then(() => res.sendStatus(200));
    })
    // find any errors and send to the middleware
    .catch(err => next(err));
};

// set function to handle deletiion
const destroy = (req, res, next) => {
  // set search parameters with id and owner
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // return a single result from examples
  Example.findOne(search)
    .then(example => {
      // throw error if not an example
      if (!example) {
        return next();
      }

      // remove the entry for the selected example
      return example.remove()
        // send success message
        .then(() => res.sendStatus(200));
    })
    // find any errors and send to the middleware
    .catch(err => next(err));
};

// export controller actions
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  // set authentication for all actions aside from index and show
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
