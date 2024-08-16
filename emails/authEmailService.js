import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const brevoAPIKey = process.env.BREVO_API_KEY;
const fromAddress = 'miguelvilchez270910@gmail.com'; // Usa una dirección de tu dominio verificado

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
    const userHtml = `<p>Hola ${name}, confirma tu cuenta en AppSalon</p>
                      <p>Tu cuenta está casi lista, solo debes confirmarla en el siguiente enlace:</p>
                      <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
                      <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`;

    await sendEmail({
        to: email, // Utilizar el correo electrónico real del usuario
        subject: 'AppSalon - Confirma tu cuenta',
        text: 'AppSalon - Confirma tu cuenta',
        html: userHtml
    });
}

export async function sendEmailPasswordReset({ name, email, token }) {
    const userHtml = `<p>Hola ${name}, has solicitado restablecer tu contraseña</p>
                      <p>Sigue el siguiente enlace para generar una nueva contraseña:</p>
                      <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Restablecer Contraseña</a>
                      <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>`;

    await sendEmail({
        to: email, // Utilizar el correo electrónico real del usuario
        subject: 'AppSalon - Restablece tu contraseña',
        text: 'AppSalon - Restablece tu contraseña',
        html: userHtml
    });
}