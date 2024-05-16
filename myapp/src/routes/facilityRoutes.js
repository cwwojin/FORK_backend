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

router.post(
  "/", // POST : create a new facility
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("business_id").notEmpty().withMessage("Business ID is required"),
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
    body("business_id").optional(),
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

module.exports = router;
