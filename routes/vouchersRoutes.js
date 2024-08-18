import express from "express";
import { postvouchers, getvouchers1 } from '../controllers/appointmentController.js';

const router = express.Router();

// Definir rutas para manejar los vales
router.route('/')
    .post(postvouchers)  // Ruta para crear un vale
    .get(getvouchers1)    // Ruta para obtener los vales

export default router;
