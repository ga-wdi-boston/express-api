'use strict';

// does some normalizing stuff to controller -
//this looks like interior guts that I don't need to worry about
// (altho this declaration is probably important)
const controller = require('lib/wiring/controller');
// import the models file
const models = require('app/models');
// set Example variable to the 'example' model from the models folder
const Example = models.example;

// important authentication
const authenticate = require('./concerns/authenticate');

// index method - will 'get' all examples
const index = (req, res, next) => {
  // find all examples and returns a promise
  Example.find()
    // then, if the promise is resolved, store the examples in the response as json
    .then(examples => res.json({ examples }))
    // if the promise is rejected, take the error and pass it on(?)
    .catch(err => next(err));
};

// show method - will 'get' one example
const show = (req, res, next) => {
  // find the 'id' params part of the request and find the example with that id
  // this will return a promise
  Example.findById(req.params.id)
    // if the promise resolves, it needs to check if the example is valid
    // so if the returned example is valid and correct, save it to 'response' in json
    // otherwise, if something went wrong, it will pass it to the next handler
    // which, in this case, is the 'catch'
    .then(example => example ? res.json({ example }) : next())
    // if the promise is rejected, take it and pass it onto next(),
    // where it will be resolved by the middleware as an error
    .catch(err => next(err));
};

// create method - it will 'create' a new example
const create = (req, res, next) => {
  // set 'example' to be a POJO with the 'body' from the request
  // and the _owner property to the currentUser's id, so a user owns the data
  // this is required because it's an authenticated action
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // then create a new Example using the data we passed in from the request
  // it will return a promise
  Example.create(example)
    // then, if the promise is resolved, save it on the response as a JSON
    .then(example => res.json({ example }))
    // if its rejected, pass the error to next
    .catch(err => next(err));
};

// update method - it will update an existing example
const update = (req, res, next) => {
  // set a 'search' variable to be an object that stores the id passed
  // in with the request parameters, and the _owner to be the current_user's id
  // this means that a user can only update an example that they are also the owner of
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // search Examples and only findOne (in case it returns many)
  Example.findOne(search)
  // if findOne resolves successfully,
    .then(example => {
      // but there's some kind of error for some reason, call 'next'
      // and pass it onto the next handler
      if (!example) {
        return next();
      }
      // prevents someone from 'tricking' the database by updating the
      // _owner property in the request
      delete req.body._owner;  // disallow owner reassignment.
      // update the example in the database with the data from the request
      // this 'return' statement allows us to move to the next line, since example.update
      // doesn't return a promise
      return example.update(req.body.example)
        // if successful, terminate the request with a 200 status that everything went well
        .then(() => res.sendStatus(200));
    })
    // if Example.findOne has an error or is rejected, catch it here and pass it to next
    .catch(err => next(err));
};


// destroy method - it will destroy an example
const destroy = (req, res, next) => {
  // much like update, it sets a 'search' variable to be an object that
  // stores the id of the examples passed with the request, as well as
  // setting the _owner to the user's id, so a user can only delete things
  // they own
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // then 'findOne' example that matches the criteria in 'search'
  Example.findOne(search)
    // if findOne resolves successfully...
    .then(example => {
      // but there's some kind of error, pass control to the next handler
      if (!example) {
        return next();
      }
      // remove the example, and return it so we can proceed to the .then() below
      // since example.remove doesn't return a promise
      return example.remove()
        // then terminate the request with a 200 status that everything went as expected
        .then(() => res.sendStatus(200));
    })
    // if findOne has an error and is rejected, catch it here and pass it to next
    // where it will (i think) ultimately be resolved by the middleware
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [ // this makes sure we authenticate for every action except 'index' and 'show', making it essentially read only
  { method: authenticate, except: ['index', 'show'] },
], });
