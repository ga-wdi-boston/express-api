#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=LG873U5YtbiXxm53VzMxm/VwahK7sm66lGkxNFcmB0I=--FnrBuRSH7ayPYZv6+HqWxCDfc8EN4OY7OdHH8E/0bBI=" \
  --data '{
    "book": {
      "title": "Example Book",
      "author": "Example"
    }
  }'
