import { Model, DataTypes } from 'sequelize';
import connection from './connection';

interface WordAttributes {
  id?: string;
  word: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Word extends Model<WordAttributes> implements WordAttributes {
  public id!: string;
  public word!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  static associate(models: Record<string, any>) {
    this.hasMany(models.SessionWord, {
      foreignKey: 'word_id',
      as: 'sessionWords',
    });
    this.hasMany(models.WordLetter, {
      foreignKey: 'word_id',
      as: 'wordLetters',
    });
  }
}

Word.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    word: {
      type: DataTypes.STRING,
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
    modelName: 'Word',
  }
);

export default Word;
