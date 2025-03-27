import { QueryInterface } from 'sequelize';
import { fakerES as faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import {logger} from '../config/winston.config'; // Asegúrate de que la ruta sea correcta

export default {
  up: async (queryInterface: QueryInterface) => {
    try {
      logger.info('Iniciando seeder de palabras - Creando 200 palabras');
      
      const words = Array.from({ length: 200 }, () => ({
        id: uuidv4(), 
        word: faker.word.sample({ length: { min: 3, max: 8 } }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      logger.debug('Palabras generadas', {
        sampleWords: words.slice(0, 5).map(w => w.word) // Mostramos solo 5 como ejemplo
      });
      
      await queryInterface.bulkInsert('Words', words);

      logger.info('Seeder completado - 200 palabras insertadas exitosamente');
    } catch (error) {
      logger.error('Error en seeder de palabras', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error; // Es importante lanzar el error para que Sequelize lo maneje
    }
  },

  down: async (queryInterface: QueryInterface) => {
    try {
      logger.info('Iniciando rollback de seeder de palabras - Eliminando todas las palabras');
     
      await queryInterface.bulkDelete('Words', {});

      logger.info('Rollback completado - Todas las palabras han sido eliminadas');
    } catch (error) {
      logger.error('Error en rollback de seeder de palabras', {
        error: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },
};