import express from 'express';
const router = express.Router();
import { login, patientRegister,addNewAdmin, getallDoctor, getUserDetails, adminLogout, patientLogout,addNewDoctor } from '../controller/userController.js';
import { isAdminAuthenticated,isPatienAuthenticated } from '../middlewares/auth.js';

router.post('/patient/register',patientRegister);
router.post('/login',login);
router.post('/admin/addnew',addNewAdmin);
router.get('/doctors',getallDoctor);
router.get('/admin/me',getUserDetails);
router.get('/patient/me',getUserDetails);
router.get('/admin/logout',adminLogout);
router.get('/patient/logout',patientLogout);
router.post('/doctor/addnew',addNewDoctor);
// router.post('/patient/register',patientRegister);
// router.post('/login',login);
// router.post('/admin/addnew',isAdminAuthenticated,addNewAdmin);
// router.get('/doctors',getallDoctor);
// router.get('/admin/me',isAdminAuthenticated,getUserDetails);
// router.get('/patient/me',isPatienAuthenticated,getUserDetails);
// router.get('/admin/logout',isAdminAuthenticated,adminLogout);
// router.get('/patient/logout',isPatienAuthenticated,patientLogout);
// router.post('/doctor/addnew',isAdminAuthenticated,addNewDoctor);


export default router;