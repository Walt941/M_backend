import { Request, Response } from 'express';
import { fakerES as faker } from '@faker-js/faker';
import TypingSession from '../database/models/TypingSession';
import Word from '../database/models/Word';
import SessionWord from '../database/models/SessionWord';

export const createSession = async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
       
        const newSession = await TypingSession.create({
            user_id: userId,
        });

        const generatedWords = Array.from({ length: 20 }, () => ({
            word: faker.word.sample({ length: { min: 3, max: 8 } }),
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            created_at: new Date(),
        }));

        const savedWords = await Word.bulkCreate(generatedWords);

        const sessionWords = savedWords.map((word) => ({
            session_id: newSession.id,
            word_id: word.id,
            created_at: new Date(),
        }));
        await SessionWord.bulkCreate(sessionWords);

        return res.status(201).json({
            message: 'Sesión y palabras generadas exitosamente',
            sessionId: newSession.id,
            words: savedWords.map((word) => word.word),
        });
    } catch (error: any) {
        console.error(error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.errors });
        }

        return res.status(500).json({
            message: 'Error al crear la sesión',
            error: error.message,
        });
    }
};

export const getSessionWords = async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
       
        const sessionWords = await SessionWord.findAll({
            where: { session_id: sessionId },
            include: [{ 
                model: Word, 
                attributes: ['word'], 
                as: 'word' 
            }],
        });

        if (!sessionWords || sessionWords.length === 0) {
            return res.status(404).json({ message: 'No se encontraron palabras para esta sesión' });
        }

        const words = sessionWords.map((sw) => sw.word?.word); 

        return res.status(200).json({
            words,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: 'Error al obtener las palabras',
            error: error.message,
        });
    }
};
