'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// this function is called from our routes file
const index = (req, res, next) => {
  // the find method (given by mongoose) is called on our example model and returns
  // a promise.
  Example.find()
  // if Example.find is successful, then the examples from mongoDB will be turned
  // into an array of examples objects, rendered in json and sent as the response.
    .then(examples => res.json({ examples }))
  // if the is a problem in either of the two code lines above, .catch is called
  // and an error message is propogated through error-handlers in middleware.
    .catch(err => next(err));
};

// this function is called from our routes file
const show = (req, res, next) => {
  // the .findByID method is called on our example model and is passed the ID of
  // the object we want back in the request.
  Example.findById(req.params.id)
  // if an example with the correct parameter is found, render it in json, else
  // move to the next function.
    .then(example => example ? res.json({ example }) : next())
  // if there is an error, return the error and end the function.
    .catch(err => next(err));
};

// get a POST request to /examples routed to examples#create (here)
const create = (req, res, next) => {
  // declare variable example and set it equal to a new object that takes the
  // example body data received in the request and adds a new key:value pair that
  // sets current user ID as the value for _owner on the object.
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // Saves a new document to the examples collection with the data from the variable
  // example.
  Example.create(example)
  // if the new document creation is successful, the data is rendered in json and
  // sent back to the client as a response.
    .then(example => res.json({ example }))
  // if there is an error, return the error and end the function.
    .catch(err => next(err));
};

// get a PATCH request to /examples/:id routed to examples#update controller method (this)
const update = (req, res, next) => {
  // define a new variable search and set it equal to an object that has the document
  // id and the id of the owner of the document.
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // call the findOne mongoose method on the example model with the search parameters
  // passed in as an argument.
  Example.findOne(search)
  // if the search parameters both match a document, then check if the new example
  // data is different from the current example data. If it is move to the next
  // part of the function, else send the error to the .catch.
    .then(example => {
      if (!example) {
        return next();
      }
  // delete the _owner reference from the new data sent in the request
      delete req.body._owner;  // disallow owner reassignment.
  // return the new example updated with the data sent in the request
      return example.update(req.body.example)
  // if that is successful, send response 200 OK
        .then(() => res.sendStatus(200));
    })
  // if there is an error, return the error and end the function.
    .catch(err => next(err));
};

// get a DELETE request to /examples/:id routed to examples#destroy controller method (this)
const destroy = (req, res, next) => {
  // define a new variable search and set it equal to an object that has the document
  // id and the id of the owner of the document.
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // call the findOne mongoose method on the example model with the search parameters
  // passed in as an argument.
  Example.findOne(search)
  // if the search parameters both match a document, then check if the new example
  // data is different from the current example data. If it is move to the next
  // part of the function, else send the error to the .catch.
    .then(example => {
      if (!example) {
        return next();
      }
  // remove the exaple document from the database
      return example.remove()
  // if that is successful, send response 200 OK
        .then(() => res.sendStatus(200));
    })
  // if there is an error, return the error and end the function.
    .catch(err => next(err));
};

// export the shit
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
