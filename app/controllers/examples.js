'use strict';

// require a core piece of Express functionality (controller)
const controller = require('lib/wiring/controller');
// require the Express models module
const models = require('app/models');
// require our own Example model
const Example = models.example;

// require authentication library (?) we've developed
const authenticate = require('./concerns/authenticate');

// gets called on GET /examples
// define an examples#index method
const index = (req, res, next) => {
  // find all examples using the .find() method on the Example model
  Example.find()
    // render all found examples as json
    .then(examples => res.json({ examples }))
    // if there are any errors, propagate them to next()
    // so they can eventually be handled by the Express error handling middleware
    .catch(err => next(err));
};

// gets called on GET /examples/:id
// define a examples#show method
const show = (req, res, next) => {
  // find a single example with the id matching the id passed as part of the request params
  // (i.e., as part of the URL)
  Example.findById(req.params.id)
    // if an example is found, then render it as json
    // otherwise, move on to next()
    // I *think* next() here will throw an error that's eventually caught, but not 100% sure
    .then(example => example ? res.json({ example }) : next())
    // if there are any errors, propagate them to next()
    // so they can eventually be handled by the Express error handling middleware
    .catch(err => next(err));
};

// gets called on POST /examples
// define a examples#create method
const create = (req, res, next) => {
  // set up an example
  // use the "example" data from the request body
  // also set the owern to the current user's id
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });

  // Create the example
  Example.create(example)
    // if the example was created successfully, render the example as json
    .then(example => res.json({ example }))
    // if there are any errors, propagate them to next()
    // so they can eventually be handled by the Express error handling middleware
    .catch(err => next(err));
};

// gets called on POST /examples/:id
// define a examples#update method
const update = (req, res, next) => {
  // set up a search object
  // set _id to the id from the URL
  // set _owner to the current user
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // find a single example matching these search parameters
  Example.findOne(search)
    .then(example => {
      // if there's no matching example, move on to next()
      if (!example) {
        return next();
      }
      // remove the _owner property from the request body so we can't affect the owner
      delete req.body._owner;  // disallow owner reassignment.
      // update the example with the data from the request body
      return example.update(req.body.example)
        // send back a 200 OK HTTP status code
        .then(() => res.sendStatus(200));
    })
    // if there are any errors, propagate them to next()
    // so they can eventually be handled by the Express error handling middleware
    .catch(err => next(err));
};

// gets called on DELETE /examples/:id
// define an examples#destroy method
const destroy = (req, res, next) => {
  // define a search object
  // set _id to the id from the URL
  // set _owner to the current user
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // find a single example matching these search parameters
  Example.findOne(search)
    .then(example => {
      // if there's no matching example, move on to next()
      if (!example) {
        return next();
      }

      // delete the example
      return example.remove()
        // send back a 200 OK HTTP status code
        .then(() => res.sendStatus(200));
    })
    // if there are any errors, propagate them to next()
    // so they can eventually be handled by the Express error handling middleware
    .catch(err => next(err));
};

// export these methods
// before every method EXCEPT index and show, require user to be authenticated
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
