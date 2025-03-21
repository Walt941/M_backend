import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import TypingSession from './TypingSession';
import Word from './Word';

interface SessionWordAttributes {
  id?: string;
  session_id: string;
  word_id: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  typingSession?: TypingSession;
  word?: Word;
}

class SessionWord extends Model<SessionWordAttributes> implements SessionWordAttributes {
  public id!: string;
  public session_id!: string;
  public word_id!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  declare typingSession?: TypingSession;
  declare word?: Word;
}

SessionWord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    word_id: {
      type: DataTypes.UUID,
      references: {
        model: 'Word',
        key: 'id',
      },
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
    modelName: 'SessionWord',
  }
);



export default SessionWord;