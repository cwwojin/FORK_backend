const { Router } = require("express");
const facilityController = require("../controllers/facilityController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");

const router = Router();

router.get("/", facilityController.getAllFacilities);
router.get(
  "/:id",
  [param("id").isInt()],
  validatorChecker,
  facilityController.getFacilityById
);
router.post(
  "/",
  [
    body("name").notEmpty(),
    body("location").notEmpty(),
    body("description").notEmpty(),
  ],
  validatorChecker,
  facilityController.createFacility
);
router.put(
  "/:id",
  [
    param("id").isInt(),
    body("name").notEmpty(),
    body("location").notEmpty(),
    body("description").notEmpty(),
  ],
  validatorChecker,
  facilityController.updateFacility
);
router.delete(
  "/:id",
  [param("id").isInt()],
  validatorChecker,
  facilityController.deleteFacility
);

module.exports = router;
