import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import WordLetter from './WordLetter';

interface LetterAttributes {
  id?: string;
  letter: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  wordLetters?: WordLetter[];
}

class Letter extends Model<LetterAttributes> implements LetterAttributes {
  public id!: string;
  public letter!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  declare wordLetters?: WordLetter[];
}

Letter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    letter: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    sequelize,
    modelName: 'Letter',
  }
);


Letter.hasMany(WordLetter, {
  foreignKey: 'letter_id',
  as: 'wordLetters',
});

WordLetter.belongsTo(Letter, {
  foreignKey: 'letter_id',
  as: 'letter',
});

export default Letter;