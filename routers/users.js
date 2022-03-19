const express = require('express');
const router = express.Router();
//const router = require("express-promise-router")();
const { verifyAccessToken } = require('../helpers/jwt.service');
const UserController = require('../controllers/users');

const {
  validateBody,
  validateParam,
  schemas,
} = require('../helpers/user.validate');

router
  .route('/GetUserAfterLogin')
  .get(verifyAccessToken, UserController.GetUserAfterLogin);

router
  .route('/GetUserByPhone')
  .post(verifyAccessToken, UserController.GetUserByPhone);

router
  .route('/:userID')
  .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
  .put(validateParam(schemas.idSchema, 'userID'), UserController.replaceUser)
  .patch(
    validateParam(schemas.idSchema, 'userID'),
    validateBody(schemas.userOptionalSchema),
    UserController.updateUser
  )
  .delete(validateParam(schemas.idSchema, 'userID'), UserController.deleteUser);

router
  .route('/')
  .get(verifyAccessToken, UserController.getAllUser)
  .post(validateBody(schemas.userSchema), UserController.newUser);

module.exports = router;
