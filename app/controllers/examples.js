'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');
//define index action
const index = (req, res, next) => {
  //Invoke find method on Example model
  Example.find()
    //On successful request, data is turned to json from terminal handler
    .then(examples => res.json({ examples }))
    //if error, error passed to express error handler which executes reponse method
    .catch(err => next(err));
};
//define show action
const show = (req, res, next) => {
  //Invoke findById medthod on Example model with provided id from /book/:id
  Example.findById(req.params.id)
    //On successful request, if example exists, render json as example
    // or else say that didn't find anything
    .then(example => example ? res.json({ example }) : next())
    //catch if request has error
    .catch(err => next(err));
};
//define create action
const create = (req, res, next) => {
  //Define 'example variable'
  //Assign current_user to '_owner' property in body of 'example'
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // Invoke create method on Example model by passing 'example' defined above
  Example.create(example)
    //On successful request, data is turned to json from terminal handler
    .then(example => res.json({ example }))
    //if error, error passed to express error handler which executes reponse method
    .catch(err => next(err));
};
//Define 'update' action
const update = (req, res, next) => {
  // Define specific arguments for id of example and check data ownership
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // Invoke 'findOne' method that takes search params on Example model
  Example.findOne(search)
    //If search successful, and if example doesn't exists, pass to 'next' error handler
    .then(example => {
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      // Update searched 'example'using data passed into update method
      return example.update(req.body.example)
        // if update successful, take update data and invoke terminal handler to send OK status
        .then(() => res.sendStatus(200));
    })
    //if error, error passed to express error handler which executes reponse method
    .catch(err => next(err));
};
// define destroy method
const destroy = (req, res, next) => {
  // Define specific arguments for id of example and check data ownership
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // Invoke 'findOne' method that takes search params on Example model
  Example.findOne(search)
  //If search successful, and if example doesn't exists, pass to 'next' error handler
    .then(example => {
      if (!example) {
        return next();
      }
      //Invoke remove method on 'example' that was searched
      return example.remove()
        .then(() => res.sendStatus(200));
    })
    //if error, error passed to express error handler which executes reponse method
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
