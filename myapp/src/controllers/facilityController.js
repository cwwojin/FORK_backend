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
      next(err);
    }
  },

  createFacility: async (req, res, next) => {
    try {
      const facility = await facilityService.createFacility(req.body);
      res.status(201).json(facility);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateFacility: async (req, res, next) => {
    try {
      const facility = await facilityService.updateFacility(
        req.params.id,
        req.body
      );
      res.status(200).json(facility);
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

  addOpeningHours: async (req, res, next) => {
    try {
      const result = await facilityService.addOpeningHours(
        req.params.facilityId,
        req.body
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateMenu: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const menuItems = req.body.menu; // This should include all necessary menu item details
      const result = await facilityService.updateMenu(facilityId, [menuItems]); // Assuming the service expects an array of items
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
