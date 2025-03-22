import { Request, Response } from 'express';
import Letter from '../database/models/Letter';
import WordLetter from '../database/models/WordLetter';
import { sequelize } from '../database/models/index'; 

export const saveLetter = async (req: Request, res: Response) => {
    const { letter, wordId, isError, time, position } = req.body;
  
    const transaction = await sequelize.transaction(); 
  
    try {
      
      let existingLetter = await Letter.findOne({
        where: { letter },
        transaction,
      });
  
      
      if (!existingLetter) {
        existingLetter = await Letter.create({ letter }, { transaction });
      }
  
      
      await WordLetter.create(
        {
          word_id: wordId,
          letter_id: existingLetter.id, 
          is_error: isError,
          time: time,
          position: position,
        },
        { transaction }
      );
  
      await transaction.commit(); 
  
      return res.status(201).json({ message: 'Letra guardada exitosamente' });
    } catch (error: any) {
      await transaction.rollback(); 
      console.error('Error al guardar la letra:', error);
  
      return res.status(500).json({
        message: 'Error al guardar la letra',
        error: error.message,
      });
    }
  };