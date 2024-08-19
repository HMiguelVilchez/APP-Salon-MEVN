import express from "express";
import {getAppointmentsByDate2 } from '../controllers/appointmentController.js'


const router = express.Router()

router.route('/')
    .get(getAppointmentsByDate2)



    





export default router