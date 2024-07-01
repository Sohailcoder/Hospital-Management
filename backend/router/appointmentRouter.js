import express from "express";
import { getAllMessages, sendMessage } from '../controller/messageController.js';
import { isAdminAuthenticated, isPatienAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from "../controller/appointmentController.js";

router.post('/post',isPatienAuthenticated,postAppointment);
router.get('/getAll',isAdminAuthenticated,getAllAppointments);
router.put('/update/:id',isAdminAuthenticated,updateAppointmentStatus);
router.delete('/delete/:id',isAdminAuthenticated,deleteAppointment);

export default router;