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
    body("type").optional(),
    body("description").optional(),
    body("url").optional().trim().isURL().withMessage("Valid URL is required"),
    validatorChecker,
  ],
  facilityController.createFacility
);

router.put(
  "/:id", // PUT : update a facility
  [
    param("id").isNumeric().withMessage("Valid ID is required"),
    body("name").optional(),
    body("businessId").optional(),
    body("type").optional(),
    body("description").optional(),
    body("url").optional().isURL(),
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
    body("open_time").notEmpty().withMessage("Opening time is required"),
    body("close_time").notEmpty().withMessage("Closing time is required"),
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
    body("*.open_time").notEmpty().withMessage("Opening time is required"),
    body("*.close_time").notEmpty().withMessage("Closing time is required"),
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

router.post(
  "/:facilityId/menu", // POST : create menu for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body().isArray().withMessage("Menu data should be an array"),
    body("*.name").notEmpty().withMessage("Menu item name is required"),
    body("*.price").isNumeric().withMessage("Price must be a number"),
    validatorChecker,
  ],
  facilityController.createMenu
);

router.put(
  "/:facilityId/menu", // PUT : update menu for a facility
  [
    param("facilityId")
      .isNumeric()
      .withMessage("Valid Facility ID is required"),
    body().isArray().withMessage("Menu data should be an array"),
    body("*.name").notEmpty().withMessage("Menu item name is required"),
    body("*.price").isNumeric().withMessage("Price must be a number"),
    validatorChecker,
  ],
  facilityController.updateMenu
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

module.exports = router;
