#!/bin/sh
curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --data '{
    "example": {
      "text": "my first example"
    }
  }'
