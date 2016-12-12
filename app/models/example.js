'use strict';

const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  _owner: { // this is basically 'current_user,' it's value will be the user's ID
    type: mongoose.Schema.Types.ObjectId, // this sets the type to be ObjectId
    ref: 'User', // and it will be _referencing_ a user
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

exampleSchema.virtual('length').get(function length() {
  return this.text.length;
});

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
