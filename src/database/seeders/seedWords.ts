import { QueryInterface } from 'sequelize';
import { fakerES as faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

export default {
  up: async (queryInterface: QueryInterface) => {
    try {
      
      const words = Array.from({ length: 200 }, () => ({
        id: uuidv4(), 
        word: faker.word.sample({ length: { min: 3, max: 8 } }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      
      await queryInterface.bulkInsert('Words', words);

      console.log('200 palabras insertadas exitosamente.');
    } catch (error) {
      console.error('Error al insertar palabras:', error);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    try {
     
      await queryInterface.bulkDelete('Words', {});
      console.log('Todas las palabras han sido eliminadas.');
    } catch (error) {
      console.error('Error al eliminar palabras:', error);
    }
  },
};
