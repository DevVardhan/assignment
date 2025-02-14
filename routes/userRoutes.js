import express from 'express';
import userController from '../controller/userController.js';

const router = express.Router();

// user Signup
router.route('/signUp')
      .post(userController.signupUser)

// get ALl user -- no auth required
router.route('/')
      .get( userController.getAllUsers);

// user SignIn
router.route('/signIn') 
      .post (userController.userSingin);
      
// get a specific user -- auth required      
router.route('/:key/:value')
      .get(userController.isLogged, userController.getUser);


export default router;