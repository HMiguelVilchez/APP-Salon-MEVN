import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const brevoAPIKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_EMAIL_TITULAR;
const recipientEmail = process.env.BREVO_EMAIL_CLIENTE;

async function sendEmail({ subject, html }) {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { name: 'CruzBarberShop', email: senderEmail }, // Asegúrate de que este correo esté verificado en Brevo
                to: [{ email: recipientEmail }],
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
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            h1 {
                color: #0056b3;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CruzBarberShop</h1>
            <p>Hola Cruz,</p>
            <p>Te informamos que se ha programado una nueva cita.</p>
            <p><strong>Detalles de la Cita:</strong></p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p>Si tienes alguna pregunta, no dudes en ponerte en contacto con nosotros.</p>
            <p>Saludos,<br/>El equipo de CruzBarberShop</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        subject: 'CruzBarberShop - Nueva Cita',
        html: htmlContent
    });
}

export async function sendEmailNewAppointment1({ date, amount, description }) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            h1 {
                color: #0056b3;
            }
            p {
                margin: 10px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            table td, table th {
                padding: 10px;
                border: 1px solid #ddd;
            }
            table th {
                background-color: #f4f4f4;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CruzBarberShop</h1>
            <p>Hola Cruz,</p>
            <p>Se ha registrado un nuevo retiro de vale.</p>
            <table>
                <tr>
                    <th>Monto</th>
                    <td>${amount}</td>
                </tr>
                <tr>
                    <th>Descripción</th>
                    <td>${description}</td>
                </tr>
                <tr>
                    <th>Fecha</th>
                    <td>${date}</td>
                </tr>
            </table>
            <p>Gracias por tu atención.</p>
            <p>Saludos,<br/>El equipo de CruzBarberShop</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        subject: 'CruzBarberShop - Retiro de Vale',
        html: htmlContent
    });
}

export async function sendEmailUpdateAppointment({ date, time }) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            h1 {
                color: #0056b3;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CruzBarberShop</h1>
            <p>Hola Cruz,</p>
            <p>Un usuario ha modificado la cita.</p>
            <p><strong>Nueva Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p>Para más detalles, por favor contáctanos.</p>
            <p>Saludos,<br/>El equipo de CruzBarberShop</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        subject: 'CruzBarberShop - Cita Actualizada',
        html: htmlContent
    });
}

export async function sendEmailCancelAppointment({ date, time }) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                color: #333;
                line-height: 1.6;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 8px;
            }
            h1 {
                color: #0056b3;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>CruzBarberShop</h1>
            <p>Hola Cruz,</p>
            <p>Un usuario ha cancelado una cita.</p>
            <p><strong>Fecha de la Cita:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p>Si tienes preguntas, no dudes en contactarnos.</p>
            <p>Saludos,<br/>El equipo de CruzBarberShop</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        subject: 'CruzBarberShop - Cita Cancelada',
        html: htmlContent
    });
}
