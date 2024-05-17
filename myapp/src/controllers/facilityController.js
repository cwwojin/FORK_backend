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
  getOpeningHoursByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const openingHours = await facilityService.getOpeningHoursByFacilityId(
        facilityId
      );
      res.status(200).json(openingHours);
    } catch (err) {
      next(err);
    }
  },
  addOpeningHours: async (req, res, next) => {
    try {
      const { day, open_time, close_time } = req.body; // Destructure keys from request body
      const openingHoursData = {
        day,
        openTime: open_time, // Map to camelCase
        closeTime: close_time, // Map to camelCase
      };
      const result = await facilityService.addOpeningHours(
        req.params.facilityId,
        openingHoursData
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  updateOpeningHours: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const openingHours = req.body; // Expect an array of opening hours
      const result = await facilityService.updateOpeningHours(
        facilityId,
        openingHours
      );
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getMenuByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const menu = await facilityService.getMenuByFacilityId(facilityId);
      res.status(200).json(menu);
    } catch (err) {
      next(err);
    }
  },
  getMenuItemById: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const menuId = Number(req.params.menuId);

      const menuItem = await facilityService.getMenuItemById(
        facilityId,
        menuId
      );
      res.status(200).json(menuItem);
    } catch (err) {
      next(err);
    }
  },
  createMenu: async (req, res, next) => {
    try {
      const menuItems = req.body; // Expect array of menu items
      const result = await facilityService.createMenu(
        req.params.facilityId,
        menuItems
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateMenuItem: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const menuId = Number(req.params.menuId);
      const menuItemData = req.body;

      const updatedMenuItem = await facilityService.updateMenuItem(
        facilityId,
        menuId,
        menuItemData
      );
      res.status(200).json(updatedMenuItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  deleteMenu: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const menuId = Number(req.params.menuId);

      const result = await facilityService.deleteMenu(facilityId, menuId);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getPostsByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const posts = await facilityService.getPostsByFacilityId(facilityId);
      res.status(200).json(posts);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getPostById: async (req, res, next) => {
    try {
      const { facilityId, postId } = req.params;
      const post = await facilityService.getPostById(facilityId, postId);
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createPost: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const { authorId, title, content, img_uri } = req.body;

      const post = await facilityService.createPost(facilityId, {
        authorId,
        title,
        content,
        img_uri,
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { facilityId, postId } = req.params;
      const post = await facilityService.updatePost(
        facilityId,
        postId,
        req.body
      );
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { facilityId, postId } = req.params;
      const message = await facilityService.deletePost(facilityId, postId);
      res.status(200).json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
