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

parcelRouter.get('/api/v1/parcels/:parcelId(\\d+)',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelController.getParcel());

parcelRouter.get('/api/v1/users/:userId(\\d+)/parcels',
	UserController.authenticateUser(),
	ParcelController.getUserParcels(),
	ParcelController.filterParcels());

parcelRouter.get('/api/v1/users/:userId(\\d+)/parcels/:parcelId(\\d+)',
	UserController.authenticateUser(),
	ParcelController.getUserParcel());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/cancel',
	UserController.authenticateUser(),
	ParcelController.cancelParcelOrder());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/presentLocation',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('location'),
	ParcelController.updateLocation());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/status',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('status'),
	ParcelController.updateStatus());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/destination',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('destination'),
	ParcelController.updateDestination());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editParcel',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('parcel'),
	ParcelController.editParcel('parcel'));


parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editPickup',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('pickup'),
	ParcelController.editParcel('pick-up'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editReceiver',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('receiver'),
	ParcelController.editParcel('receiver'));

parcelRouter.get('/api/v1/parcels/count',
	UserController.authenticateUser(),
	ParcelController.countOrders('admin'));

parcelRouter.get('/api/v1/users/:userId(\\d+)/parcels/count',
	UserController.authenticateUser(),
	ParcelController.countOrders('user'));

export default parcelRouter;