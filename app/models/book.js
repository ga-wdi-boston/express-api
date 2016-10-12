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
    type: mongoose.Schema.TypesObjectsId,
    ref: 'User'
    required: true,
   },
  }, {
    timestamps: true,
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
