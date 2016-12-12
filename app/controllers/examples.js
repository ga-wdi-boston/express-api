'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// index action to display all examples
const index = (req, res, next) => {
  // request to Examples model to show all examples
  Example.find()
  // if successful, creates response object with examples as array of json
    .then(examples => res.json({ examples }))
    // if error, catch and passes error through code to middleware to send error to client
    .catch(err => next(err));
};

// show action to display a specific example by id
const show = (req, res, next) => {
  // reference to Example model to find a specific example, specified by id
  // the example id comes from the request object params
  Example.findById(req.params.id)
  // if successful, create json response object containing the specified example
  // else there is an error, pass the error to .catch() via .next()
    .then(example => example ? res.json({ example }) : next())
    // if error, catch and passes error through code to middleware to send error to client
    .catch(err => next(err));
};

// create action to make a new example
const create = (req, res, next) => {
  // creating a new variable "example",
  // assign it to be an object with the attributes of the request object's body's example data,
  // and set the _owner property of the new exapmle to the request object's current user id
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // reference to Example model to create a new example with the parameters from
  // the "example" variable defined above
  Example.create(example)
  // if successful, create a response object with the new example
    .then(example => res.json({ example }))
    // if error, catch and passes error through code to middleware to send error to client
    .catch(err => next(err));
};

// update action to modify existing example
const update = (req, res, next) => {
  // define search variable as an object with _id and _owner as keys,
  // assign the request object's parameters' id as a value to the _id key,
  // assign the request object's current user user id as a value to the _owner key
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // reference the example model and call the findOne mongoose method,
  // this method takes keys and values to specify the specific object to be found,
  // pass it the key/value pairs of the example object that wants to be updated
  Example.findOne(search)
    // checks the searched-for example object
    .then(example => {
      // if the exapmle object searched for is not found and/or not an example object,
      if (!example) {
        // return the error and pass it down to .catch
        return next();
      }
      // remove the _owner property from the request object so it in no longer being passed,
      // and therefore can no longer be edited
      delete req.body._owner;  // disallow owner reassignment.
      // update the specified example object with the data supplied in the request, and return it
      return example.update(req.body.example)
      // then send a response status of 200
        .then(() => res.sendStatus(200));
    })
      // if error, catch and passes error through code to middleware to send error to client
    .catch(err => next(err));
};
// destroy method to remove one example
const destroy = (req, res, next) => {
  // define search variable as an object with _id and _owner as keys,
  // assign the request object's parameters' id as a value to the _id key,
  // assign the request object's current user user id as a value to the _owner key
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // reference the example model and call the findOne mongoose method,
  // this method takes keys and values to specify the specific object to be found,
  // pass it the key/value pairs of the example object that wants to be updated
  Example.findOne(search)
    // checks the searched-for example object
    .then(example => {
        // if the exapmle object searched for is not found and/or not an example object,
      if (!example) {
          // return the error and pass it down to .catch
        return next();
      }
      // remove/destroy the specified example object,
      return example.remove()
      // send a response with status of 200
        .then(() => res.sendStatus(200));
    })
      // if error, catch and passes error through code to middleware to send error to client
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
