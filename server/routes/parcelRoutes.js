import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	ParcelController,
	UserController,
} = controllers;
const { ParcelValidator } = validations;

const parcelRouter = express.Router();

parcelRouter.route('/api/v1/parcels')
.all(UserController.authenticateUser())
.post(ParcelValidator.validateParcel(),
	ParcelController.createParcel())
.get(UserController.authorizeUser(),
	ParcelController.getParcels());

parcelRouter.get('/api/v1/parcels/:parcelId',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
  ParcelController.getParcel());

parcelRouter.get('/api/v1/users/:userId/parcels',
	UserController.authenticateUser(),
	ParcelController.getUserParcels());

parcelRouter.get('/api/v1/users/:userId/parcels/:parcelId',
	UserController.authenticateUser(),
	ParcelController.getUserParcel());

parcelRouter.put('/api/v1/parcels/:parcelId/cancel',
	UserController.authenticateUser(),
	ParcelController.cancelParcelOrder());

export default parcelRouter;