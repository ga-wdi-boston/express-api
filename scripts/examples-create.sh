#!/bin/sh

curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=3mjjIwdcI/r0YVSMyZE7CvlpmE5ZUbzRLJtjNM1yS7k=--g7Z+jHbchqIfsbXVXzjKRvcWA9fCQrbL03nFS1F9u9Y=" \
  --data '{
    "book": {
      "title": "my first example",
      "_owner": "57fe7529dc2c1debc3e85c2e"
    }
  }'
