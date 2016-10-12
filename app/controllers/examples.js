'use strict';

// get the controller function that is exported by lib/wiring/controller
// this function takes actions and options, and returns a controller
const controller = require('lib/wiring/controller');

// store a reference to the models folder that contains all of our models
const models = require('app/models');

// store a reference to the Example model
const Example = models.example;

// store a reference to the authenticate function
const authenticate = require('./concerns/authenticate');

// define the index action for the examples controller
const index = (req, res, next) => {
  // call the find method on Example
  // Mongoose gives us this method when it creates a model
  Example.find()
    // take the return value from .find(), which should be an array of examples,
    // and store it in the json property of the response object
    .then(examples => res.json({ examples }))
    // if an error occurred anywhere in the chain above,
    // pass the error to next()
    .catch(err => next(err));
};

// define the show action for the examples controller
const show = (req, res, next) => {
  // take the id from the request parameters and pass it to
  // the findById method on Example
  Example.findById(req.params.id)
    // if example is defined, attach it to the response to send back
    // if example is undefined, pass control to the next handler
    .then(example => example ? res.json({ example }) : next())
    // catch any errors and pass them to the next handler
    .catch(err => next(err));
};

// define the create action for the examples controller
const create = (req, res, next) => {
  // call the assign method on Object and pass in the request body
  // take the object that .assign returns and store it in `example`
  let example = Object.assign(req.body.example, {
    // also pass in the _id of the current user and assign it to _owner
    // we are defining the owner of this example as the current user
    _owner: req.currentUser._id,
  });
  // pass the new object, containing our request data and an owner id,
  // and pass it to the .create method on Example. This creates the new
  // example document in our database.
  Example.create(example)
    // store the new object as JSON in our response
    // so it can be sent back to the client
    .then(example => res.json({ example }))
    // catch any errors and pass them to the next handler
    .catch(err => next(err));
};

// define the update action for the examples controller
const update = (req, res, next) => {
  // create an object containing the _id passed in via the request parameters,
  // and the _owner id of the current user. Store in `search` to use as
  // search parameters
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // find and return one Example in the database
  // with a matching ObjectId and owner id
  Example.findOne(search)
    // check to see if a match was found and returned
    .then(example => {
      // if nothing was returned...
      if (!example) {
        // ...pass control to the next handler (i.e. break out)
        return next();
      }
      // if the client tried to be tricky and pass in an _owner id as part of
      // the update request body, delete that property so it won't be included
      // in the update
      delete req.body._owner;  // disallow owner reassignment.
      // if a match was found, update it with the data from the request body
      return example.update(req.body.example)
        // call the .sendStatus method on the response object to send a
        // response code of 200 (OK), then return a new Promise to continue
        // propagating down the chain
        .then(() => res.sendStatus(200));
    })
    // catch any errors and pass them to the next handler
    .catch(err => next(err));
};

// define the destroy action for the examples controller
const destroy = (req, res, next) => {
  // create an object containing the _id passed in via the request parameters,
  // and the _owner id of the current user. Store in `search` to use as
  // search parameters
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    // check to see if a match was found and returned
    .then(example => {
      // if nothing was returned...
      if (!example) {
        // ...pass control to the next handler
        return next();
      }

      // if a match was found, remove it from the database
      return example.remove()
        // call the .sendStatus method on the response object to send a
        // response code of 200 (OK), then return a new Promise to continue
        // propagating down the chain
        .then(() => res.sendStatus(200));
    })
    // catch any errors and pass them to the next handler
    .catch(err => next(err));
};

// export an invocation of the controller-creating method stored in `controller`
// and pass it:


module.exports = controller({
  //  all the CRUD actions we've defined in this file...
  index,
  show,
  create,
  update,
  destroy,
  // ...and an option to require authentication before all actions except read
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
