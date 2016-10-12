#!/bin/sh

curl --include --request PATCH http://localhost:3000/books/57fe5e25c505c91ae839024c \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=j/Pg9MnWoxJWGqH6iYnzh7lHfWk05nHY8/RoK9wnWlc=--v7y6ThjJBAQVYqrVo3Sw7nSlvWRKMXXIPvJpHJSopZo=" \
  --data '{
    "book": {
      "title": "Last Try",
      "author": "Jaime H"
    }
  }'
