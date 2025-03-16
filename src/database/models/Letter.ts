import { Model, DataTypes } from 'sequelize';
import connection from './connection';

interface LetterAttributes {
  id?: string;
  letter: string;
  updatedAt?: Date;
  deletedAt?: Date;
  createdAt?: Date;
}

class Letter extends Model<LetterAttributes> implements LetterAttributes {
  public id!: string;
  public letter!: string;
  public readonly updatedAt!: Date;
  public readonly createdAt!: Date;

  static associate(models: Record<string, any>) {
    this.hasMany(models.WordLetter, {
      foreignKey: 'letter_id',
      as: 'wordLetters',
    });
  }
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
    modelName: 'Letter',
  }
);

export default Letter;
