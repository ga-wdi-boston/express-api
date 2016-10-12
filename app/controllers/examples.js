'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// this entire function is to index or GET all examples
// because it is in mongoose, we always need to pass in
// request (the http request), response (the http response), and next,
// which is used to pass the error to the express...inner workings
const index = (req, res, next) => {
  // refers to the Example model, which outlines our schema. We are attaching
  // .find() function to it to find all of the examples
  // no parameters are needed because we just want to get all of them.
  Example.find()
  //.then is where we handle the response. It returns a promise. It takes all of the examples that
  // are successfully found and converts them to a json response for all of the
  // examples
    .then(examples => res.json({ examples }))
    // this is where we propagate the error
    // .catch will take the error and pass it to the express error handlers
    .catch(err => next(err));
};

// a GET request to show an example with a particular specification
const show = (req, res, next) => {
  // on the Example model, we call findById, which takes the parameter
  // passed in above, request. On that request, it is requiring an example
  // with a specific id. Returns a promise.
  Example.findById(req.params.id)
  // then we move to then, which on success of the request above, takes the
  // example and creates a json response.
  // here next is used because if the example does not exist then it will just
  // hang and not necessarily error out. So, if the example is here, then
  // convert to json response. otherwise move onto the next. in this case,
  // the next part is the catch for the error, but it could potentially be
  // something else if we wanted -- whatever comes next
    .then(example => example ? res.json({ example }) : next())
    // this is where the error is caught, if there is one, and processed with express
    .catch(err => next(err));
};

// constructor function to create a new instance of an example
const create = (req, res, next) => {
// declares variable called example; it is given a value, as a new object, and
// to that object it is assigning or copying the request paramaters (whatever makes up the body
// of our example...in the schema it is text and owner, we should add 'text' below
// as another property of example).
  let example = Object.assign(req.body.example, {
    // we have set required the _owner id here as what has already been decided
    // (on sign-in) as the id of the current user.
    _owner: req.currentUser._id,
  });
  // creating a new instance of the Example model. The function takes one argument,
  // example, which is the object that we have created
  Example.create(example)
  // on successful creation, it translates the response into json and returns the new
  // example
    .then(example => res.json({ example }))
    // if it does not work, the error is caught
    .catch(err => next(err));
};

// updates an existing example with new information
const update = (req, res, next) => {
  // declaring variable called search and assigning it a value of an object.
  // in the object are the properties, (_id: which is given the value of
  // the example id that we would like to update, and _owner: which is given
  // the value of the current user's id)
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // finds the specific example, given the search properties above
  // search is passed into the findOne function, and looks for the specific example
  Example.findOne(search)
  // if the specific example is found, then it skips and moves to delete
    .then(example => {
      // if the example is not found, then it skips to the .catch for the error
      // outside of the .then
      if (!example) {
        // this is where we return the next -- which is going to catch the error
        return next();
      }
    // this is what is executed once the specific example is found
    // if found, it deletes the _owner  that we passed it?
    // maybe deleting the owner id before someone has access to it?
      delete req.body._owner;  // disallow owner reassignment.
      // takes the example and updates it as described with the delete.
      // no more _owner id
      return example.update(req.body.example)
      // on successful update, the response is a 200 ok
        .then(() => res.sendStatus(200));
    })
    // if nothing above works, the error is caught
    .catch(err => next(err));
};

// function to delete instance of an example
const destroy = (req, res, next) => {
  // declares variable called search and assigns it a value of an object with the
  // properties of the example that we want to use to find a specific instance
  // of an example
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // the findOne function is used, like in update, to find a specific instance of
  // an example -- which is passed in as search, which was defined above
  Example.findOne(search)
  // if the example is found successfully, it is returned, etc. below
    .then(example => {
      // if the example as defined above is not found, it skips everything and
      // goes to catch error
      if (!example) {
        return next();
      }
// if the specific instance of the example is found, it is removed
      return example.remove()
      // upon removal, a response is created with 200 ok
        .then(() => res.sendStatus(200));
    })
    // catches errors if nothing successful from above
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
