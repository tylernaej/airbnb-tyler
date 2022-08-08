// backend/routes/api/users.js
const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//signUp validation
const validateSignup = [
  check('firstName')
  .exists({ checkFalsy: true })
  .isLength({ min: 1 })
  .withMessage('First Name is required'),
  check('lastName')
  .exists({ checkFalsy: true })
  .isLength({ min: 1 })
  .withMessage('Last Name is required'),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];
//Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { firstName, lastName, email, password, username } = req.body;

      const users = await User.findAll({raw: true})

      users.forEach(user => {
        if(user.email === email) {
          res.status(403)
          res.json({
            "message": "User already exists",
            "statusCode": 403,
            "errors": {
              "email": "User with that email already exists"
            }
          })
        }
      });
      const user = await User.signup({ firstName, lastName, email, username, password });
  
      await setTokenCookie(res, user);

      delete user.createdAt
      delete user.updatedAt
  
      return res.json({
        user
      });
    }
);


module.exports = router;