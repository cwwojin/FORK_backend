const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('address', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    post_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "",
      comment: "post number"
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    road_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "Korean, road address"
    },
    jibun_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "Korean, jibun\/legacy address"
    },
    english_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
      comment: "English, road address"
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "Latitude"
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      comment: "Longitude"
    }
  }, {
    sequelize,
    tableName: 'address',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "address_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
