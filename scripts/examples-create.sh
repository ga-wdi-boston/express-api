#!/bin/sh

curl --include --request POST http://localhost:3000/examples \
  --header "Content-Type: application/json" \
  --header "Authorization: Token token=0b5HCjX04oSalZKyqfkb/kYtdyPvV5TW21OfhSOjm4A=--7FmSsPhe+G/8V97IR/rc+pHHmY2p0tCCEU6MTMVNoYs=" \
  --data '{
    "example": {
      "text": "My first example text"
    }
  }'

# id = 57fe831d58e2cc8b693788fc
# token = 0b5HCjX04oSalZKyqfkb/kYtdyPvV5TW21OfhSOjm4A=--7FmSsPhe+G/8V97IR/rc+pHHmY2p0tCCEU6MTMVNoYs=
