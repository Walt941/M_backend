import { Request, Response } from 'express';
import Letter from '../database/models/Letter';
import WordLetter from '../database/models/WordLetter';
import { sequelize } from '../database/models/index'; 

export const saveLettersBatch = async (req: Request, res: Response) => {
  const { wordId, letters, sessionId } = req.body; 

  console.log('Datos recibidos:', { wordId, letters, sessionId }); 

  if (!wordId || !letters || !Array.isArray(letters) || !sessionId) {
    console.error('Datos inválidos: wordId, letters y sessionId son requeridos'); 
    return res.status(400).json({
      message: 'Datos inválidos: wordId, letters y sessionId son requeridos',
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
        console.error('Datos inválidos en la letra:', letterData); 
        await transaction.rollback();
        return res.status(400).json({
          message: 'Datos inválidos: cada letra debe tener letter (string), isError (boolean), position (number) y timeTaken (number)',
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

      
      const newWordLetter = await WordLetter.create(
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
    return res.status(201).json({ message: 'Letras guardadas exitosamente' });
  } catch (error: any) {
    await transaction.rollback(); 
    console.error('Error al guardar las letras:', error); 

    return res.status(500).json({
      message: 'Error al guardar las letras',
      error: error.message,
    });
  }
};