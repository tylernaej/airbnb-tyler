// backend/routes/api/session.js
const express = require('express')

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// ...
// backend/routes/api/session.js
// ...

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in 
router.post(
    '/',
    validateLogin,
    async (req, res, next) => {
      const { credential, password } = req.body;
  
      const user = await User.login({ credential, password });
  
      if (!user) {
        const err = new Error('Invalid credentials');
        err.status = 401;
        err.title = 'Invalid credentials';
        err.errors = ['The provided credentials were invalid.'];
        return next(err);
      }
  
      const token = await setTokenCookie(res, user);
      if(user){
        res.status(200)
      }

      let userObject = user.dataValues
      userObject['token'] = token
      return res.json({
        userObject
      });
    }
  );
// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);
// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      res.status(200)
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({
      "message": "Authentication required",
      "statusCode": 401
    });
  }
);


module.exports = router;