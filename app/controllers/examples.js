'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// send request for "index" of examples
const index = (req, res, next) => {
  // ask mongoose for all examples, or find with no queries
  Example.find()
    // passes data from 'examples' to the request for examples as a JSON response
    .then(examples => res.json({ examples }))
    // passes error to next error handler
    .catch(err => next(err));
};

// request for "show" for a single example
const show = (req, res, next) => {
  // directs findById mongoose method to the Example model, using request params
  Example.findById(req.params.id)
  // if data from example is present, pass as JSON.
  // if data not present, pass to middleware in mongoose
    .then(example => example ? res.json({ example }) : next())
    // passes error to next error handler in mongoose
    .catch(err => next(err));
};

// request for "create" a new example
const create = (req, res, next) => {
  // assigns the requested item from body.example to the currentUser as owner
  let example = Object.assign(req.body.example, {
    _owner: req.currentUser._id,
  });
  // directs create mongoose method to Example model using requested item above
  Example.create(example)
  // if data from example is present, pass as JSON.
  // if data not present, pass to middleware in mongoose
    .then(example => res.json({ example }))
    // passes error to next error handler in mongoose
    .catch(err => next(err));
};

// request to "update" the example being searched for
const update = (req, res, next) => {
  // construct "search" function requiring given _id and _owner are matching
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // queries the body of Example for the queried paramaters
  Example.findOne(search)
    // if 'search' successful, assign new value to 'example'
    // otherwise pass to middleware in mongoose
    .then(example => {
      if (!example) {
        return next();
      }
      delete req.body._owner;  // disallow owner reassignment.

      // sends the requested item from the 'example' document to the item
      // assigned as 'example' on line 51 using '.update' mongoose built-in
      return example.update(req.body.example)
        // terminate by sending status '200' as string
        .then(() => res.sendStatus(200));
    })
    // passes error to next error handler in mongoose
    .catch(err => next(err));
};

// request to "update" the example being searched for
const destroy = (req, res, next) => {
  // construct "search" function requiring given _id and _owner are matching
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  // queries the body of Example for the queried paramaters
  Example.findOne(search)
  // if 'search' successful, assign new value to 'example'
  // otherwise pass to middleware in mongoose
    .then(example => {
      if (!example) {
        return next();
      }
      // removes the selected 'example' from the Example document
      // using the '.remove' mongoose built-in method
      return example.remove()
        // terminate by sending status '200' as string
        .then(() => res.sendStatus(200));
    })
    // passes error to next error handler in mongoose
    .catch(err => next(err));
};

// export all this shit
module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: authenticate, except: ['index', 'show'] },
], });
