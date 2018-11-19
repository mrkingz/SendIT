[![Build Status](https://travis-ci.com/mrkingz/SendIT.svg?branch=develop)](https://travis-ci.com/mrkingz/SendIT)
[![Coverage Status](https://coveralls.io/repos/github/mrkingz/SendIT/badge.svg?branch=develop)](https://coveralls.io/github/mrkingz/SendIT?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/dd8d3c3be668614684f5/maintainability)](https://codeclimate.com/github/mrkingz/SendIT/maintainability)

# SendIT
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT
provides courier quotes based on weight categories.

# GH-pages link: 
- https://mrkingz.github.io/SendIT/ui/views/index.html

# Heroku links: 
- https://senditkingsley.herokuapp.com/api

# Pivotal Tracker link: 
- https://www.pivotaltracker.com/n/projects/2212947

# Features
- Users can create an account and log in.
- Users can create a parcel delivery order.
- Users can change the destination of a parcel delivery order.
- Users can cancel a parcel delivery order.
- Users can see the details of a delivery order.
- Admin can change the status and present location of a parcel delivery order.

## Application Features
- Users can sign up
- Users can sign in
- Users can edit their password
- Users can Recover their lost password
- Users can create a parcel delivery order
- Users can view their  account details
- Users can cancel their parcel delivery order that has not been delivered, only if it has not been delivered
- Users can change the destination of their parcel delivery order, but only if it has not been delivered
- Users can only view their individual parcel deliver order(s)
- Only admin can change the status of a parcel delivery order, but only if it has not been delivered
- Only admin can update the present location of a parcel delivery order, but only if it has not been delivered
- Only admin can view all parcel delivery order(s) in the database


## Technology Stack
* NodeJS
* Express
* JavaScript
* HTML
* CSS
* Postgresql Relational Database

## Getting Started
* Install **NodeJs** and **Postgresql** (PGAdmin 4 preferably) locally on your machine or signup to an online hosted database e.g ElephantSql
* Clone the repository from bash or windows command
```sh
> $ `git clone https://github.com/mrkingz/SendIT.git
```

* Change into the directory
```sh
> $ `cd /SendIT`

```
* Create your database schema using, and also create the following tables:
 
* Install all required dependencies with
```sh
> $ `npm install`
```

```
*After successful installation, create a `.env` file which will be used to load environment variables 
 **see .env.example file as a sample**
*Create a databse to be used with application
```

## Testing
* Run Test `$ npm run tests`

## Application Limitations
* Only one admin can exist
* Users can only create account once with their full name, email and password
* Users will have to obtain a fresh token after 72 hours when their session has expired
* Users will only be able to access the full application functionalities only if they are signed in

## How To Contribute
* Fork the repository
* Create a feature branch with a feature.md file
* Write tests and make them pass
* Open a pull request
