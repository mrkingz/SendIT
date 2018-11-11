import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	ParcelController,
	UserController,
} = controllers;
const { ParcelValidations } = validations;

const parcelRouter = express.Router();

parcelRouter.post('/api/v1/parcels',
	UserController.authenticateUser(),
	ParcelValidations.isRequired(),
	ParcelValidations.isEmpty(),
	ParcelValidations.isValid(),
	ParcelController.createParcel());

parcelRouter.get('/api/v1/parcels/:parcelId',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
  ParcelController.getParcel());

parcelRouter.get('/api/v1/users/:userId/parcels',
	UserController.authenticateUser(),
	ParcelController.getUserParcels());

export default parcelRouter;