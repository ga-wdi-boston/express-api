'use strict';

const controller = require('lib/wiring/controller');
//controller is required
const models = require('app/models');
//models is required
const Example = models.example;
//example function inside models file

const authenticate = require('./concerns/authenticate');
//store authenticate file in a variable

const index = (req, res, next) => {
  Example.find()
  //find all instances of example
    .then(examples => res.json({ examples }))
    //run Promise that turns response into json, passing in examples arg, unless
    //there's an error
    .catch(err => next(err));
    //if there's an error, then it catches and propogates error; passes control
    //to next matching route
};

const show = (req, res, next) => {
  Example.findById(req.params.id)
  //find all instances of example by ID, requiring ID as parameter
    .then(example => example ? res.json({ example }) : next())
    //run Promise that checks if example exists, sends JSON response of property
    //to example.
    .catch(err => next(err));
    //if there's an error, then it catches and propogates the error, passes
    //control to next matching route
};

const create = (req, res, next) => {
  let example = Object.assign(req.body.example, {
    //example in curl request is returned as an object
    _owner: req.currentUser._id,
    //data is user owned
  });
  Example.create(example)
  //create new instance of example
    .then(example => res.json({ example }))
    //run Promise that will store JSON into response
    .catch(err => next(err));
    //if there's an error, then it catches and propogates the error, passes
    //control to next matching route
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  //search for object by id and by user id: parameters stored into search
  //variable
  Example.findOne(search)
  //find one instance of something that matches search parameters
    .then(example => {
      //run Promise that checks for example
      if (!example) {
        //if example doesn't exist,
        return next();
        //passes control to next matching route
      }

      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example)
      //call update function on example
        .then(() => res.sendStatus(200));
        //if successful, send 200 response (OK)
    })
    .catch(err => next(err));
    //if there's an error, then it catches and propogates the error, passes
    //control to next matching route
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  //search for object by id and by user id: parameters stored into search
  //variable
  Example.findOne(search)
  //find one instance of something that matches search parameters
    .then(example => {
      //run Promise that checks for example
      if (!example) {
        //if example doesn't exist,
        return next();
        //if there's an error, then it catches and propogates the error, passes
        //control to next matching route
      }

      return example.remove()
      //remove instance of example
        .then(() => res.sendStatus(200));
        //if successful, send 200 response (OK)

    })
    .catch(err => next(err));
    //if there's an error, then it catches and propogates the error, passes
    //control to next matching route
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
