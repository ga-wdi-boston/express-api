'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Example.find() //comes from the model that follows a mongoose schema.
  //this is like calling Example.all in rails ^
    .then(examples => res.json({ examples })) //passing the examples array. pojo into a json object
    .catch(err => next(err)); //error passed to the express error middleware
};

const show = (req, res, next) => {
  Example.findById(req.params.id) //finding an specific object id
    .then(example => example ? res.json({ example }) : next()) //res goes back to req. req is done so next
    //if example is true, then render it in json
    .catch(err => next(err)); //else, take what is happening and pass it into the next piece which is catch.
    //^ this is like a failure statement.
};

const create = (req, res, next) => { //important to have current user tests to create a new example. Token
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id, //example to be owned by a particular user and nobody else so token is establishing ownership.
  });
  Example.create(example) //actually creating an example
    .then(example => res.json({ example })) //example to become a json object
    .catch(err => next(err)); //if not, error
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id }; //need for the example id and user id
  Example.findOne(search) // ability to search for a specific example that belongs to 1 user. User can update and the user-only has this ability over his own examples
    .then(example => { //if is not an example then move on to "delete req.body._owner"
      if (!example) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return example.update(req.body.example) //but if user is successful at update
        .then(() => res.sendStatus(200)); //let know that if success, send a 200 status
    })
    .catch(err => next(err)); //if not, error
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search) // to find an example by its id and be able to look those up onlin
    .then(example => {
      if (!example) { //if example is found then move on with it and carry it on to the next area
        return next();
      }

      return example.remove() //deleting a record that belongs to a specific example.
        .then(() => res.sendStatus(200)); //return a status of 200 success
    })
    .catch(err => next(err)); //if not, catch the error
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] }, //before update create destroy need authenticaton
], });
