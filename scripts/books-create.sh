#!/bin/sh

curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=SwWUv3ErTVtX/k7wk47GDHA8dakXN3PtK1P6ZjbYDQA=--HyNkNIkZNn/8g+jNTQnrSxSMMxs9GZUnsM4MZNOefuM=" \
  --data '{
    "book": {
      "title": "New Book",
      "author": "New Book Author"
    }
  }'
