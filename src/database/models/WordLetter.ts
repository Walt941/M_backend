import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import Word from './Word';
import Letter from './Letter';
import TypingSession from './TypingSession'; 

interface WordLetterAttributes {
  id?: string;
  word_id: string;
  letter_id: string;
  session_id: string; 
  is_error: boolean; 
  time: number; 
  position: number;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  word?: Word;
  letter?: Letter;
  typingSession?: TypingSession; 
}

class WordLetter extends Model<WordLetterAttributes> implements WordLetterAttributes {
  public id!: string;
  public word_id!: string;
  public letter_id!: string;
  public session_id!: string; 
  public is_error!: boolean; 
  public time!: number;
  public position!: number;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  declare word?: Word;
  declare letter?: Letter;
  declare typingSession?: TypingSession; 
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
    session_id: {
      type: DataTypes.UUID, 
      references: {
        model: 'TypingSession', 
        key: 'id',
      },
      allowNull: false,
    },
    is_error: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, 
    },
    time: {
      type: DataTypes.INTEGER, 
      allowNull: false,
      defaultValue: 0, 
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
    sequelize,
    modelName: 'WordLetter',
  }
);


WordLetter.belongsTo(TypingSession, {
  foreignKey: 'session_id',
  as: 'typingSession',
});

TypingSession.hasMany(WordLetter, {
  foreignKey: 'session_id',
  as: 'wordLetters',
});

export default WordLetter;