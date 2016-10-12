'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

// we are gaining access to the file that includes the authentication methods
const authenticate = require('./concerns/authenticate');

// defines an index method that gets invoke when the a GET request is made to /examples req = request, res = response, next = is sending the error to middleware to throw the error.
// don't need to worry about what middleware is doing, just make sure to include the line 15 before the end of a method, otherwise the request will hang.
const index = (req, res, next) => {
  // returns a promise an moves onto .then to run the function that is invoked
  Example.find()
  // examples is raw data and we're converting it into json and examples will be an array
    .then(examples => res.json({ examples }))
    // catching any errors that happen during the mongoose request
    .catch(err => next(err));
};

// defines the show method that gets invoked when teh GET request is made to examples/id
const show = (req, res, next) => {
  // we're calling the findByID on the Example model and we're passing the id that is coming for the request
  Example.findById(req.params.id)
  // if example actually exists (is it true?), if it does render the json, else go to next and the catch will catch that next that was called
    .then(example => example ? res.json({ example }) : next())
    .catch(err => next(err));
};

// defines the create method that gets invoked when the POST request is made to examples/
const create = (req, res, next) => {
  // we're declaring that new Object is taking in all of the body and the currentUser and assigning it to example
  // The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // we're creating a new Example and passing the target object, example
  Example.create(example)
  // then we're taking the raw example data and converting it into json
    .then(example => res.json({ example }))
    .catch(err => next(err));
};

// defines the udpate method that gets invoked when the PATCH request is made to examples/id
const update = (req, res, next) => {
  // since update action needs to be authenticated, we'lll pass the owener id, and the id of the object and assign it to the search variable
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // .findOne is called on the Example model. Passing a callback executes the query. It will find the document that is passed to the callback. The result of the query is a single document.
  Example.findOne(search)
  // if the example data does not match the the reqs, throw an error
    .then(example => {
      if (!example) {
        return next();
      }
// otherwise, do not allow owner reassignment and return the updated example body
      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example)
      // then return a 200 status if successfully updated
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

// defines the delete method that gets invoked when the DELETE request is made to examples/id
const destroy = (req, res, next) => {
  // since delete action needs to be authenticated, we'lll pass the owener id, and the id of the object and assign it to the search variable
  let search = { _id: req.params.id, _owner: req.currentUser._id };
// .findOne is called on the Example model. Passing a callback executes the query. It will find the document that is passed to the callback. The result of the query is a single document.
  Example.findOne(search)
  // if the example data does not match the the reqs, throw an error
    .then(example => {
      if (!example) {
        return next();
      }
// otherwise, remove the object and return a 200 status that it is successfully deleted
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
