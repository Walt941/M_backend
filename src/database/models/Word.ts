import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import WordLetter from './WordLetter';
import SessionWord from './SessionWord';

interface WordAttributes {
  id?: string;
  word: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  sessionWords?: SessionWord[];
  wordLetters?: WordLetter[];
}

class Word extends Model<WordAttributes> implements WordAttributes {
  public id!: string;
  public word!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  declare sessionWords?: SessionWord[];
  declare wordLetters?: WordLetter[];
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
    sequelize,
    modelName: 'Word',
  }
);


Word.hasMany(WordLetter, {
  foreignKey: 'word_id',
  as: 'wordLetters',
});

WordLetter.belongsTo(Word, {
  foreignKey: 'word_id',
  as: 'word',
});

Word.hasMany(SessionWord, {
  foreignKey: 'word_id',
  as: 'sessionWords',
});

SessionWord.belongsTo(Word, {
  foreignKey: 'word_id',
  as: 'word',
});

export default Word;