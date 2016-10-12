#!/bin/sh
curl --include --request PATCH http://localhost:3000/books/57fe5d70f522b6ffd4b6b0d4 \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=qz6UUkR9zyJ8wN2fOqzHuXV9r5IYxxbECGfvGzjfgaY=--WVzpF+xeM4hCw/7PmCGb6NeSmK0t9qeIwq48wJExLZc=" \
  --data '{
    "book": {
      "title": "Alex Is The Greatest",
      "author": "Alex Kopynec"
    }
  }'
