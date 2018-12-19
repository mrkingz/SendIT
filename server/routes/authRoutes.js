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

authRouter.post('/api/v1/auth/email', 
  UserController.checkExist('email'));

authRouter.get('/api/v1/auth/profileDetails', 
  UserController.authenticateUser(),
  UserController.getProfileDetails());

authRouter.put('/api/v1/auth/editName', 
  UserController.authenticateUser(),
  UserValidator.validateUserUpdate('name'),
  UserController.editProfileDetails('name'));

authRouter.put('/api/v1/auth/phoneNumber', 
  UserController.authenticateUser(),
  UserValidator.validateUserUpdate('phone'),
  UserController.editProfileDetails('phone-number'));

authRouter.post('/api/v1/auth/verifyPassword', 
  UserController.authenticateUser(),
  UserValidator.validateUserUpdate('password'),
  UserController.verifyPassword());

authRouter.post('/api/v1/auth/verifyAuth', 
  UserController.checkAuth());

export default authRouter;
