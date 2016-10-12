'use strict';
// import external files/libraries
const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// make an anonymous function accepting a request, response, and next parameters and invoke a Mongoose function to find().
const index = (req, res, next) => {
  Example.find()
  // model.find() returns a Promise which is caught by .then
    .then(examples => res.json({ examples }))
    // .catch handles errors and passes them on to error-handler middlewhere via the '.next' callback. This functions as our terminal expression in the sad path
    .catch(err => next(err));
};

// show, invoked by the route, calls the Mongoose function findById, which accepts an object containing an id of a document, here nested within our request parameters sent to us from the client.
const show = (req, res, next) => {
  Example.findById(req.params.id)
  // pass the example from the database and if it exists (is not undefined), send a response, rendering the example as json
    .then(example => example ? res.json({ example }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // Object.assign copies enumerable properties to the first argument (req.body.example) from the following arguments (req.currentUser._id), so this is what allows us to establish ownership of our example by the currentUser by placing a foreign key in the example.
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  {
    _id: 3,
  }
  // this creates the example in our database, using info from the example within our request body, including the foreign key we just assigned to it.
  Example.create(example)
    .then(example => res.json({ example }))
    .catch(err => next(err));
};

// findOne will return the first instance from the database that matches the query parameters within our response
const update = (req, res, next) => {
  // only allow access to data that belongs to the current user
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }
// security measure to prevent the client from changing sensitive information, namely the owner of the example.  Awesome!  Otherwise, they would be able to assign their example to be owned by someone else.  This could be exploited to flood someone else's account with meaningless examples, etc.
      delete req.body._owner;  // disallow owner reassignment.
      
      // this finally updates the entry in the database, if it belongs to the current user, and only if it modifies data it is allowed to.
      return example.update(req.body.example)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

// if the user owns the document, remove it from the database.
const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Example.findOne(search)
    .then(example => {
      if (!example) {
        return next();
      }

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
