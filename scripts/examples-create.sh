#!/bin/sh

curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=dqFfYmIZOj/q5hIHYfaqjBAP6pVzQQhjhJ1eCGEB2o=--q7Vrt0EOjtPC4XFMXCuCj5am+DOuFzNeV1O3r8mj4C4=" \
  --data '{
    "example": {
      "text": "my first example text"
    }
  }'
