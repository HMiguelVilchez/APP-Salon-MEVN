import Appointment from '../models/Appointment.js'

const getUserAppointments = async (req, res) => {
    const { user } = req.params
    const { date } = req.query;  // Obtener la fecha de la consulta (query)

    // Verificar si el usuario tiene permiso para acceder a esta información
    if (user !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'Acceso denegado' })
    }

    try {
        let query;
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        // Si no se proporciona una fecha, buscar citas del día actual
        if (!date) {
            query = req.user.admin 
                ? { date: { $gte: startOfDay, $lte: endOfDay } } 
                : { user, date: { $gte: startOfDay, $lte: endOfDay } }
        } else {
            // Si se proporciona una fecha, buscar citas para esa fecha específica
            const selectedDate = new Date(date);
            if (isNaN(selectedDate.getTime())) {
                return res.status(400).json({ msg: 'Fecha inválida' });
            }

            const startOfSelectedDay = new Date(selectedDate.setHours(0, 0, 0, 0));
            const endOfSelectedDay = new Date(selectedDate.setHours(23, 59, 59, 999));

            console.log('Start of selected day:', startOfSelectedDay);
            console.log('End of selected day:', endOfSelectedDay);

            query = req.user.admin 
                ? { date: { $gte: startOfSelectedDay, $lte: endOfSelectedDay } } 
                : { user, date: { $gte: startOfSelectedDay, $lte: endOfSelectedDay } }
        }

        // Buscar las citas con la consulta construida
        const appointments = await Appointment
            .find(query)
            .populate('services')
            .populate({ path: 'user', select: 'name email' })
            .sort({ date: 'asc' })

        // Devolver las citas encontradas
        res.json(appointments)
    } catch (error) {
        // Manejo de errores
        console.error(error)
        res.status(500).json({ msg: 'Hubo un error al obtener las citas' })
    }
}

export {
    getUserAppointments
}


