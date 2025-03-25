import bcrypt from 'bcryptjs';
import  User  from '../database/models/User'; 
import { userSchemaValidator } from '../validators/userValidator';
import loginSchemaValidator from '../validators/loginValidator';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/nodeMailer/mailer';
import crypto from 'crypto';

const frontendLink = process.env.FRONTEND_LINK;

interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    email_verified: boolean;
    resetCode: string | null;
    resetCodeExpiry: Date | null;
}

export const register = async (req: any, res: any) => {
    try {

        const { username, email, password } = req.body;
        await userSchemaValidator.validate(req.body);

       

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            email_verified: false,
            
        });

        sendVerificationEmail(email, username, newUser.id);

        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error: any) {
        console.error(error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El correo electrónico ya existe.' });
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }

        return res.status(500).json({
            message: 'Error al crear el usuario',
            error: error.message,
        });
    }
};

export const verifyEmail = async (req: any, res: any) => {
    const { userId } = req.query;

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        if (user.email_verified) {
            return res.status(400).send(`
                <html>
                    <head>
                        <meta http-equiv="refresh" content="1; url=${frontendLink}">
                    </head>
                    <body>
                        <div style="display: flex; justify-content: center; align-items: center;height: 100%; background-color: #e3e3e3;">
                            <a href="${frontendLink}" style="border-width: 2px; border-style: solid; border-radius: 20px; border-color: black; width: auto; height: auto; padding-inline: 20px; text-decoration: none;"
                            >
                                <h1 style="color: #ce0014; font-weight: bold;">
                                    Verificación no necesaria
                                </h1>
                            </a>
                        </div>
                    </body>
                </html>
            `);
        }

        user.email_verified = true;
        await user.save();
        return res.status(200).send(`
            <html>
                <head>
                    <meta http-equiv="refresh" content="3; url=${frontendLink}">
                </head>
                <body>
                    <div style="display: flex; justify-content: center; align-items: center;height: 100%; background-color: #e3e3e3;">
                        <a href="${frontendLink}" style="border-width: 2px; border-style: solid; border-radius: 20px; border-color: black; width: auto; height: auto; padding-inline: 20px; text-decoration: none;"
                        >
                            <h1 style="color: #ce0014; font-weight: bold;">
                                Usuario verificado con exito
                            </h1>
                        </a>
                    </div>
                </body>
            </html>
        `);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Error al verificar el correo.', error });
    }
};

export const forgotPassword = async (req: any, res: any) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'email_not_found' });
        }

        const resetCode = `${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}${crypto.randomInt(0, 10)}`;
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 24);

        user.resetCode = resetCode;
        user.resetCodeExpiry = expiryDate;
        await user.save();

        await sendResetPasswordEmail(email, resetCode);

        res.status(200).json({ message: 'email enviado ' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'error_sending_email' });
    }
};

export const resetPassword = async (req: any, res: any) => {
    const { email, code, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'email_not_found' });
        }

        if (user.resetCode !== code) {
            return res.status(400).json({ message: 'wrong_code' });
        }

        const currentTime = new Date();
        if (currentTime > user.resetCodeExpiry!) {
            user.resetCode = null;
            user.resetCodeExpiry = null;
            await user.save();
            return res.status(400).json({ message: 'expired_code' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'contraseña actualizada ' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'password_updating_error' });
    }
};

export const login = async (req: any, res: any) => {
    try {
        await loginSchemaValidator.validate(req.body);

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'username', 'email', 'email_verified', 'password'],
        });

        if (!user) {
            return res.status(401).json({ message: 'invalid_credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'invalid_credentials' });
        }

        if (!user.email_verified) {
            return res.status(401).json({ message: 'Por favor confirme primero su email' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return res.status(201).json({ message: 'Acceso exitoso', token, user });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }

        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


export const getUserById = async (req: any, res: any) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener el usuario',
            error: error.message,
        });
    }
};

