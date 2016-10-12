#!/bin/sh

curl --include --request POST http://localhost:3000/examples \
  --header "Authorization: Token token=U0XTdeUnXGwbRHN+fCkz0MCFOVGq/KcX/FGchXHEfHc=--jD+0SL5SnlQ+y4fFJGczHYH7PDoI6JYDTucD95mF8tM=" \
  --header "Content-Type: application/json" \
  --data '{
    "example": {
      "text": "my first example"
    }
  }'
