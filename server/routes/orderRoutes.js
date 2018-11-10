import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const {
	RequestController,
	UserController,
} = controllers;
const { OrderValidations } = validations;

const orderRouter = express.Router();

orderRouter.route('/api/v1/parcels')
.all(UserController.authenticateUser())
.post(OrderValidations.validateOrder(),
	RequestController.createOrder());