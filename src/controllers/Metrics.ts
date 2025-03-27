import { Request, Response } from 'express';
import TypingSession from '../database/models/TypingSession'; 
import WordLetter from '../database/models/WordLetter'; 
import Word from '../database/models/Word'; 
import SessionWord from '../database/models/SessionWord'; 
import Letter from '../database/models/Letter';
import { logger } from '../database/config/winston.config'; 

export const calculateSessionStats = async (req: Request, res: Response) => {
  const { sessionId } = req.params;

  try {
    const logMessage = 'Calculando estadísticas de sesión';
    logger.info(logMessage, { sessionId });

    const session = await TypingSession.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      const errorMessage = 'Sesión no encontrada';
      logger.error(errorMessage, { sessionId });
      return res.status(404).json({
        message: errorMessage,
      });
    }

    const sessionWords = await SessionWord.findAll({
      where: { session_id: sessionId },
      include: [
        {
          model: Word,
          as: 'word',
          include: [
            {
              model: WordLetter,
              as: 'wordLetters',
              where: { session_id: sessionId },
              include: [
                {
                  model: Letter,
                  as: 'letter',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!sessionWords || sessionWords.length === 0) {
      const errorMessage = 'No se encontraron palabras en la sesión';
      logger.error(errorMessage, { sessionId });
      return res.status(404).json({
        message: errorMessage,
      });
    }

    const writtenWords = sessionWords.filter((sessionWord) => {
      return sessionWord.word?.wordLetters && sessionWord.word.wordLetters.length > 0;
    });

    const totalExpectedWords = sessionWords.length; 
    const isSessionCompleted = writtenWords.length === totalExpectedWords;

    let correctWords = 0;
    let incorrectWords = 0;
    let correctChars = 0;
    let incorrectChars = 0;
    let totalChars = 0;

    writtenWords.forEach((sessionWord) => {
      const word = sessionWord.word;
      if (word && word.wordLetters) {
        let isWordCorrect = true;

        word.wordLetters.forEach((wordLetter) => {
          totalChars += 1;
          if (!wordLetter.is_error) {
            correctChars += 1;
          } else {
            incorrectChars += 1;
            isWordCorrect = false;
          }
        });

        if (isWordCorrect) {
          correctWords += 1;
        } else {
          incorrectWords += 1;
        }
      }
    });

    const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

    const successMessage = 'Estadísticas calculadas exitosamente';
    logger.info(successMessage, {
      sessionId,
      stats: {
        correctWords,
        incorrectWords,
        accuracy,
        isCompleted: isSessionCompleted,
        correctChars,
        incorrectChars,
        totalChars
      }
    });

    return res.status(200).json({
      correctWords,
      incorrectWords,
      correctChars,
      incorrectChars,
      accuracy,
      isCompleted: isSessionCompleted,
      totalWords: totalExpectedWords,
      writtenWords: writtenWords.length,
    });
  } catch (error: any) {
    const errorMessage = 'Error al calcular estadísticas';
    logger.error(errorMessage, { 
      sessionId,
      errorDetails: {
        message: error.message,
        stack: error.stack
      }
    });
    return res.status(500).json({
      message: errorMessage,
      error: error.message,
    });
  }
};