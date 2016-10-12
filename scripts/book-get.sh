#!/bin/sh

curl --include --request GET http://localhost:3000/books/57fe8a6bca23a78f279ce0dd \
  --header "Authorization: Token token=Z7te5Icu26wFnH4v5I0YW1vA4Ck2SZOLvZxHsiq2aso=--OnD2fmBvk/B6pnAVefYyY1jOIx9FQE4Obq8lgwP+zso=" \
  --header "Content-Type: application/json"
