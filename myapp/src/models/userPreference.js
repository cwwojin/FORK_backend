const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userPreference', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    preference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'preference',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_preference',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
};
