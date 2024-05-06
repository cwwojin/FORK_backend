const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facility', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      comment: "One-word general category of facility"
    },
    business_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Business registration number"
    },
    address: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'address',
        key: 'id'
      }
    },
    profile_img_uri: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "website or SNS"
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "Short intro text for facility"
    }
  }, {
    sequelize,
    tableName: 'facility',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "facility_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
