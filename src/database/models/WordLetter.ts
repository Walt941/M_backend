import { Model, DataTypes } from 'sequelize';
import connection from './connection';

interface WordLetterAttributes {
  id?: string;
  word_id: string;
  letter_id: string;
  error_count: number;
  position: number;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class WordLetter extends Model<WordLetterAttributes> implements WordLetterAttributes {
  public id!: string;
  public word_id!: string;
  public letter_id!: string;
  public error_count!: number;
  public position!: number;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  static associate(models: Record<string, any>) {
    this.belongsTo(models.Word, {
      foreignKey: 'word_id',
      as: 'word',
    });
    this.belongsTo(models.Letter, {
      foreignKey: 'letter_id',
      as: 'letter',
    });
  }
}

WordLetter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    word_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Word',
        key: 'id',
      },
      allowNull: false,
    },
    letter_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Letter',
        key: 'id',
      },
      allowNull: false,
    },
    error_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: connection,
    modelName: 'WordLetter',
  }
);

export default WordLetter;
