#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=kO48j6ww/L8OL1kfTnqzGLR6mjh7QOdriEs/tVSLk2o=--NmLZyUPtE4NRN8G+uyxWLHxZ+Ahm2j5tg4GRuoGBa8M=" \
  --data '{
    "book": {
      "title": "my first story",
      "author": "Me"
    }
  }'