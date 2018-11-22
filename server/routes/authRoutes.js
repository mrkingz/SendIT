import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const { UserController } = controllers;
const { UserValidator } = validations;
const authRouter = express.Router();

authRouter.post('/api/v1/auth/signup',
  UserValidator.validateUser(),
  UserValidator.isUnique('Email', 'E-mail address has been used'),
  UserController.register());

  authRouter.post('/api/v1/auth/login',
  UserValidator.validateSignin(), 
  UserController.signin());

export default authRouter;
