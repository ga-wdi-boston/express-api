#!/bin/bash

curl --include --request DELETE http://localhost:3000/books/$ID \
  --header "Authorization: Token token=$TOKEN"