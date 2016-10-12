#!/bin/sh
curl --include --request POST http://localhost:3000/books \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=3mjjIwdcI/r0YVSMyZE7CvlpmE5ZUbzRLJtjNM1yS7k=--g7Z+jHbchqIfsbXVXzjKRvcWA9fCQrbL03nFS1F9u9Y=" \
  --data '{
    "book": {
      "title": "my second book",
      "author": "Me"
    }
  }'
