const { Router } = require("express");
const facilityController = require("../controllers/facilityController");
const { body, param } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");

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
  "/", // POST : create a new facility
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("businessId").notEmpty().withMessage("Business ID is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("url").notEmpty().trim().isURL().withMessage("Valid URL is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("email").notEmpty().withMessage("Email is required"),
    body("profileImgUri")
      .notEmpty()
      .withMessage("Profile Image URI is required"),
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
      .trim()
      .isInt({ min: 0, max: 6 })
      .withMessage("Valid day is required"),
    body("openTime").notEmpty().withMessage("Opening time is required"),
    body("closeTime").notEmpty().withMessage("Closing time is required"),
    validatorChecker,
  ],
  facilityController.addOpeningHours
);

router.put(
  "/:facilityId/opening-hours", // PUT : update opening hours for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body().isArray().withMessage("Opening hours data should be an array"),
    body("*.day")
      .isInt({ min: 0, max: 6 })
      .withMessage("Valid day is required"),
    body("*.openTime").notEmpty().withMessage("Opening time is required"),
    body("*.closeTime").notEmpty().withMessage("Closing time is required"),
    validatorChecker,
  ],
  facilityController.updateOpeningHours
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
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("authorId")
      .isInt({ min: 1 })
      .withMessage("Author ID must be a positive integer"),
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("imgUri")
      .optional()
      .isURL()
      .withMessage("Image URI must be a valid URL"),
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
  "/:facilityId/stamp-ruleset", // POST: add stamp-ruleset
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body("totalCnt").isNumeric().withMessage("Total count is required"),
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

module.exports = router;
