import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const brevoAPIKey = process.env.BREVO_API_KEY;

async function sendEmail({ subject, html }) {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'Cruz', email: 'miguelvilchez270910@gmail.com' }, // Asegúrate de que este correo esté verificado en Brevo
                to: [{ email: 'alytxptby561@gmail.com' }],
                subject: subject,
                htmlContent: html,
            },
            {
                headers: {
                    'api-key': brevoAPIKey,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Email enviado:', response.data.messageId);
    } catch (error) {
        console.error('Error enviando email:', error.response ? error.response.data : error.message);
    }
}

export async function sendEmailNewAppointment({ date, time }) {
    const htmlContent = `<p>Hola: Admin, tienes una nueva cita</p>
                         <p>La cita será el día: ${date} a la hora: ${time}</p>`;

    await sendEmail({
        subject: 'CruzBarberShop - Nueva Cita',
        html: htmlContent
    });
}

export async function sendEmailUpdateAppointment({ date, time }) {
    const htmlContent = `<p>Hola: Admin, un usuario ha modificado la cita</p>
                         <p>La nueva cita será el día: ${date} a la hora: ${time}</p>`;

    await sendEmail({
        subject: 'CruzBarberShop - Cita actualizada',
        html: htmlContent
    });
}

export async function sendEmailCancelAppointment({ date, time }) {
    const htmlContent = `<p>Hola: Admin, un usuario ha cancelado la cita</p>
                         <p>La cita cancelada era para el día: ${date} a la hora: ${time}</p>`;

    await sendEmail({
        subject: 'CruzBarberShop - Cita Cancelada',
        html: htmlContent
    });
}
