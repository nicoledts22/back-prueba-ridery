const express = require('express');
const { ManageSession, ManageAuth, ManagePassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', ManageSession.signup);
router.post('/login', ManageSession.login);
router.post('/logout', ManageSession.logout);
router.get('/isLogged', ManageAuth.isLoggedIn);
router.get('/authMe', ManageAuth.protect, ManageAuth.authMe);


router.post('/forgotPassword', ManagePassword.forgotPassword);
router.patch('/resetPassword/:token', ManagePassword.resetPassword);

router.patch('/updateMyPassword', ManageAuth.protect, ManagePassword.updatePassword);

module.exports = router;
