import { parse, formatISO, startOfDay, endOfDay, isValid } from 'date-fns'
import Appointment from '../models/Appointment.js'
import { validateObjectId, handleNotFoundError, formatDate } from '../utils/index.js'
import { sendEmailCancelAppointment, sendEmailNewAppointment, sendEmailNewAppointment1, sendEmailUpdateAppointment } from '../emails/appointmentEmailService.js'
import Voucher from '../models/Voucher.js';
import mongoose from 'mongoose';

const barberMapping = {
    '66b63e2afc053ca48e515452': 'Cruz', // ObjectId para Cruz
    '66b63e2afc053ca48e515453': 'David', // ObjectId para David
};


const createAppointment = async (req, res) => {
    const appointment = req.body;

    // Validar que `selectedBarber` esté definido y sea un ObjectId válido
    if (!appointment.selectedBarber || !mongoose.Types.ObjectId.isValid(appointment.selectedBarber)) {
        return res.status(400).json({ msg: 'Barbero seleccionado no válido' });
    }

    // Asignar el ID del usuario actual y su número de teléfono a la cita
    appointment.user = req.user._id.toString();
    appointment.phonecita = req.user.phone;

    try {
        // Crear una nueva instancia de cita y guardarla en la base de datos
        const newAppointment = new Appointment(appointment);
        const result = await newAppointment.save();
        

        const barberName = barberMapping[result.selectedBarber];

        // Enviar correo electrónico de confirmación
        await sendEmailNewAppointment({
            date: formatDate(result.date),
            time: result.time,
            totalAmount : result.totalAmount,
            barberName: barberName,
            phonecita: result.phonecita
        });

        // Responder con éxito
        res.json({ msg: 'Tu reserva se ha realizado correctamente' });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ msg: 'Hubo un error al crear la cita', error: error.message });
    }
};

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

const getAppointmentsByDate2 = async (req, res) => {
    try {
        const { date, barber } = req.query;

        // Parsear la fecha del query string
        const newDate = parse(date, 'dd/MM/yyyy', new Date());

        // Verificar si la fecha es válida
        if (!isValid(newDate)) {
            const error = new Error('Fecha no válida');
            return res.status(400).json({ msg: error.message });
        }

        // Crear rango de tiempo para la consulta del día completo
        const start = startOfDay(newDate);
        const end = endOfDay(newDate);

        // Crear objeto de consulta
        let query = { date: { $gte: start, $lte: end } };

        // Agregar filtro de barbero si está presente
        if (barber) {
            query.selectedBarber = barber; // Asegúrate de que el campo en el modelo sea `selectedBarber`
        }

        // Ejecutar la consulta en la base de datos
        const appointments = await Appointment.find(query, 'time date selectedBarber');

        // Devolver los resultados
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener citas' });
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
export const postvouchers = async (req, res) => {
    try {
        const { description, amount, date } = req.body;

        // Si se proporciona una fecha, usarla; de lo contrario, usar la fecha y hora actual
        let voucherDate;
        if (date) {
            voucherDate = parse(date, 'yyyy-MM-dd', new Date());
            if (!isValid(voucherDate)) {
                return res.status(400).json({ message: 'Fecha no válida' });
            }
        } else {
            voucherDate = new Date(); // Usar la fecha y hora actual
        }

        // Crear un nuevo documento de vale
        const newVoucher = new Voucher({
            amount,
            date: voucherDate,
            description,
        });

        // Guardar el vale en la base de datos
        await newVoucher.save();
        await sendEmailNewAppointment1({
            date: formatISO(newVoucher.date),
            amount: newVoucher.amount,
            description: newVoucher.description
        });
        
        // Enviar respuesta de éxito
        res.status(200).json({ message: 'Vale creado exitosamente', voucher: newVoucher });
    } catch (error) {
        console.error('Error al crear el vale:', error);
        res.status(500).json({ message: 'Error al crear el vale' });
    }
};

export const getvouchers = async (req, res) => {
    try {
        // Obtener la fecha del parámetro de consulta
        const { date } = req.query;

        // Verificar si se proporcionó una fecha
        if (!date) {
            return res.status(400).json({ msg: 'Debe proporcionar una fecha' });
        }

        // Establecer el inicio y final del día para la fecha proporcionada
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Filtrar los vales por la fecha especificada
        const vouchers = await Voucher.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        });

        res.status(200).json(vouchers);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los vales', error });
    }
};
export const getvouchers1 = async (req, res) => {
    try {
        const { date } = req.query;

        // Parsear la fecha del parámetro de consulta
        const newDate = parse(date, 'yyyy-MM-dd', new Date());

        // Validar si la fecha es válida
        if (!isValid(newDate)) {
            return res.status(400).json({
                msg: 'Fecha no válida'
            });
        }

        // Convertir la fecha a formato ISO
        const isoDate = formatISO(newDate);

        // Buscar los vales para el rango de fechas especificado
        const vouchers = await Voucher.find({
            date: {
                $gte: startOfDay(new Date(isoDate)),
                $lte: endOfDay(new Date(isoDate))
            }
        }).select('amount date description'); // Selecciona los campos necesarios

        // Enviar la respuesta con los vales encontrados
        res.json(vouchers);
    } catch (error) {
        console.error('Error al obtener los vales:', error);
        res.status(500).json({
            msg: 'Error al obtener los vales'
        });
    }
};


