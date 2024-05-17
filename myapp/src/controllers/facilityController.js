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
      const { day, openTime, closeTime } = req.body; // Destructure keys from request body
      const openingHoursData = {
        day,
        openTime,
        closeTime,
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
      const menuId = Number(req.params.menuId);

      const menuItem = await facilityService.getMenuItemById(menuId);
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
      const { authorId, title, content, imgUri } = req.body;

      const post = await facilityService.createPost(facilityId, {
        authorId,
        title,
        content,
        imgUri,
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await facilityService.updatePost(postId, req.body);
      res.status(200).json(post);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const message = await facilityService.deletePost(postId);
      res.status(200).json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getStampRulesetRewardsByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const ruleset = await facilityService.getStampRulesetByFacilityId(
        facilityId
      );
      res.status(200).json(ruleset);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createStampRuleset: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const ruleset = await facilityService.createStampRuleset(
        facilityId,
        req.body
      );
      res.status(201).json(ruleset);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateStampRuleset: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const ruleset = await facilityService.updateStampRuleset(
        facilityId,
        req.body
      );
      res.status(200).json(ruleset);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // For stamp_reward
  createStampReward: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const reward = await facilityService.createStampReward(
        facilityId,
        req.body
      );
      res.status(201).json(reward);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateStampReward: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const rewardId = Number(req.params.rewardId);
      const reward = await facilityService.updateStampReward(
        facilityId,
        rewardId,
        req.body
      );
      res.status(200).json(reward);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteStampReward: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const rewardId = Number(req.params.rewardId);
      const message = await facilityService.deleteStampReward(
        facilityId,
        rewardId
      );
      res.status(200).json(message);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getPreferencesByFacilityId: async (req, res, next) => {
    try {
      const preferences = await facilityService.getPreferencesByFacilityId(
        req.params.facilityId
      );
      res.status(200).json(preferences);
    } catch (err) {
      next(err);
    }
  },

  addPreferenceToFacility: async (req, res, next) => {
    try {
      const preference = await facilityService.addPreferenceToFacility(
        req.params.facilityId,
        req.body.preferenceId
      );
      res.status(201).json(preference);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deletePreferenceFromFacility: async (req, res, next) => {
    try {
      const preference = await facilityService.deletePreferenceFromFacility(
        req.params.facilityId,
        req.params.preferenceId
      );
      res.status(200).json(preference);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
