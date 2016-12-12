#!/bin/sh
#!/bin/bash

curl --include --request GET http://localhost:3000/examples/1 \
  --header "Authorization: Token token=3mjjIwdcI/r0YVSMyZE7CvlpmE5ZUbzRLJtjNM1yS7k=--g7Z+jHbchqIfsbXVXzjKRvcWA9fCQrbL03nFS1F9u9Y="
  # --header "Content-Type: application/json" \
  # --data '{
  #   "passwords": {
  #     "old": "an example password",
  #     "new": "super sekrit"
  #   }
  }'
