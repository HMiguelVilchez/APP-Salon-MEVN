import express from "express";
import { createAppointment, getAppointmentById, updateAppointment,deleteAppointment, getAppointmentsByDate1, } from '../controllers/appointmentController.js'
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router()

router.route('/')
    .post(authMiddleware, createAppointment)
    .get(getAppointmentsByDate1)



    



router.route('/:id')
    .get(authMiddleware, getAppointmentById)
    .put(authMiddleware, updateAppointment)
    .delete(authMiddleware, deleteAppointment)

export default router