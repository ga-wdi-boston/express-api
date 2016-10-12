'use strict';

module.exports = require('lib/wiring/routes')

// create routes

// what to run for `GET /`
.root('root#root')

// standards RESTful routes
.resources('examples')

// users of the app have special requirements
.post('/sign-up', 'users#signup')
.post('/sign-in', 'users#signin')
.delete('/sign-out/:id', 'users#signout')
.patch('/change-password/:id', 'users#changepw')
.resources('users', { only: ['index', 'show'] })

// all routes created

// books routes
.get('/books', 'books#index')
.get('/books/:id', 'books#show')
.post('/books', 'books#create')
.patch('/books/:id', 'books#update')
.delete('/books/:id', 'books#destroy')

;
