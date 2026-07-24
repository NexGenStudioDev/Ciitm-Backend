import { Router } from 'express';

const router = Router();

import upload from '../utils/multerUtils.mjs';
// Import new forgot password routes

// import GoogleOAuth2 from '../OAuth2Client/GoogleStrategy.js';

// import { getAlbum } from '../controllers/album.controller.js';
// import { findAllImages, findImage } from '../controllers/image.controller.js';
import { Find_Social_link } from '../controllers/SocialMedia.controller.js';
// import handle_LogOut from '../controllers/LogOut.controller.js';
// import {

//   Find_Student_Status_Controller,
//   Handle_newStudent_Record,
// } from '../controllers/StudentAdmission.controller.js';

// import { SignUp_Admin } from '../controllers/Admin_Sign_Up.controller.js';

// import {
//   Create_Notice_Controller,
//   Delete_Notice_Controller,
// } from '../controllers/createNotice.controller.js';
// import {
//   Create_Order,
//   Find_Student_Payment_Info,
//   Verify_Payment,
// } from '../controllers/StudenyPayment.controller.js';

console.log('User Route Loaded');

// router.post(
//   '/admission/student',
//   upload.single('Avtar'),
//   Handle_newStudent_Record
// );

// router.post('/auth/google', GoogleOAuth2);

// router.post('/create/payment', Create_Order);
// router.post('/pay/verify', Verify_Payment);
// router.get('/find/student/payment/info', Find_Student_Payment_Info);

// router.post('/student/admission', Handle_newStudent_Record);

router.get('/auth/google/failure', (req, res) => {
  res.status(404).json({
    message: 'Authentication failed',
    error: true,
  });
});

// router.post('/create/notice', Create_Notice_Controller);

// router.delete('/delete/notice/:id', Delete_Notice_Controller);

// router.get('/notice', Find_Notice_Controller);

router.get('/link', Find_Social_link);

// router.get('/albums', getAlbum);

// router.get('/gallery/image', findAllImages);

// router.get('/image/:Album__Name', findImage);

// router.post('/forgot/password', ForgotPassword_Controller);
// router.post('/reset/password', ResetPassword_Controller);

// New improved forgot password routes - Use /v1 since /api is already prefixed in app.mjs

export { router as user };