const updateAppointment = async (req, res) => {
    const { id } = req.params;

    // Validar por Object id
    if (validateObjectId(id, res)) return;

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services');
    if (!appointment) {
        return handleNotFoundError('La cita no existe', res);
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos');
        return res.status(403).json({ msg: error.message });
    }

    const { date, time, totalAmount, services, phonecita, selectedBarber } = req.body;
    appointment.date = date;
    appointment.time = time;
    appointment.totalAmount = totalAmount;
    appointment.services = services;
    appointment.phonecita = phonecita;
    appointment.selectedBarber = selectedBarber;

    try {
        // Guarda la cita actualizada
        const result = await appointment.save();

        // Obtener el nombre del barbero
        const barberName = barberMapping[result.selectedBarber];

        // Enviar correo electrónico de actualización
        await sendEmailUpdateAppointment({
            date: formatDate(result.date),
            time: result.time,
            phonecita: result.phonecita,
            totalAmount: result.totalAmount,
            barberName: barberName // Incluye el nombre del barbero en el correo
        });

        // Responder con éxito
        res.json({
            msg: 'Cita actualizada correctamente'
        });

    } catch (error) {
        console.log('Error al actualizar la cita:', error);
        res.status(500).json({ msg: 'Hubo un error al actualizar la cita', error: error.message });
    }
};


const deleteAppointment = async (req, res) => {
    const { id } = req.params;

    // Validar por Object id
    if (validateObjectId(id, res)) return;

    // Validar que exista
    const appointment = await Appointment.findById(id).populate('services');
    if (!appointment) {
        return handleNotFoundError('La cita no existe', res);
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
        const error = new Error('No tienes los permisos');
        return res.status(403).json({ msg: error.message });
    }

    try {
        // Obtener el documento antes de eliminarlo
        const result = await Appointment.findByIdAndDelete(id);

        // Obtener el nombre del barbero usando `barberMapping`
        const barberName = barberMapping[result.selectedBarber];

        // Enviar correo electrónico de cancelación
        await sendEmailCancelAppointment({
            date: formatDate(result.date),
            time: result.time,
            phonecita: result.phonecita,
            totalAmount: result.totalAmount,
            barberName: barberName // Incluye el nombre del barbero en el correo
        });

        res.json({
            msg: 'Cita cancelada correctamente'
        });

    } catch (error) {
        console.error('Error al cancelar la cita:', error);
        return res.status(500).json({ msg: 'Error al cancelar la cita' });
    }
};

export {
    createAppointment,
    getAppointmentsByDate,
    getAppointmentsByDate1,
    getAppointmentsByDate2,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
}