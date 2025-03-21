import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './User';
import SessionWord from './SessionWord';

interface TypingSessionAttributes {
  id?: string;
  user_id: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class TypingSession extends Model<TypingSessionAttributes> implements TypingSessionAttributes {
  public id!: string;
  public user_id!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  public user?: User;
  public sessionWords?: SessionWord[];
}

TypingSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
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
    modelName: 'TypingSession',
  }
);



SessionWord.belongsTo(TypingSession, {
  foreignKey: 'session_id',
  as: 'typingSession',
});

export default TypingSession;