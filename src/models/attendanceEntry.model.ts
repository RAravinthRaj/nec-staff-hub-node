/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Staff } from './staff.model';
import { Period } from './period.model';

interface AttendanceEntryAttributes {
  id: number;
  staff_id: number;
  period_id: number;
  date: number;
  is_marked: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface AttendanceEntryCreationAttributes
  extends Optional<AttendanceEntryAttributes, 'id' | 'is_marked' | 'created_at' | 'updated_at'> {}

export class AttendanceEntry
  extends Model<AttendanceEntryAttributes, AttendanceEntryCreationAttributes>
  implements AttendanceEntryAttributes
{
  public id!: number;
  public staff_id!: number;
  public period_id!: number;
  public date!: number;
  public is_marked!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AttendanceEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    period_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    date: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    is_marked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    sequelize,
    tableName: 'attendance_entry',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['staff_id', 'period_id', 'date'],
      },
    ],
  },
);
