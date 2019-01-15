import express from 'express';
import controllers from '../controllers';
import validations from '../validations';

const { UserController } = controllers;
const { UserValidator } = validations;
const authRouter = express.Router();

authRouter.post('/api/v1/auth/signup',
  UserValidator.validateUser(),
  UserController.isUnique('Email', 'E-mail address'),
  UserController.register());

authRouter.post('/api/v1/auth/login',
  UserValidator.validateSignin(), 
  UserController.signin());

authRouter.put('/api/v1/auth/uploadPhoto',
  UserController.authenticateUser(),
  UserController.uploadPhoto(),
  UserController.errorHandler(),
  UserController.updatePhotoURL());

authRouter.put('/api/v1/auth/removePhoto',
  UserController.authenticateUser(),
  UserController.removePhoto());

authRouter.post('/api/v1/auth/email', 
  UserValidator.validateEmail(),
  UserController.checkIfExist('email', 'email address'));

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

authRouter.put('/api/v1/auth/changePassword', 
  UserController.authenticateUser(),
  UserValidator.validateUserUpdate('password'),
  UserController.changePassword({ isAuthenticated: true }));

authRouter.put('/api/v1/auth/resetPassword', 
  UserValidator.validateUserUpdate('reset'),
  UserController.changePassword({ isAuthenticated: false }));

authRouter.post('/api/v1/auth/verifyPassword', 
  UserController.authenticateUser(),
  UserController.verifyPassword());

authRouter.post('/api/v1/auth/verifyAuth', 
  UserController.checkAuth());

export default authRouter;
