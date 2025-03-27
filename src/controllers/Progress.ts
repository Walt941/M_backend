import { Request, Response } from 'express';
import TypingSession from '../database/models/TypingSession';
import WordLetter from '../database/models/WordLetter';
import { logger } from '../database/config/winston.config'; 

interface TypingSessionWithLetters extends TypingSession {
  wordLetters: WordLetter[];
}

export const getUserTypingProgress = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const startLogMessage = 'Obteniendo progreso de escritura del usuario';
    logger.info(startLogMessage, { userId, limit });

    try {
        const sessions = await TypingSession.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'ASC']],
            limit,
            include: [{
                model: WordLetter,
                as: 'wordLetters',
                attributes: ['id', 'is_error']
            }]
        }) as unknown as TypingSessionWithLetters[];

        if (!sessions.length) {
            const notFoundMessage = 'No se encontraron sesiones para el usuario';
            logger.warn(notFoundMessage, { userId });
            return res.status(404).json({ message: notFoundMessage });
        }

        const sessionsFoundMessage = `Encontradas ${sessions.length} sesiones para el usuario`;
        logger.debug(sessionsFoundMessage, { 
            userId,
            firstSessionId: sessions[0]?.id,
            lastSessionId: sessions[sessions.length-1]?.id
        });

     
        let cumulativeData = [];
        let totalCorrect = 0;
        let totalErrors = 0;
        let totalLetters = 0;

        for (const session of sessions) {
            const sessionLetters = session.wordLetters || [];
            const sessionErrors = sessionLetters.filter(letter => letter.is_error).length;
            const sessionCorrect = sessionLetters.length - sessionErrors;

            totalCorrect += sessionCorrect;
            totalErrors += sessionErrors;
            totalLetters += sessionLetters.length;

            const precision = totalLetters > 0 
                ? Math.round((totalCorrect / totalLetters) * 100) 
                : 0;

            cumulativeData.push({
                fecha: session.createdAt.toLocaleDateString('es-ES'),
                precision,
                errores: totalErrors,
                sessionId: session.id,
                detalles: {
                    letrasEnSesion: sessionLetters.length,
                    erroresEnSesion: sessionErrors
                }
            });
        }

       
        const stats = {
            precisionPromedio: cumulativeData.length > 0
                ? Math.round(cumulativeData.reduce((sum, item) => sum + item.precision, 0) / cumulativeData.length)
                : 0,
            erroresTotales: totalErrors,
            mejorPrecision: Math.max(...cumulativeData.map(item => item.precision)),
            totalSesiones: sessions.length,
            totalLetras: totalLetters
        };

        const successMessage = 'Progreso del usuario calculado exitosamente';
        logger.info(successMessage, {
            userId,
            totalSesiones: stats.totalSesiones,
            precisionPromedio: stats.precisionPromedio,
            totalLetras: stats.totalLetras,
            erroresTotales: stats.erroresTotales
        });

        return res.json({ 
            message: successMessage,
            stats, 
            sessions: cumulativeData 
        });

    } catch (error) {
        const errorMessage = 'Error al obtener progreso del usuario';
        logger.error(errorMessage, {
            error: error instanceof Error ? error.message : 'Error desconocido',
            stack: error instanceof Error ? error.stack : undefined,
            userId
        });
        
        const responseMessage = 'Error interno del servidor';
        return res.status(500).json({ 
            message: responseMessage,
            error: error instanceof Error ? error.message : undefined
        });
    }
};