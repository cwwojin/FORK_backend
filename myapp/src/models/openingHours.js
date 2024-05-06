const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('openingHours', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facility',
        key: 'id'
      }
    },
    day: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "0:sun ~ 6:sat"
    },
    open_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    close_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'opening_hours',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "opening_hours_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
