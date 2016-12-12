'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// creates an index function that takes in three args of req, res, next
const index = (req, res, next) => {
  // takes the examples model and calls the find method to find all the examples
  Example.find()
    // takes the examples object and creates a response formatted in JSON
    .then(examples => res.json({ examples }))
    // catches an error if there is one
    .catch(err => next(err));
};

// creates a show function
const show = (req, res, next) => {
  // takes the examples model and calls the findById method to find an example by id
  Example.findById(req.params.id)
    // if example is true, take the example and create a response formatted in JSON
    // else pass it to the error handler
    .then(example => example ? res.json({ example }) : next())
    // catches an error if there is one
    .catch(err => next(err));
};

// creates a create function
const create = (req, res, next) => {
  // creates an object with the id of the current user as its property
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // takes the object with current user id and calls the create method of the example model
  Example.create(example)
    // creates a response formatted in JSON
    .then(example => res.json({ example }))
    //catches an error if there is one
    .catch(err => next(err));
};

// creates an update function
const update = (req, res, next) => {
  // creates an object with two properties, the id of search and id of current user
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // Calls the findOne method of examples model and seaches for a specific example
  // by id. If not found send to an error handler somewhere
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.

      // updates the examples collection based on info from the object passed
      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err)); // catches error
};

// creates a destroy function for examples
const destroy = (req, res, next) => {
  // creates an object with two properties, the id of search and id of current user
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // Calls the findOne method of examples model and seaches for a specific example
  // by id. If not found send to an error handler somewhere
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }
      // deletes from the examples collection based on info from the object passed
      return example.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err)); // catches error
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
