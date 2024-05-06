const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('facilityRegistrationRequest', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0,
      comment: "0:pending, 1:approved, 2:rejected"
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "facility name"
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "all records to be inserted. This should be able to be viewed by admin."
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    respond_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "time checked by admin"
    }
  }, {
    sequelize,
    tableName: 'facility_registration_request',
    schema: 'public',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: "facility_registration_request_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
