const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");
const {
  USER_TYPES,
  validateUserId,
  validatePassword,
  validateOptionalURL,
} = require("../helper/helper");
const { s3Uploader } = require("../helper/s3Engine");

/** Router for "/api/users" */
router
  .get(
    // GET : get users by query
    "/",
    [
      query("accountId", `optional query field 'accountId' must be string`)
        .optional()
        .isString(),
      query("type", `optional query field 'type' must be one of ${USER_TYPES}`)
        .optional()
        .isIn(USER_TYPES),
      validatorChecker,
    ],
    userController.getUsers
  )
  .get(
    // GET : get user by account_id
    "/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.getUserById
  )
  .post(
    // POST : create new user
    "/create",
    [
      body("userId", `body field 'userId' violates account id constraints`)
        .exists()
        .isString()
        .isLength({ min: 6, max: 20 })
        .custom(validateUserId),
      body(
        "password",
        `body field 'password' violates account password constraints`
      )
        .exists()
        .isString()
        .isLength({ min: 6, max: 20 })
        .custom(validatePassword),
      body("userType", `body field 'userType' must be one of ${USER_TYPES}`)
        .exists()
        .isIn(USER_TYPES),
      body("email", `body field 'email' must be a valid email`)
        .exists()
        .isEmail(),
      validatorChecker,
    ],
    userController.createUser
  )
  .put(
    // PUT : update user - profile
    "/profile/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body(
        "password",
        `body field 'password' violates account password constraints`
      )
        .exists()
        .isString()
        .isLength({ min: 6, max: 20 })
        .custom(validatePassword),
      body("email", `body field 'email' must be a valid email`)
        .exists()
        .isEmail(),
      validatorChecker,
    ],
    userController.updateUserProfile
  )
  .delete(
    // DELETE : delete a user
    "/delete/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.deleteUser
  )
  .get(
    // GET : get user preferences
    "/preference/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.getUserPreference
  )
  .put(
    // PUT : add a user preference
    "/preference/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body(
        "preferenceId",
        `body field 'preferenceId' must be a positive integer`
      )
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.addUserPreference
  )
  .delete(
    // DELETE : delete a user preference
    "/preference/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body(
        "preferenceId",
        `body field 'preferenceId' must be a positive integer`
      )
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.deleteUserPreference
  )
  .get(
    // GET : get favorites of a user
    "/favorite/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.getUserFavorite
  )
  .put(
    // PUT : add a user favorite, if not already added
    "/favorite/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body("facilityId", `body field 'facilityId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.addUserFavorite
  )
  .delete(
    // DELETE : delete a user favorite
    "/favorite/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body("facilityId", `body field 'facilityId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.deleteUserFavorite
  )
  .post(
    // POST : upload / update a user profile image
    "/profile/image/:id",
    s3Uploader.single("image"),
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.uploadUserProfileImage
  )
  .delete(
    // DELETE : delete a user profile image
    "/profile/image/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.deleteUserProfileImage
  )
  .get(
    "/:id/myfacility", // GET: get facility with id
    [
      param("id")
        .exists()
        .isInt({ min: 1 })
        .withMessage("Valid account ID is required"),
      validatorChecker,
    ],
    userController.getMyFacility
  )
  .post(
    // PUT: update facility with id
    "/:user/myfacility/:facility",
    [
      param("user")
        .exists()
        .isInt({ min: 1 })
        .withMessage("Valid account ID is required"),
      param("facility", `route param 'facility' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      body("name").exists().isString().withMessage("Name is required"),
      body("businessId")
        .exists()
        .isString()
        .withMessage("Business ID is required"),
      body("type").exists().isString().withMessage("Type is required"),
      body("description")
        .exists()
        .isString()
        .withMessage("Description is required"),
      body("url").exists().isString().custom(validateOptionalURL).withMessage("Valid URL is required"),
      body("phone", `body field 'phone' must be string`).exists().isString(),
      body("email", `body field 'email' must be string`).exists().isString(),
      /** optionally update address, opening-hours, menus, preferences */
      body("address", `optional body field 'address' must be an object`).optional().isObject(),
      body("openingHours", `optional body field 'openingHours' must be an array`).optional().isArray(),
      body("menu", `optional body field 'menu' must be an array`).optional().isArray(),
      body("preferences", `optional body field 'preferences' must be an array`).optional().isArray(),
      body("stampRuleset", `optional body field 'stampRuleset' must be an object`).optional().isObject(),
      body("stampRuleset.rewards", `optional body field 'stampRuleset.rewards' must be an array`).optional().isArray(),
      validatorChecker,
    ],
    userController.updateMyFacility
  )
  .delete(
    // DELETE: delete facility with id
    "/:id/myfacility/:facilityId",
    [
      param("id")
        .exists()
        .isInt({ min: 1 })
        .withMessage("Valid account ID is required"),
      param("facilityId")
        .isNumeric()
        .withMessage("Valid facility ID is required"),
      validatorChecker,
    ],
    userController.deleteFacilityRelationship
  );

/** Router for "/api/preferences" */
const preferenceRoutes = new Router();
preferenceRoutes
  .get(
    // GET : get all preferences
    "/",
    userController.getAllPreferences
  )
  .get(
    // GET : get preference by id
    "/:id",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    userController.getPreference
  );

module.exports = {
  userRoutes: router,
  preferenceRoutes: preferenceRoutes,
};
