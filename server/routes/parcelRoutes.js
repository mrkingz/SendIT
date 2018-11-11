import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	ParcelController,
	UserController,
} = controllers;
const { ParcelValidations } = validations;

const parcelRouter = express.Router();

parcelRouter.route('/api/v1/parcels')
.all(UserController.authenticateUser())
.post(ParcelValidations.isRequired(),
	ParcelValidations.isEmpty(),
	ParcelValidations.isValid(),
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

parcelRouter.put('/api/v1/parcels/:parcelId/cancel',
	UserController.authenticateUser(),
	ParcelController.cancelParcelOrder());

export default parcelRouter;