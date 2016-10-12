'use strict';

// Presumably a lot of hidden stuff to make the controller function as we expect
const controller = require('lib/wiring/controller');
// Stores the model directory in a variable (not sure why?)
const models = require('app/models');
// Store Example model for later use
const Example = models.example;

// Used to authenticate user before certain actions
const authenticate = require('./concerns/authenticate');

// Define index action (routed from GET to /examples)
const index = (req, res, next) => {
  // Find all examples in database through the Example model
  Example.find()
    // Render the found examples in json
    .then(examples => res.json({ examples }))
    // Catch any errors and pass them to the middleware error handler
    .catch(err => next(err));
};

// Define show action (routed from GET to /examples/:id)
const show = (req, res, next) => {
  // The example model has a mongoose method called 'findById'. This method takes
  // an ObjectId and returns the document matching that id. The req object is an
  // http.IncomingMessage object, which has parameters, one of which is the id
  // we're searching for.
  Example.findById(req.params.id)
    // If the example is found, render it in json for the response. Else, move
    // along to the next function (which presumably reaches a termination in the
    // middleware)
    .then(example => example ? res.json({ example }) : next())
    // Catch any errors and pass them to the middleware error handler
    .catch(err => next(err));
};

// Define create action (routed from POST to /examples)
const create = (req, res, next) => {
  // Define an example object and assign the 'example' portion of the body of
  // the request to the object
  let example = Object.assign(req.body.example, {
    // Assign the current user id to the _owner key on the defined example object
    _owner: req.currentUser._id,
  });
  // Create the example object in the database through the Example model action
  Example.create(example)
    // Render the created object in json
    .then(example => res.json({ example }))
    // Catch any errors and pass them to the middleware error handler
    .catch(err => next(err));
};

// Define update action (routed from PATCH to /examples/:id)
const update = (req, res, next) => {
  // Define search parameters based on the ObjectId passed in for the example
  // and the currentUser ObjectId found through the token on the request
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // The example model has a mongoose method called 'findOne' which takes search
  // parameters and returns an object
  Example.findOne(search)
    .then(example => {
      // Move along to middleware if example is not found.
      if (!example) {
        return next();
      }
      // Else, disallow owner reassignment and update
      delete req.body._owner;  // disallow owner reassignment.
      // Update the example, passing in the body context of the request. The body
      // should specify which field and value needs to be updated
      return example.update(req.body.example)
        // Set the status code to 200
        .then(() => res.sendStatus(200));
    })
    // Catch any errors and pass along to middleware error handler
    .catch(err => next(err));
};

// Define destroy action (routed from DELETE to /examples/:id)
const destroy = (req, res, next) => {
  // Define search parameters based on the ObjectId passed in for the example
  // and the currentUser ObjectId found through the token on the request
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // The example model has a mongoose method called 'findOne' which takes search
  // parameters and returns an object
  Example.findOne(search)
    .then(example => {
      // Move along to middleware if example is not found.
      if (!example) {
        return next();
      }
      // Remove example from database if found
      return example.remove()
        // Set the status code to 200
        .then(() => res.sendStatus(200));
    })
    // Catch any errors and pass along to middleware error handler
    .catch(err => next(err));
};

// Export methods
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
  // Authenticate before all actions except index and show
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
