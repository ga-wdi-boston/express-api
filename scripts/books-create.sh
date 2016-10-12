#!/bin/sh

curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=Z7te5Icu26wFnH4v5I0YW1vA4Ck2SZOLvZxHsiq2aso=--OnD2fmBvk/B6pnAVefYyY1jOIx9FQE4Obq8lgwP+zso=" \
  --data '{
    "book": {
      "title": "My First Book",
      "author": "Alex K",
      "owner": "57fe831d58e2cc8b693788fc"
    }
  }'

  # id = 57fe831d58e2cc8b693788fc
  # token = Z7te5Icu26wFnH4v5I0YW1vA4Ck2SZOLvZxHsiq2aso=--OnD2fmBvk/B6pnAVefYyY1jOIx9FQE4Obq8lgwP+zso=
