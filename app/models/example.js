'use strict';

const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  _owner: {   //CURRENT USER - THE VALUE IS its user's object id
    type: mongoose.Schema.Types.ObjectId, //ObjectId VALUE OF _ID
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

exampleSchema.virtual('length').get(function length() { //length as a virtual prp[erty here]
  return this.text.length;
});

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
