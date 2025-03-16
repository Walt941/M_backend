import { QueryInterface, DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface, Sequelize:typeof DataTypes) {
        await queryInterface.createTable('WordLetters', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
              },
        word_id: {
            type: Sequelize.UUID,
                references: {
                    model: 'Words', 
                    key: 'id', 
                },
            allowNull: false
        },
        letter_id: {
            type: Sequelize.UUID,
                references: {
                    model: 'Letters', 
                    key: 'id', 
                },
            allowNull: false
        },
        error_count: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        position: {
            type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('WordLetters');
    }
};