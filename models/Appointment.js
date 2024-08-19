import mongoose from 'mongoose';  // Asegúrate de importar mongoose

const appointmentSchema = mongoose.Schema({
    services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Services'
        }
    ],
    date: {
        type: Date
    },
    time: {
        type: String
    },
    totalAmount: {
        type: Number
    },
    selectedBarber: {
        type: mongoose.Schema.Types.ObjectId,  // Asegúrate de usar ObjectId si este campo es una referencia a otra colección
        ref: 'Barber'  // Asumiendo que tienes una colección de barberos
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;


