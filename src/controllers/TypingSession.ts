import { Request, Response } from 'express';
import TypingSession from '../database/models/TypingSession';
import Word from '../database/models/Word'; 
import SessionWord from '../database/models/SessionWord';
import { sequelize } from '../database/models/index';
import { logger } from '../database/config/winston.config';

export const createTypingSession = async (req: Request, res: Response) => {
    const { userId } = req.body;
    const transaction = await sequelize.transaction();

    const startLogMessage = 'Creando nueva sesión de mecanografía';
    logger.info(startLogMessage, { userId });

    try {
        const newSession = await TypingSession.create({
            user_id: userId,
        }, { transaction });

        await transaction.commit();

        const successMessage = 'Sesión de mecanografía creada exitosamente';
        logger.info(successMessage, {
            sessionId: newSession.id,
            userId
        });

        return res.status(201).json({
            message: successMessage,
            sessionId: newSession.id,
        });

    } catch (error: any) {
        await transaction.rollback();

        const errorMessage = 'Error al crear sesión de mecanografía';
        logger.error(errorMessage, {
            error: error.message,
            stack: error.stack,
            userId
        });

        if (error.name === 'ValidationError') {
            const validationMessage = 'Error de validación al crear sesión';
            logger.warn(validationMessage, {
                errors: error.errors
            });
            return res.status(400).json({ 
                message: validationMessage,
                errors: error.errors 
            });
        }

        return res.status(500).json({
            message: errorMessage,
            error: error.message,
        });
    }
};

export const getAndLinkSessionWords = async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const transaction = await sequelize.transaction();

    const startLogMessage = 'Vinculando palabras a sesión';
    logger.info(startLogMessage, { sessionId });

    try {
        const session = await TypingSession.findByPk(sessionId, { transaction });
        if (!session) {
            await transaction.rollback();
            const notFoundMessage = 'Sesión no encontrada';
            logger.warn(notFoundMessage, { sessionId });
            return res.status(404).json({ message: notFoundMessage });
        }

        const words = await Word.findAll({
            order: sequelize.random(),
            limit: 20,
            transaction,
        });

        if (words.length === 0) {
            await transaction.rollback();
            const noWordsMessage = 'No se encontraron palabras para vincular';
            logger.warn(noWordsMessage, { sessionId });
            return res.status(404).json({ message: noWordsMessage });
        }

        const sessionWords = words.map((word) => ({
            session_id: session.id,
            word_id: word.id,
            created_at: new Date(),
        }));

        await SessionWord.bulkCreate(sessionWords, { transaction });
        await transaction.commit();

        const successMessage = 'Palabras vinculadas a la sesión exitosamente';
        logger.info(successMessage, {
            sessionId,
            wordsCount: words.length
        });

        return res.status(200).json({
            message: successMessage,
            sessionId: session.id,
            words: words.map((word) => ({ id: word.id, word: word.word })),
        });

    } catch (error: any) {
        await transaction.rollback();

        const errorMessage = 'Error al vincular palabras a sesión';
        logger.error(errorMessage, {
            error: error.message,
            stack: error.stack,
            sessionId
        });

        return res.status(500).json({
            message: errorMessage,
            error: error.message,
        });
    }
};