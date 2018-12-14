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
	.post(ParcelValidator.validateCreateParcel(),
		ParcelController.createParcel())
	.get(UserController.authorizeUser(),
		ParcelController.getParcels(),
		ParcelController.filterParcels());

parcelRouter.get('/api/v1/parcels/:parcelId',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelController.getParcel());

parcelRouter.get('/api/v1/users/:userId/parcels',
	UserController.authenticateUser(),
	ParcelController.getUserParcels(),
	ParcelController.filterParcels());

parcelRouter.get('/api/v1/users/:userId/parcels/:parcelId',
	UserController.authenticateUser(),
	ParcelController.getUserParcel());

parcelRouter.put('/api/v1/parcels/:parcelId/cancel',
	UserController.authenticateUser(),
	ParcelController.cancelParcelOrder());

parcelRouter.put('/api/v1/parcels/:parcelId/presentLocation',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('location'),
	ParcelController.updateLocation());

parcelRouter.put('/api/v1/parcels/:parcelId/status',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('status'),
	ParcelController.updateStatus());

parcelRouter.put('/api/v1/parcels/:parcelId/destination',
	UserController.authenticateUser(),
	ParcelValidator.validateDestination(),
	ParcelController.updateDestination());

parcelRouter.put('/api/v1/parcels/:parcelId/editParcel',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelDetails(),
	ParcelController.editParcel('parcel'));


parcelRouter.put('/api/v1/parcels/:parcelId/editPickup',
	UserController.authenticateUser(),
	ParcelValidator.validatePickupDetails(),
	ParcelController.editParcel('pick-up'));

parcelRouter.put('/api/v1/parcels/:parcelId/editReceiver',
	UserController.authenticateUser(),
	ParcelValidator.validateReceiverDetails(),
	ParcelController.editParcel('receiver'));

export default parcelRouter;