const express = require('express');
const router = express.Router();
const passport = require('passport');
const { verifyAccessToken } = require('../helpers/jwt.service');
const AuthController = require('../controllers/auth');
const passportConfig = require('../middleware/passport');
const CLIENT_URL = 'http://localhost:3000/';

const {
  validateBody,
  validateParam,
  schemas,
} = require('../helpers/user.validate');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get(
  '/google/callback',
  AuthController.authGoogle
  // passport.authenticate('google', {
  //   successRedirect: CLIENT_URL,
  //   failureRedirect: '/signin',
  // })
);
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['profile'] })
);

router.get(
  '/facebook/callback',
  // passport.authenticate('facebook', {
  //   successRedirect: CLIENT_URL,
  //   failureRedirect: '/signin',
  // }),
  AuthController.authFacebook
);

router
  .route('/signup')
  .post(validateBody(schemas.authSignUpSchema), AuthController.signUp);

router
  .route('/signin')
  .post(validateBody(schemas.authSignInSchema), AuthController.signIn);

router
  .route('/changePassword')
  .post(
    validateBody(schemas.authChangePasswordSchema),
    verifyAccessToken,
    AuthController.ChangePassword
  );

router.route('/refreshToken').post(AuthController.refreshToken);

router.route('/logout').post(AuthController.Logout);

router.route('/sendOtp').post(AuthController.sendOTP);

router.route('/verifyOtpSignUp').post(AuthController.verifyOTPSignUp);

router.route('/forgotPassword').post(AuthController.forgotPassword);

router.route('/checkPhone').post(AuthController.checkPhone);

module.exports = router;
