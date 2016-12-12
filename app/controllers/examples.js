'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
//require example model so you can refer to it in the functions below.
const Example = models.example;

//includes the authenticate method we want to occur before all other functions.
const authenticate = require('./concerns/authenticate');

//Define the index function that routes points to.
const index = (req, res, next) => {
  //Refers to the Example model defined above and finds all collections.
  Example.find()
    //defines the return data as "examples" and runs a function that renders that return data
    //as JSON and places it in to a JS object.
    .then(examples => res.json({ examples }))
    //If an error occurs above, the error data is taken and passed on to the
    //express error middleware.
    .catch(err => next(err));
};

//Define the show function that routes points to.
const show = (req, res, next) => {
  //Refers to the Example model defined above and finds a collection by a
  //specific id. req.params.id finds the id that was passed in to the router.
  Example.findById(req.params.id)
    //checks if data is returned, if so it defines the return data as "examples"
    //and runs a function that renders that return data as JSON and places it in
    // to a JS object. If data does not come back, the next function passes the
    //error to express error middleware.
    .then(example => example ? res.json({ example }) : next())
    //If an error occurs above, the error data is taken and passed on to the
    //express error middleware.
    .catch(err => next(err));
};

//Define the create function that routes points to.
const create = (req, res, next) => {
  //Defines a variable called example as a new object with a body and owner that
  //is passed in with the request.
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  //This references the Example model and passes it the new object that was defined
  //above.
  Example.create(example)
    //defines the return data as "example" and runs a function that renders
    //that return data as JSON and places it in to a JS object.
    .then(example => res.json({ example }))
    //If an error occurs above, the error data is taken and passed on to the
    //express error middleware.
    .catch(err => next(err));
};

//Define the update function that routes points to.
const update = (req, res, next) => {
  //Defines a variable called search as a new object.
  //The object is set with the example and owner id that is passed in to the
  //router.
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  //The object defined above is passed throught the findOne method to the
  //Example model.
  Example.findOne(search)
    //then defines the data returned from the model as example. example is then
    //passed to function that follows the fat arrow. If there is no data that
    //returns, the error is passed on to the express error middleware.
    .then(example => {
      if (!example) {
        return next();
      }
      //Removes the ability to change the owner id.
      delete req.body._owner;  // disallow owner reassignment.
      //this sends the the new information to be ubdated to the model and
      //updates it in the database. It also return status.
      return example.update(req.body.example)
        //returns the status of the request to the user.
        .then(() => res.sendStatus(200));
    })
    //If an error occurs above, the error data is taken and passed on to the
    //express error middleware.
    .catch(err => next(err));
};

//Define the destroy function that routes points to.
const destroy = (req, res, next) => {
  //Defines a variable called search as a new object.
  //The object is set with the example and owner id that is passed in to the
  //router.
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  //The object defined above is passed throught the findOne method to the
  //Example model.
  Example.findOne(search)
  //then defines the data returned from the model as example. example is then
  //passed to function that follows the fat arrow. If there is no data that
  //returns, the error is passed on to the express error middleware.
    .then(example => {
      if (!example) {
        return next();
      }
      //this sends the the new information to be deleted to the model and
      //updates it in the database and returns the status.
      return example.remove()
            //returns the status of the request to the user.
        .then(() => res.sendStatus(200));
    })
    //If an error occurs above, the error data is taken and passed on to the
    //express error middleware.
    .catch(err => next(err));
};

//exports the functions defined here so routes can find them and implement them when called.
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
