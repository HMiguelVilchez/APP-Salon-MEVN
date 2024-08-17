import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import { db } from './config/db.js';
import ServicesRoutes from './routes/servicesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import appointmentRoutes1 from './routes/appointmentRoutes1.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from "cookie-parser";
const app = express();
// Variables de entorno
dotenv.config();
const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2];

app.use(
    cors({
        origin: function (origin, callback) {
            //console.log("😲😲😲 =>", origin);
            if (!origin || whiteList.includes(origin)) {
                return callback(null, origin);
            }
            return callback(
                "Error de CORS origin: " + origin + " No autorizado!"
            );
        },
        credentials: true,
    })
);

// Configurar la aplicación
app.use(express.json());
app.use(cookieParser());

// Leer datos vía Body


// Conectar a la base de datos
db();

// Configurar CORS para permitir credenciales y origen específico


// Definir rutas
app.use('/services', ServicesRoutes);
app.use('/auth', authRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/appointmentss', appointmentRoutes1);
app.use('/users', userRoutes);

// Definir puerto
const PORT = process.env.PORT || 4000;

// Iniciar aplicación
app.listen(PORT, () => {
    console.log(colors.blue.bgMagenta.bold('El servidor se está ejecutando en el puerto:', PORT));
});