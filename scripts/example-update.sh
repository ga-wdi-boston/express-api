#!/bin/sh
curl --include --request PATCH http://localhost:3000/examples/$ID \
  --header "Authorization: Token token=$TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "example": {
      "text": "Different text this time"
    }
  }'