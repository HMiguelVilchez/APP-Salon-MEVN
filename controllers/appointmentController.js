import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import Appointment from '../models/Appointment.js'
import { validateObjectId, handleNotFoundError, formatDate } from '../utils/index.js'
import { sendEmailCancelAppointment, sendEmailNewAppointment, sendEmailUpdateAppointment } from '../emails/appointmentEmailService.js'

const createAppointment = async (req, res) => {
    const appointment = req.body
    appointment.user = req.user._id.toString()
    try {
        const newAppointment = new Appointment(appointment)
        console.log(newAppointment)
        const result = await newAppointment.save()

        await sendEmailNewAppointment({ date: formatDate(result.date), time: result.time })

        res.json({
            msg: 'Tu reserva se ha realizado correctamente'
        })

    } catch (error) {
        console.log(error)
    }
}

const getAppointmentsByDate = async (req, res) => {
    const { date } = req.query
    // console.log(date)
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    if (!isValid(newDate)) {
        const error = new Error('Fecha no válida')
        return res.status(400).json({
            msg: error.message
        })
    }

    const isoDate = formatISO(newDate)
    const appointments = await Appointment.find({
        date: {
            $gte: startOfDay(new Date(isoDate)),
            $lte: endOfDay(new Date(isoDate))
        }
    }).select('time')

    res.json(appointments)
}
const getAppointmentsByDate1 = async (req, res) => {
    try {
        const { date } = req.query;

        // Parsear la fecha del query string
        const newDate = parse(date, 'yyyy-MM-dd', new Date());

        // Verificar si la fecha es válida
        if (!isValid(newDate)) {
            const error = new Error('Fecha no válida');
            return res.status(400).json({ msg: error.message });
        }

        // Crear rango de tiempo para la consulta del día completo
        const start = startOfDay(newDate);
        const end = endOfDay(newDate);

        // Realizar la consulta para obtener las citas del día
        const appointments = await Appointment
            .find({ date: { $gte: start, $lte: end } })  // Ajustar la consulta
            .populate('services')
            .populate({ path: 'user', select: 'name email' })
            .sort({ date: 'asc' });

        // Devolver las citas encontradas
        res.json(appointments);

    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener las citas' });
    }
};




const getAppointmentById = async (req, res) => {
    const { id } = req.params
    //Validar por Object id
    if (validateObjectId(id, res)) return
    //Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    // console.log(appointment.user.toString())
    // console.log(req.user._id.toString())
    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    //Retornar la cita
    res.json(appointment)
}

const updateAppointment = async (req, res) => {
    const { id } = req.params
    //Validar por Object id
    if (validateObjectId(id, res)) return
    //Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    // console.log(appointment.user.toString())
    // console.log(req.user._id.toString())
    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    const { date, time, totalAmount, services } = req.body
    appointment.date = date
    appointment.time = time
    appointment.totalAmount = totalAmount
    appointment.services = services

    try {
        const result = await appointment.save()
        await sendEmailUpdateAppointment({ date: formatDate(result.date), time: result.time })
        res.json({
            msg: 'Cita actualizada correctamente'
        })

    } catch (error) {
        console.log(error)
    }
}

const deleteAppointment = async (req, res) => {
    const { id } = req.params

    // Validar por Object id
    if (validateObjectId(id, res)) return

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services')
    if (!appointment) {
        return handleNotFoundError('La cita no existe', res)
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos')
        return res.status(403).json({ msg: error.message })
    }

    const { date, time, totalAmount, services } = req.body
    appointment.date = date
    appointment.time = time
    appointment.totalAmount = totalAmount
    appointment.services = services

    try {
        // Obtener el documento antes de eliminarlo
        const result = await Appointment.findByIdAndDelete(id)
        
        // Usar el documento para enviar el correo
        await sendEmailCancelAppointment({ date: formatDate(result.date), time: result.time })

        res.json({
            msg: 'Cita cancelada correctamente'
        })
    } catch (error) {
        console.error('Error al cancelar la cita:', error)
        return res.status(500).json({ msg: 'Error al cancelar la cita' })
    }
}
export {
    createAppointment,
    getAppointmentsByDate,
    getAppointmentsByDate1,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
}