#!/bin/sh
curl --include --request PATCH http://localhost:3000/books/$ID \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "Even Better Title"
    }
  }'