import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const brevoAPIKey = process.env.BREVO_API_KEY;
const fromAddress = process.env.BREVO_EMAIL_TITULAR; // Usa una dirección de tu dominio verificado

async function sendEmail({ to, subject, text, html }) {
    try {
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: { email: fromAddress },
                to: [{ email: to }],
                subject: subject,
                textContent: text,
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

export async function sendEmailVerification({ name, email, token }) {
    const userHtml = `
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
            a {
                color: #0056b3;
                text-decoration: none;
                font-weight: bold;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>AppSalon</h1>
            <p>Hola ${name},</p>
            <p>Estamos emocionados de tenerte con nosotros. Para completar el registro, confirma tu cuenta en el siguiente enlace:</p>
            <p><a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a></p>
            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
            <p>Saludos,<br/>El equipo de AppSalon</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: email,
        subject: 'AppSalon - Confirma tu cuenta',
        text: `Hola ${name}, confirma tu cuenta en AppSalon. Sigue este enlace: ${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}`,
        html: userHtml
    });
}

export async function sendEmailPasswordReset({ name, email, token }) {
    const userHtml = `
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
            a {
                color: #0056b3;
                text-decoration: none;
                font-weight: bold;
            }
            p {
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>AppSalon</h1>
            <p>Hola ${name},</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Para proceder, sigue el siguiente enlace:</p>
            <p><a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Restablecer Contraseña</a></p>
            <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
            <p>Saludos,<br/>El equipo de AppSalon</p>
        </div>
    </body>
    </html>
    `;

    await sendEmail({
        to: email,
        subject: 'AppSalon - Restablece tu contraseña',
        text: `Hola ${name}, has solicitado restablecer tu contraseña. Sigue este enlace para generar una nueva contraseña: ${process.env.FRONTEND_URL}/auth/olvide-password/${token}`,
        html: userHtml
    });
}
