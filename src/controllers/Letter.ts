import { Request, Response } from 'express';
import Letter from '../database/models/Letter';
import WordLetter from '../database/models/WordLetter';
import { sequelize } from '../database/models/index'; 

export const saveLettersBatch = async (req: Request, res: Response) => {
  const { wordId, letters } = req.body;

  console.log('Datos recibidos:', { wordId, letters }); 


  if (!wordId || !letters || !Array.isArray(letters)) {
    console.error('Datos inválidos: wordId y letters son requeridos'); 
    return res.status(400).json({
      message: 'Datos inválidos: wordId y letters son requeridos',
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

      console.log('Letra encontrada en la base de datos:', existingLetter); 

      
      if (!existingLetter) {
        existingLetter = await Letter.create({ letter }, { transaction });
        console.log('Nueva letra creada:', existingLetter); 
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
        console.log('Relación WordLetter ya existe:', existingWordLetter); 
        continue; 
      }

      
      const newWordLetter = await WordLetter.create(
        {
          word_id: wordId,
          letter_id: existingLetter.id, 
          is_error: isError,
          time: timeTaken,
          position: position,
        },
        { transaction }
      );

      console.log('Relación WordLetter creada:', newWordLetter); 
    }

    await transaction.commit(); 
    console.log('Transacción completada con éxito'); 

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