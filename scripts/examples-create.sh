#!/bin/sh
curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=qz6UUkR9zyJ8wN2fOqzHuXV9r5IYxxbECGfvGzjfgaY=--WVzpF+xeM4hCw/7PmCGb6NeSmK0t9qeIwq48wJExLZc=" \
  --data '{
    "example": {
      "text": "my first example text"
    }
  }'
