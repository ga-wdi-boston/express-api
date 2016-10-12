#!/bin/sh
curl --include --request PATCH http://localhost:3000/books/57fe5d502b81a895493c6645 \
  --header "Authorization: Token token=6u2zt2TFzDVIztAW6AInTxSeOduuBcZy0gwXd4u7nTY=--zB7Rdc9Gi15YDbHNI+2QZpkz64jUMnu8KyIagL6Gbdw=" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "My Second Book"
    }
  }'
