#!/bin/sh

# get all books
curl --include --request GET http://localhost:3000/books
  # --header "Authorization: Token token=$TOKEN"


# show a book
curl --include --request GET http://localhost:3000/books/57fe5d5e386cca1b9de22280
  # --header "Authorization: Token token=$TOKEN"


# create a book
curl --include --request POST http://localhost:3000/books \
  --header "Authorization: Token token=U0XTdeUnXGwbRHN+fCkz0MCFOVGq/KcX/FGchXHEfHc=--jD+0SL5SnlQ+y4fFJGczHYH7PDoI6JYDTucD95mF8tM=" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "BOOK ",
      "author": "AUTHOR"
    }
  }'


#  update a book

curl --include --request PATCH http://localhost:3000/books/57fe5d5e386cca1b9de22280 \
  --header "Authorization: Token token=U0XTdeUnXGwbRHN+fCkz0MCFOVGq/KcX/FGchXHEfHc=--jD+0SL5SnlQ+y4fFJGczHYH7PDoI6JYDTucD95mF8tM=" \
  --header "Content-Type: application/json" \
  --data '{
    "book": {
      "title": "Harry Potter",
      "author": "J.K. Rowling"
    }
  }'



#  delete a book

curl --include --request DELETE http://localhost:3000/books/57fe5d5e386cca1b9de22280 \
  --header "Authorization: Token token=U0XTdeUnXGwbRHN+fCkz0MCFOVGq/KcX/FGchXHEfHc=--jD+0SL5SnlQ+y4fFJGczHYH7PDoI6JYDTucD95mF8tM="
