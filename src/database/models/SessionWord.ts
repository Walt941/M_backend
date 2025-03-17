import { Model, DataTypes } from 'sequelize';
import connection from './connection';
import Word from './Word';  

interface SessionWordAttributes {
  id?: string;
  session_id: string;
  word_id: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
  word?: Word;  
}

class SessionWord extends Model<SessionWordAttributes> implements SessionWordAttributes {
  public id!: string;
  public session_id!: string;
  public word_id!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  
  declare word?: Word;

  static associate(models: Record<string, any>) {
    this.belongsTo(models.TypingSession, {
      foreignKey: 'session_id',
      as: 'typingSession',
    });
    this.belongsTo(models.Word, {
      foreignKey: 'word_id',
      as: 'word',  
    });
  }
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
    sequelize: connection,
    modelName: 'SessionWord',
  }
);

export default SessionWord;
