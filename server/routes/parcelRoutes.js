import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	UserController,
	ParcelController,
} = controllers;
const { ParcelValidator } = validations;

const parcelRouter = express.Router();

parcelRouter.route('/api/v1/parcels')
	.all(UserController.authenticateUser())
	.post(ParcelValidator.validateCreateParcel(),
		ParcelValidator.findPlace('pick-up-state'),
		ParcelValidator.findPlace('pick-up-lga'),
		ParcelValidator.findPlace('destination-state'),
		ParcelValidator.findPlace('destination-lga'),
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
	ParcelController.getParcels(),
	ParcelController.filterParcels());

parcelRouter.get('/api/v1/users/:userId(\\d+)/parcels/:parcelId(\\d+)',
	UserController.authenticateUser(),
	ParcelController.getParcel());

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/cancel',
	UserController.authenticateUser(),
	ParcelController.updateParcel('cancel'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/presentLocation',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('location'),
	ParcelValidator.findPlace('location-state'),
	ParcelValidator.findPlace('location-lga'),
	ParcelController.updateParcel('location'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/status',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelValidator.validateAdminUpdate('status'),
	ParcelController.updateParcel('delivery-status'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/destination',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('destination'),
	ParcelValidator.findPlace('destination-state'),
	ParcelValidator.findPlace('destination-lga'),
	ParcelController.updateParcel('destination'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editParcel',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('parcel'),
	ParcelController.updateParcel('parcel'));


parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editPickup',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('pickup'),
	ParcelValidator.findPlace('pick-up-state'),
	ParcelValidator.findPlace('pick-up-lga'),
	ParcelController.updateParcel('pick-up'));

parcelRouter.put('/api/v1/parcels/:parcelId(\\d+)/editReceiver',
	UserController.authenticateUser(),
	ParcelValidator.validateParcelUpdate('receiver'),
	ParcelController.updateParcel('receiver'));

parcelRouter.get('/api/v1/parcels/count',
	UserController.authenticateUser(),
	UserController.authorizeUser(),
	ParcelController.countOrders());

export default parcelRouter;