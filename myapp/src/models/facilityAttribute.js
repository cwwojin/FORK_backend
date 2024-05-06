const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facilityAttribute', {
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'facility',
        key: 'id'
      }
    },
    attribute_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'attribute',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'facility_attribute',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
