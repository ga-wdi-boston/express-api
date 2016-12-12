#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=53P9RDK4xgaEQi4rkrTG+k2k64QVOO2djLErq9rP1x8=--cCRG7JQjYM4UWrvtVDqrsNhsZESEqmIXgMcNlzGE9Ec=" \
  --data '{
    "book": {
      "title": "My First Title",
      "author": "My Name",
      "_owner": "57fe57223c7b8dcd90b3ad51"
    }
  }'
