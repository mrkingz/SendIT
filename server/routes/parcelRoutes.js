import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	ParcelController,
	UserController,
} = controllers;
const { ParcelValidations } = validations;

const ParcelRouter = express.Router();

ParcelRouter.route('/api/v1/parcels')
.all(UserController.authenticateUser())
.post(ParcelValidations.isRequired(),
	ParcelValidations.isEmpty(),
	ParcelValidations.isValid(),
	ParcelController.createParcel());

ParcelRouter.route('/api/v1/parcels/:parcelId')
.all(UserController.authenticateUser(),
	UserController.authorizeUser())
.get(ParcelController.getParcel());

export default ParcelRouter;