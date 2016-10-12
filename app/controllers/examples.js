'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');
// define index action
const index = (req, res, next) => {
  // Find all examples
  Example.find()
  // on suscessful request the examples array is passed as a json object to terminal handler
    .then(examples => res.json({ examples }))
    // if error an error is sent to express error handler which executes some response
    .catch(err => next(err));
};

// define show action
const show = (req, res, next) => {
  // Invoke fineById method on the example model using the privided ID from the book ID path
  Example.findById(req.params.id)
  // upon sucessful request if example exists (ID #) render json as example.
  //next passes on the message if example doesn't exist
    .then(example => example ? res.json({ example }) : next())
      // if error an error is sent to express error handler which executes some response
    .catch(err => next(err));
};

// define creat action
const create = (req, res, next) => {
  // define example variable
  // assign current user to owner in body example
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // invoke create method on model example by passing in example defined above.
  Example.create(example)
  // on suscessful request the examples array is passed as a json object to terminal handler
    .then(example => res.json({ example }))
    // if error an error is sent to express error handler which executes some response
    .catch(err => next(err));
};

// define update action
const update = (req, res, next) => {
  // makes sure currentUser has ownsershio of data be defining specific agruments for item and ownership
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // finds examples based on results of search variable above
  Example.findOne(search)
  // if search is sucessful pass to next
    .then(example => {
      // if search unsucessful pass to next
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      // update found example update with data passed into update method
      return example.update(req.body.example)
      // if update sucessful invoke terminal handler to send status
        .then(() => res.sendStatus(200));
    })
    // if error an error is sent to express error handler which executes some response
    .catch(err => next(err));
};
// define destroy action
const destroy = (req, res, next) => {
    // makes sure currentUser has ownsershio of data be defining specific agruments for item and ownership
  let search = { _id: req.params.id, _owner: req.currentUser._id };
    // finds examples based on results of search variable above
  Example.findOne(search)
    // if search is sucessful pass to next
    .then(example => {
      // if search unsucessful pass to next
      if (!example) {
        return next();
      }
      // update found example data passed into remove method
      return example.remove()
      // if update sucessful invoke terminal handler to send status 
        .then(() => res.sendStatus(200));
    })
    // if error an error is sent to express error handler which executes some response
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
