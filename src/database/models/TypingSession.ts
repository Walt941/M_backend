import { Model, DataTypes } from 'sequelize';
import connection from './connection';

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

  static associate(models: Record<string, any>) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.hasMany(models.SessionWord, {
      foreignKey: 'session_id',
      as: 'sessionWords',
    });
  }
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
    sequelize: connection,
    modelName: 'TypingSession',
  }
);

export default TypingSession;
