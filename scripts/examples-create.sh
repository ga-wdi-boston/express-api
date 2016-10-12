#!/bin/sh

curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=UrY7C28nvHaZYXcE+SRrSpms9OFU3LvN2qUhXiI8ObY=--Mwy5gFSwJIHJy7xMSpEmyUqYfBFTwCrPuCBKN3ru77A=" \
  --data '{
    "example": {
      "text": "My first example text"
    }
  }'

# id = 57fe5716f5f6742d352c1690
# token = UrY7C28nvHaZYXcE+SRrSpms9OFU3LvN2qUhXiI8ObY=--Mwy5gFSwJIHJy7xMSpEmyUqYfBFTwCrPuCBKN3ru77A=
