#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "My first book"
      "author": "Brian"
    }
  }'
