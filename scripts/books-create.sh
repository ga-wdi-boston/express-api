#!/bin/sh

curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=$TOKEN" \
  --data '{
    "book": {
      "title": "My First Book",
      "author": "Alex K",
    }
  }'
