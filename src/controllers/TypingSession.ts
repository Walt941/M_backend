import { Request, Response } from 'express';
import  TypingSession  from '../database/models/TypingSession';
import   Word from '../database/models/Word'; 
import  SessionWord  from '../database/models/SessionWord';
import { sequelize } from '../database/models/index'; 

export const createTypingSession = async (req: Request, res: Response) => {
    const { userId } = req.body;

    const transaction = await sequelize.transaction();  

    try {
        
        const newSession = await TypingSession.create({
            user_id: userId,
        }, { transaction });

        await transaction.commit();  

        return res.status(201).json({
            message: 'Sesión de mecanografía creada exitosamente',
            sessionId: newSession.id,
        });

    } catch (error: any) {
        await transaction.rollback();  
        console.error(error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }

        return res.status(500).json({
            message: 'Error al crear la sesión de mecanografía',
            error: error.message,
        });
    }
};


export const getAndLinkSessionWords = async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const transaction = await sequelize.transaction();  

    try {
       
        const session = await TypingSession.findByPk(sessionId, { transaction });
        if (!session) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Sesión no encontrada' });
        }

        
        const words = await Word.findAll({
            order: sequelize.random(), 
            limit: 20, 
            transaction,
        });

        if (words.length === 0) {
            await transaction.rollback();
            return res.status(404).json({ message: 'No se encontraron palabras' });
        }

       
        const sessionWords = words.map((word) => ({
            session_id: session.id,
            word_id: word.id,
            created_at: new Date(),
        }));

        await SessionWord.bulkCreate(sessionWords, { transaction });

        await transaction.commit();  

        
        return res.status(200).json({
            message: 'Palabras vinculadas a la sesión exitosamente',
            sessionId: session.id,
            words: words.map((word) => ({ id: word.id, word: word.word })), 
        });

    } catch (error: any) {
        await transaction.rollback();  
        console.error(error);

        return res.status(500).json({
            message: 'Error al obtener y vincular palabras a la sesión',
            error: error.message,
        });
    }
};