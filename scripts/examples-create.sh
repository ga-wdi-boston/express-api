#!/bin/sh
curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=EZeyeE1nk8lZAkW/hT3DI6i+Jm+fcVbmFL8T8xoO6rU=--dwVR6xBX9s9+V4/GhXlMOJ316YiOW+rh0NKDnM2YVh8="\
  --data '{
    "example": {
      "text": "Example text.",
      "_owner": "57fe5715b4a96f772df02366"
    }
  }'

# token: EZeyeE1nk8lZAkW/hT3DI6i+Jm+fcVbmFL8T8xoO6rU=--dwVR6xBX9s9+V4/GhXlMOJ316YiOW+rh0NKDnM2YVh8=
# id: 57fe5715b4a96f772df02366
