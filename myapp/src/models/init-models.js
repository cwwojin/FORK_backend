var DataTypes = require("sequelize").DataTypes;
var _address = require("./address");
var _attribute = require("./attribute");
var _facility = require("./facility");
var _facilityAttribute = require("./facilityAttribute");
var _facilityRegistrationRequest = require("./facilityRegistrationRequest");
var _favorite = require("./favorite");
var _manages = require("./manages");
var _menu = require("./menu");
var _openingHours = require("./openingHours");
var _preference = require("./preference");
var _user = require("./user");
var _userPreference = require("./userPreference");

function initModels(sequelize) {
  var address = _address(sequelize, DataTypes);
  var attribute = _attribute(sequelize, DataTypes);
  var facility = _facility(sequelize, DataTypes);
  var facilityAttribute = _facilityAttribute(sequelize, DataTypes);
  var facilityRegistrationRequest = _facilityRegistrationRequest(sequelize, DataTypes);
  var favorite = _favorite(sequelize, DataTypes);
  var manages = _manages(sequelize, DataTypes);
  var menu = _menu(sequelize, DataTypes);
  var openingHours = _openingHours(sequelize, DataTypes);
  var preference = _preference(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var userPreference = _userPreference(sequelize, DataTypes);

  facility.belongsTo(address, { as: "address_address", foreignKey: "address"});
  address.hasMany(facility, { as: "facilities", foreignKey: "address"});
  facilityAttribute.belongsTo(attribute, { as: "attribute", foreignKey: "attribute_id"});
  attribute.hasMany(facilityAttribute, { as: "facility_attributes", foreignKey: "attribute_id"});
  facilityAttribute.belongsTo(facility, { as: "facility", foreignKey: "facility_id"});
  facility.hasMany(facilityAttribute, { as: "facility_attributes", foreignKey: "facility_id"});
  favorite.belongsTo(facility, { as: "facility", foreignKey: "facility_id"});
  facility.hasMany(favorite, { as: "favorites", foreignKey: "facility_id"});
  manages.belongsTo(facility, { as: "facility", foreignKey: "facility_id"});
  facility.hasMany(manages, { as: "manages", foreignKey: "facility_id"});
  menu.belongsTo(facility, { as: "facility", foreignKey: "facility_id"});
  facility.hasMany(menu, { as: "menus", foreignKey: "facility_id"});
  openingHours.belongsTo(facility, { as: "facility", foreignKey: "facility_id"});
  facility.hasMany(openingHours, { as: "opening_hours", foreignKey: "facility_id"});
  userPreference.belongsTo(preference, { as: "preference", foreignKey: "preference_id"});
  preference.hasMany(userPreference, { as: "user_preferences", foreignKey: "preference_id"});
  facilityRegistrationRequest.belongsTo(user, { as: "author", foreignKey: "author_id"});
  user.hasMany(facilityRegistrationRequest, { as: "facility_registration_requests", foreignKey: "author_id"});
  favorite.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(favorite, { as: "favorites", foreignKey: "user_id"});
  manages.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(manages, { as: "manages", foreignKey: "user_id"});
  userPreference.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(userPreference, { as: "user_preferences", foreignKey: "user_id"});

  return {
    address,
    attribute,
    facility,
    facilityAttribute,
    facilityRegistrationRequest,
    favorite,
    manages,
    menu,
    openingHours,
    preference,
    user,
    userPreference,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
