import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
        await queryInterface.createTable('SessionWords', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
              },
        session_id: {
            type: Sequelize.UUID,
                references: {
                    model: 'TypingSessions', 
                    key: 'id', 
                },
            allowNull: false
        },
        word_id: {
            type: Sequelize.UUID,
                references: {
                    model: 'Words', 
                    key: 'id', 
                },
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
        });
    },
    async down(queryInterface:QueryInterface, Sequelize:any) {
        await queryInterface.dropTable('SessionWords');
    }
};