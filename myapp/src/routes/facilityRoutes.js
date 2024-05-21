const { Router } = require("express");
const facilityController = require("../controllers/facilityController");
const { body, param } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");
const { s3Uploader } = require("../helper/s3Engine");

const router = Router();

router.get(
  "/", // GET : get all facilities
  facilityController.getAllFacilities
);

router.get(
  "/:id", // GET : get facility by ID
  [
    param("id").isNumeric().withMessage("Valid ID is required"),
    validatorChecker,
  ],
  facilityController.getFacilityById
);

// to be commented later
router.post(
  "/", // POST: create a new facility
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("businessId").notEmpty().withMessage("Business ID is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("url").notEmpty().isURL().withMessage("Valid URL is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("profileImgUri")
      .exists()
      .isString()
      .withMessage("Profile image URI is required"),
    body("address.postNumber")
      .notEmpty()
      .withMessage("Post number is required"),
    body("address.country").notEmpty().withMessage("Country is required"),
    body("address.city").notEmpty().withMessage("City is required"),
    body("address.roadAddress")
      .notEmpty()
      .withMessage("Road address is required"),
    body("address.jibunAddress")
      .notEmpty()
      .withMessage("Jibun address is required"),
    body("address.englishAddress")
      .notEmpty()
      .withMessage("English address is required"),
    body("address.lat")
      .notEmpty()
      .isFloat()
      .withMessage("Latitude is required"),
    body("address.lng")
      .notEmpty()
      .isFloat()
      .withMessage("Longitude is required"),
    validatorChecker,
  ],
  facilityController.createFacility
);

router.put(
  "/:id", // PUT : update a facility
  [
    param("id").isNumeric().withMessage("Valid ID is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("businessId").notEmpty().withMessage("Business ID is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("url").notEmpty().isURL().withMessage("Valid URL is required"),
    validatorChecker,
  ],
  facilityController.updateFacility
);

router.delete(
  "/:id", // DELETE : delete a facility
  [
    param("id").isNumeric().withMessage("Valid ID is required"),
    validatorChecker,
  ],
  facilityController.deleteFacility
);
router.get(
  "/:facilityId/address", // GET : get address by facility ID
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getAddressByFacilityId
);

router.post(
  "/:facilityId/address", // POST : add or update address for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("postNumber").notEmpty().withMessage("Post number is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("roadAddress").notEmpty().withMessage("Road address is required"),
    body("jibunAddress").notEmpty().withMessage("Jibun address is required"),
    body("englishAddress")
      .notEmpty()
      .withMessage("English address is required"),
    body("lat").notEmpty().isFloat().withMessage("Latitude is required"),
    body("lng").notEmpty().isFloat().withMessage("Longitude is required"),
    validatorChecker,
  ],
  facilityController.addAddress
);

router.delete(
  "/:facilityId/address", // DELETE : delete address for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.deleteAddressByFacilityId
);

router.get(
  "/:facilityId/opening-hours", // GET : get opening hours for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getOpeningHoursByFacilityId
);
router.post(
  "/:facilityId/opening-hours", // POST : add opening hours for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("day")
      .optional() // Optional here because we can accept array or single object
      .trim()
      .isInt({ min: 0, max: 6 })
      .withMessage("Valid day is required"),
    body("openTime")
      .optional()
      .notEmpty()
      .withMessage("Opening time is required"),
    body("closeTime")
      .optional()
      .notEmpty()
      .withMessage("Closing time is required"),
    validatorChecker,
  ],
  facilityController.addOpeningHours
);
router.delete(
  "/:facilityId/opening-hours", // DELETE : delete opening hours for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.deleteOpeningHours
);

router.get(
  "/:facilityId/menu", // GET : get menu for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getMenuByFacilityId
);
router.get(
  "/:facilityId/menu/:menuId",
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("menuId").isNumeric().withMessage("Valid Menu ID is required"),
    validatorChecker,
  ],
  facilityController.getMenuItemById
);
router.post(
  "/:facilityId/menu", // POST : create menu for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body().isArray().withMessage("Menu data should be an array"),
    body("*.name").notEmpty().withMessage("Menu item name is required"),
    body("*.description").notEmpty().withMessage("Description is required"),
    body("*.price").isNumeric().withMessage("Price must be a number"),
    body("*.quantity").notEmpty().withMessage("Quantity is required"),
    validatorChecker,
  ],
  facilityController.createMenu
);

router.put(
  "/:facilityId/menu/:menuId", // PUT: update menu item with menuId
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("menuId").isNumeric().withMessage("Valid Menu ID is required"),
    body("name").notEmpty().withMessage("Menu item name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isNumeric().withMessage("Price must be a number"),
    body("quantity").notEmpty().withMessage("Quantity is required"),
    validatorChecker,
  ],
  facilityController.updateMenuItem
);
router.delete(
  "/:facilityId/menu/:menuId", // DELETE: delete menu item of specified menuId
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("menuId").isNumeric().withMessage("Valid Menu ID is required"),
    validatorChecker,
  ],
  facilityController.deleteMenu
);

router.get(
  "/:facilityId/post", // GET : get all posts by facility ID
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getPostsByFacilityId
);

router.get(
  "/:facilityId/post/:postId", // GET : get a specific post by facility ID and post ID
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("postId").isNumeric().withMessage("Valid Post ID is required"),
    validatorChecker,
  ],
  facilityController.getPostById
);

router.post(
  "/:facilityId/post", // POST : create a new post for a facility
  s3Uploader.single("image"),
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("authorId")
      .isInt({ min: 1 })
      .withMessage("Author ID must be a positive integer"),
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    validatorChecker,
  ],
  facilityController.createPost
);

