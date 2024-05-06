const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "user ID, limit is 20",
      unique: "user_account_id_key"
    },
    user_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      comment: "0:admin, 1:KAIST, 2:facility"
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    display_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "user nickname"
    },
    profile_img_uri: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    register_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_DATE')
    }
  }, {
    sequelize,
    tableName: 'user',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "user_account_id_key",
        unique: true,
        fields: [
          { name: "account_id" },
        ]
      },
      {
        name: "user_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
