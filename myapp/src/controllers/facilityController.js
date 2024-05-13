const facilityService = require("../services/facilityService");

module.exports = {
  getAllFacilities: async (req, res, next) => {
    try {
      const facilities = await facilityService.getAllFacilities();
      res.status(200).json(facilities);
    } catch (err) {
      next(err);
    }
  },
  getFacilityById: async (req, res, next) => {
    try {
      const facility = await facilityService.getFacilityById(req.params.id);
      res.status(200).json(facility);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },
  createFacility: async (req, res, next) => {
    try {
      const newFacility = await facilityService.createFacility(req.body);
      res.status(201).json(newFacility);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  updateFacility: async (req, res, next) => {
    try {
      const updatedFacility = await facilityService.updateFacility(
        req.params.id,
        req.body
      );
      res.status(200).json(updatedFacility);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteFacility: async (req, res, next) => {
    try {
      const message = await facilityService.deleteFacility(req.params.id);
      res.status(200).json(message);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },
};
``;
