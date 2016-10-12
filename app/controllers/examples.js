'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Example = models.example;

const authenticate = require('./concerns/authenticate');

// define a method called index (when you make a GET request to /examples)
// it can be passed 3 things, "request","response","next"
const index = (req, res, next) => {

  // For the Example MODEL use .find()with nothing in the parameter, so that you can get ALL examples
  // returns a promise. >E xample is mongoose. from the model
  Example.find()

  // Previous line with .find() returns a Promise that is resolved to go to this then() or a rejected and sents to catch
  // examples are all the info we get back from the .find and we turnt them into a JSON object
    .then(examples => res.json({ examples }))
    // .catch() is handling any errors the next err pushes it up to express
    .catch(err => next(err));
};

// define a method called show (when you make a GET request to /examples/id)
const show = (req, res, next) => {

  // Again for the mongoose model we are using find, BUT this time it is ById so that we get ONE back
  Example.findById(req.params.id)

  // .then is handling whatever example it gets back, checking if example is TRUE(did example come back)
  // then render(res) JSON for example,then if it doesnt work it passes it to next.
    .then(example => example ? res.json({ example }) : next())

    // .catch() is handling any errors the next err pushes it up to express
    .catch(err => next(err));
};

// define a method called create (when you make a POST request to /examples)
const create = (req, res, next) => {

// this is setting example to the request body's data
  let example = Object.assign(req.body.example, {
    // from the data we got from the request, we get the currentUser's id and setting _owner to that ID.
    _owner: req.currentUser._id,
  });

   // Using the mongoose model, we are using the create method and passing it
  //  the example we just defined/set on the previous lines.
  Example.create(example)

  // .then is handling whatever example it gets back, checking if example is TRUE(example came back)
  // then render(res) JSON for example,then if it doesnt work it passes it to next.
    .then(example => res.json({ example }))

    // .catch() is handling any errors the next err pushes it up to express
    .catch(err => next(err));
};

// define a method called update (when you make a PATCH request to /examples/id)
const update = (req, res, next) => {

  // this is setting search to the request body's data with the ID and
  // verifying the Owner id to be equal to the current user id
  let search = { _id: req.params.id, _owner: req.currentUser._id };

  // Again, for the mongoose model, it is using findOne and passing the search that we declared above to
  // find the exact thing according to its id's being correct
  Example.findOne(search)

  // .then is handling whatever example it gets back
    .then(example => {

      // here it checks to see if the example is not there, and will use NEXT to pass it on to the catch
      if (!example) {
        return next();
      }

      // disallow owner reassignment.
      delete req.body._owner;

      // Here it is returning the updated example and setting it to the request's body that we change.
      return example.update(req.body.example)

      // here it is taking the updated response and using sendStatus to send 200 if it worked
        .then(() => res.sendStatus(200));
    })

    // .catch() is handling any errors the next err pushes it up to express
    .catch(err => next(err));
};

// define a method called update (when you make a PATCH request to /examples/id)
const destroy = (req, res, next) => {

// same as show^
  let search = { _id: req.params.id, _owner: req.currentUser._id };

  // Again, for the mongoose model, it is using findOne and passing the search that we declared above to
  // find the exact thing according to its id's being correct
  Example.findOne(search)

  // .then is handling whatever example it gets back
    .then(example => {

      // here it checks to see if the example is not there, and will use NEXT to pass it on to the catch
      if (!example) {
        return next();
      }

      // calls remove on the example and returns (empty)
      return example.remove()

      // if it went through properly give a 200 ok
        .then(() => res.sendStatus(200));
    })

    // same as other catch methods.
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
