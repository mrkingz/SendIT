[![Build Status](https://travis-ci.com/mrkingz/SendIT.svg?branch=develop)](https://travis-ci.com/mrkingz/SendIT)
[![Coverage Status](https://coveralls.io/repos/github/mrkingz/SendIT/badge.svg?branch=develop)](https://coveralls.io/github/mrkingz/SendIT?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/dd8d3c3be668614684f5/maintainability)](https://codeclimate.com/github/mrkingz/SendIT/maintainability)

# SendIT
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT
provides courier quotes based on weight categories.

#### GH-pages link: 
- https://mrkingz.github.io/SendIT/ui/views/index.html

#### Heroku link: 
- https://senditkingsley.herokuapp.com/api

#### Pivotal Tracker link: 
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
- Users can cancel their parcel delivery order, only if it has not been delivered
- Users can change the destination of their parcel delivery order, only if it has not been delivered
- Users can only view their individual parcel deliver order(s)
- Only admin can change the status of a parcel delivery order, but only if it has not been delivered
- Only admin can update the present location of a parcel delivery order, only if it has not been delivered
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
 
* Install all required dependencies with
```sh
> $ `npm install`
```

```
* After successful installation, create a `.env` file which will be used to load environment variables 
 > see .env.example file as a sample
 ```

* Create a databse for the application with the database name specified in your env file

* Migrate your database schemas using
```sh
> $ `npm run migrate:dev`
```
 
```
* Run the following command to start the application
```sh
> $ `npm run start:dev`
```


## Using the Application
#### Routes
* POST `api/v1/auth/signup`: sign up a new user. Required fields are:
  - `firstname`
  - `lastname`
  - `email`
  - `password`
  
* POST `api/v1/auth/login`: sign in a registered user. Required fields are:
  - `email`
  - `password`
  
* POST `api/v1/parcels`: create a parcel delivery order. Required fields are:
  - `weight`
  - `description` (Optional)
  - `deliveryMethod`
  - `pickupAddress`
  - `pickupCity`
  - `pickupState`
  - `pickupDate`
  - `destinationAddress`
  - `destinationCity`
  - `destinationState`
  - `destinationAddress`
  - `receiverName`
  - `destinationPhone`
  
* GET `api/v1/parcels`: Get all parcel delivery orders by admin.

* GET `api/v1/parcels/:parcelId`: Get a specific parcel delivery order by admin.

* GET `api/v1/users/:userId/parcels`: Get a user all parcel delivery orders.

* GET `api/v1/users/:userId/parcels/:parcelId`: Get a user specific parcel delivery order.

* PUT `api/v1/parcels/:parcelId/cancel`: Cancel a user parcel delivery order.

* PUT `api/v1/parcels/:parcelId/destination`: Update the destination of a parcel delivery order. Required fields are:
  - `destinationAddress`
  - `destinationCity`
  - `destinationState`

* PUT `api/v1/parcels/:parcelId/status`: Update the delivery status a parcel delivery order by admin. Required field is:
  - `deliveryStatus`

* PUT `api/v1/parcels/:parcelId/presentLocation`: Update the present location of a parcel delivery order by admin. Required field is:
  - `presentLocation`


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
