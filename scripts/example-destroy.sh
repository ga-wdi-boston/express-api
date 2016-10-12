#!/bin/bash

curl --include --request DELETE http://localhost:3000/examples/$ID \
  --header "Authorization: Token token=$TOKEN"