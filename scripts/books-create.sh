#!/bin/sh

curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=j/Pg9MnWoxJWGqH6iYnzh7lHfWk05nHY8/RoK9wnWlc=--v7y6ThjJBAQVYqrVo3Sw7nSlvWRKMXXIPvJpHJSopZo=" \
  --data '{
    "book": {
      "title": "NEW BOOK TITLE CHANGE",
      "author": "Jaime H"
    }
  }'
