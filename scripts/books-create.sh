#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=m0Li1FTTNji4dYpuhOXC9mU7BTDm7CXLJi50ZGjkGpc=--jQkPTVtfL8cVpWlUVeUsjHYCLAHJlHozVB2i/cYJQig="
  --data '{
    "book": {
      "title": "My First Book",
      "author": "Alex k",
    }
  }'

# errors in curl script
