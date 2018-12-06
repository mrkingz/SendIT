import express from 'express';
import controllers from '../controllers';

const { PageController } = controllers;
const pageRouter = express.Router();

pageRouter.get('/', PageController.getIndex());
pageRouter.get('/signup', PageController.getSignup());
pageRouter.get('/signin', PageController.getLogin());
pageRouter.get('/dashboard', PageController.getDashboard());
pageRouter.get('/create', PageController.getCreate());
pageRouter.get('/orders', PageController.getOrders());
pageRouter.get('/orders/:parcelId', PageController.getDetails());
pageRouter.get('/profile', PageController.getProfile());
pageRouter.get('/password', PageController.getPassword());

export default pageRouter;