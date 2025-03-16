import { Model, DataTypes } from 'sequelize';
import connection from './connection';

interface UserAttributes {
  id?: string;
  username: string;
  email: string;
  password: string;
  email_verified: boolean;
  resetCode: string | null;
  resetCodeExpiry: Date | null;

  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public email_verified!: boolean;
  public resetCode!: string | null;
  public resetCodeExpiry!: Date | null;

  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  static associate(models: Record<string, any>) {
    this.hasMany(models.TypingSession, {
      foreignKey: 'user_id',
      as: 'typingSessions',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    resetCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetCodeExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'User',
  }
);

export default User;
