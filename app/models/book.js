'use strict';

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
  // toJSON: { virtuals: true },
});

// bookSchema.virtual('length').get(function length() {
//   return this.text.length;
// });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
