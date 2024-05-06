const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    img_uri: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Short description about the dish"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    quantity: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "food quantity in (g) or (ml)"
    }
  }, {
    sequelize,
    tableName: 'menu',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "menu_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
