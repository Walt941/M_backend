import { Request, Response } from 'express';
import Letter from '../database/models/Letter';
import WordLetter from '../database/models/WordLetter';
import { sequelize } from '../database/models/index';
import { logger } from '../database/config/winston.config';

export const saveLettersBatch = async (req: Request, res: Response) => {
  const { wordId, letters, sessionId } = req.body;

  logger.info('Datos recibidos:', { wordId, letters, sessionId });

  if (!wordId || !letters || !Array.isArray(letters) || !sessionId) {
    const errorMessage = 'Datos inválidos: wordId, letters y sessionId son requeridos';
    logger.error(errorMessage);
    return res.status(400).json({
      message: errorMessage,
    });
  }

  const transaction = await sequelize.transaction();

  try {
    for (const letterData of letters) {
      const { letter, isError, position, timeTaken } = letterData;

      if (
        typeof letter !== 'string' ||
        typeof isError !== 'boolean' ||
        typeof position !== 'number' ||
        typeof timeTaken !== 'number'
      ) {
        const errorMessage = 'Datos inválidos: cada letra debe tener letter (string), isError (boolean), position (number) y timeTaken (number)';
        logger.error(errorMessage, { letterData });
        await transaction.rollback();
        return res.status(400).json({
          message: errorMessage,
        });
      }

      let existingLetter = await Letter.findOne({
        where: { letter },
        transaction,
      });

      if (!existingLetter) {
        existingLetter = await Letter.create({ letter }, { transaction });
      }

      const existingWordLetter = await WordLetter.findOne({
        where: {
          word_id: wordId,
          letter_id: existingLetter.id,
          position: position,
        },
        transaction,
      });

      if (existingWordLetter) {
        continue;
      }

      await WordLetter.create(
        {
          word_id: wordId,
          letter_id: existingLetter.id,
          session_id: sessionId,
          is_error: isError,
          time: timeTaken,
          position: position,
        },
        { transaction }
      );
    }

    await transaction.commit();
    const successMessage = 'Letras guardadas exitosamente';
    logger.info(successMessage);
    return res.status(201).json({ message: successMessage });
  } catch (error: any) {
    await transaction.rollback();
    const errorMessage = 'Error al guardar las letras';
    logger.error(`${errorMessage}: ${error.message}`, { error });
    return res.status(500).json({
      message: errorMessage,
      error: error.message,
    });
  }
};