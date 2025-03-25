import nodemailer from 'nodemailer';
import { SentMessageInfo, SendMailOptions } from 'nodemailer';
import { MAIL_USER, MAIL_USER_SECRET, OWN_LINK, PORT } from '../../configs';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_USER_SECRET 
  },
  logger: true, 
  debug: true 
});


const sendVerificationEmail = async (
  email: string,
  username: string,
  userId: string
): Promise<void> => {
  const verificationLink = `${OWN_LINK}${PORT ? `:${PORT}` : ''}/api/verify-email?userId=${userId}`;

  const mailOptions: SendMailOptions = {
    from: `Soporte Técnico <${MAIL_USER}>`,
    to: email,
    subject: 'Verificación de Correo Electrónico',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Hola ${username},</h2>
        <p style="line-height: 1.6;">Gracias por registrarte. Por favor verifica tu correo haciendo clic en el siguiente enlace:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="display: inline-block; 
                    background-color: #ce0014; 
                    color: white; 
                    padding: 12px 25px; 
                    border-radius: 5px; 
                    text-decoration: none;
                    font-weight: bold;
                    transition: background-color 0.3s;">
            Verificar
          </a>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
          <p style="word-break: break-all;">${verificationLink}</p>
          <p style="margin-top: 15px;">Si no solicitaste este registro, por favor ignora este mensaje.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email de verificación enviado a ${email} (ID: ${info.messageId})`);
  } catch (error) {
    console.error('🔥 Error al enviar el correo:', error);
    throw new Error('Error al enviar el email de verificación. Por favor intenta nuevamente.');
  }
};


const sendResetPasswordEmail = async (
  email: string, 
  resetCode: string
): Promise<SentMessageInfo> => {
  const mailOptions: SendMailOptions = {
    from: `Soporte Técnico <${MAIL_USER}>`,
    to: email,
    subject: 'Restablecimiento de Contraseña',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">Restablecimiento de Contraseña</h2>
        
        <p style="line-height: 1.6;">Has solicitado restablecer tu contraseña. Tu código de restablecimiento es:</p>
        
        <div style="background: #f8f9fa; 
                    padding: 15px; 
                    margin: 25px 0; 
                    font-size: 24px; 
                    letter-spacing: 3px;
                    text-align: center;
                    border-radius: 5px;
                    border: 1px solid #eee;">
          ${resetCode}
        </div>

        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; color: #666; font-size: 13px;">
          <p>Este código expirará en 15 minutos.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email de restablecimiento enviado a ${email} (ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error('🔥 Error al enviar correo de restablecimiento:', error);
    throw new Error('Error al enviar el email de restablecimiento');
  }
};

export { sendVerificationEmail, sendResetPasswordEmail };
