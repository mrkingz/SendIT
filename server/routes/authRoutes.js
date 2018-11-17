import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const { UserController } = controllers;
const { UserValidations } = validations;
const authRouter = express.Router();

authRouter.post('/api/v1/auth/signup',
  UserValidations.validateUser(),
  UserValidations.isUnique('Email', 'E-mail address has been used'),
  UserController.register());

  authRouter.post('/api/v1/auth/login', 
  UserController.signin());

export default authRouter;