router.put(
  "/:facilityId/post/:postId", // PUT : update a post for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("postId").isNumeric().withMessage("Valid Post ID is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    validatorChecker,
  ],
  facilityController.updatePost
);

router.delete(
  "/:facilityId/post/:postId", // DELETE : delete a post for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("postId").isNumeric().withMessage("Valid Post ID is required"),
    validatorChecker,
  ],
  facilityController.deletePost
);

router.get(
  "/:facilityId/stamp-ruleset", // GET: get a stamp-ruleset
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getStampRulesetRewardsByFacilityId
);

router.post(
  "/:facilityId/stamp-ruleset", // POST: create stamp-ruleset
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("logoImgUri")
      .exists()
      .isString()
      .withMessage("Logo Image URI is required"),
    body("totalCnt").isNumeric().withMessage("Total count is required"),
    body("rewards").isArray().withMessage("Rewards must be an array"),
    body("rewards.*.cnt")
      .isNumeric()
      .withMessage("Count is required for each reward"),
    body("rewards.*.name")
      .notEmpty()
      .withMessage("Name is required for each reward"),
    validatorChecker,
  ],
  facilityController.createStampRuleset
);

router.put(
  "/:facilityId/stamp-ruleset", // PUT: update existing stamp-ruleset
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("totalCnt").isNumeric().withMessage("Total count is required"),
    validatorChecker,
  ],
  facilityController.updateStampRuleset
);

// For stamp_reward

router.post(
  "/:facilityId/stamp-rewards", // POST: add stamp-reward
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("cnt").isNumeric().withMessage("Count is required"),
    body("name").notEmpty().withMessage("Name is required"),
    validatorChecker,
  ],
  facilityController.createStampReward
);

router.put(
  "/:facilityId/stamp-rewards/:rewardId", // PUT: update existing stamp-reward
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("rewardId").isNumeric().withMessage("Valid Reward ID is required"),
    body("cnt").isNumeric().withMessage("Count is required"),
    body("name").notEmpty().withMessage("Name is required"),
    validatorChecker,
  ],
  facilityController.updateStampReward
);

router.delete(
  "/:facilityId/stamp-rewards/:rewardId", // DELETE : delete stamp-reward with specified rewardId
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("rewardId").isNumeric().withMessage("Valid Reward ID is required"),
    validatorChecker,
  ],
  facilityController.deleteStampReward
);

router.get(
  "/:facilityId/preferences", // GET : get all preferences by facility ID
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    validatorChecker,
  ],
  facilityController.getPreferencesByFacilityId
);

router.post(
  "/:facilityId/preferences", // POST : add a preference to a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("preferenceId")
      .isNumeric()
      .withMessage("Valid Preference ID is required"),
    validatorChecker,
  ],
  facilityController.addPreferenceToFacility
);

router.delete(
  "/:facilityId/preferences/:preferenceId", // DELETE : remove a preference from a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    param("preferenceId")
      .isNumeric()
      .withMessage("Valid Preference ID is required"),
    validatorChecker,
  ],
  facilityController.deletePreferenceFromFacility
);

/** image upload methods */
router
  .post(
    // POST : upload facility profile image
    "/:id/profile/image",
    s3Uploader.single("image"),
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.uploadFacilityProfileImage
  )
  .delete(
    // DELETE : delete facility profile image
    "/:id/profile/image",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.deleteFacilityProfileImage
  )
  .post(
    // POST : upload stamp logo image
    "/:id/stamp-ruleset/logo",
    s3Uploader.single("image"),
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.uploadStampLogoImage
  )
  .delete(
    // DELETE : delete stamp logo image
    "/:id/stamp-ruleset/logo",
    [
      param("id", `route param 'id' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.deleteStampLogoImage
  )
  .post(
    // POST : upload menu image
    "/:facilityId/menu/:menuId/image",
    s3Uploader.single("image"),
    [
      param("facilityId", `route param 'facilityId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      param("menuId", `route param 'menuId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.uploadMenuImage
  )
  .delete(
    // DELETE : delete menu image
    "/:facilityId/menu/:menuId/image",
    [
      param("facilityId", `route param 'facilityId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      param("menuId", `route param 'menuId' must be a positive integer`)
        .exists()
        .isInt({ min: 1 }),
      validatorChecker,
    ],
    facilityController.deleteMenuImage
  )
  .post(
    // POST: send facility registration request to admin to create facility
    "/facility-requests",
    [
      body("authorId")
        .exists()
        .isInt({ min: 1 })
        .withMessage("Author ID is required and must be a positive integer"),
      body("title")
        .exists()
        .isString()
        .withMessage("Title is required and must be a string"),
      body("content.name")
        .exists()
        .isString()
        .withMessage("Content name is required and must be a string"),
      body("content.type")
        .exists()
        .isString()
        .withMessage("Content type is required and must be a string"),
      body("content.businessId")
        .exists()
        .isString()
        .withMessage("Business ID is required and must be a string"),
      body("content.profileImgUri")
        .exists()
        .isString()
        .withMessage("Profile Image URI is required and must be a valid URL"),
      body("content.phone")
        .exists()
        .isString()
        .withMessage("Phone is required and must be a string"),
      body("content.email")
        .exists()
        .isEmail()
        .withMessage("Email is required and must be a valid email"),
      body("content.url")
        .exists()
        .isURL()
        .withMessage("URL is required and must be a valid URL"),
      body("content.description")
        .exists()
        .isString()
        .withMessage("Description is required and must be a string"),
      validatorChecker,
    ],
    facilityController.createFacilityRegistrationRequest
  );

module.exports = router;
