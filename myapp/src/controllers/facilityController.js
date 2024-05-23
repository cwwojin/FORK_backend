const facilityService = require("../services/facilityService");
const { makeS3Uri } = require("../helper/helper");

module.exports = {
  getAllFacilities: async (req, res, next) => {
    try {
      const facilities = await facilityService.getAllFacilities();
      res.status(200).json({
        status: "success",
        data: facilities,
      });
    } catch (err) {
      next(err);
    }
  },

  getFacilityById: async (req, res, next) => {
    try {
      const facility = await facilityService.getFacilityById(req.params.id);
      res.status(200).json({
        status: "success",
        data: facility,
      });
    } catch (err) {
      next(err);
    }
  },

  createFacility: async (req, res, next) => {
    try {
      const data = req.body;
      const facility = await facilityService.createFacility(data);
      res.status(201).json({
        status: "success",
        data: facility,
      });
    } catch (err) {
      next(err);
    }
  },

  updateFacility: async (req, res, next) => {
    try {
      const facility = await facilityService.updateFacility(
        req.params.id,
        req.body
      );
      res.status(201).json({
        status: "success",
        data: facility,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteFacility: async (req, res, next) => {
    try {
      const result = await facilityService.deleteFacility(req.params.id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  getAddressByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const address = await facilityService.getAddressByFacilityId(facilityId);
      res.status(200).json({
        status: "success",
        data: address,
      });
    } catch (err) {
      next(err);
    }
  },

  addAddress: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const address = req.body;
      const result = await facilityService.addAddress(facilityId, address);
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAddressByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const result = await facilityService.deleteAddressByFacilityId(
        facilityId
      );
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  getOpeningHoursByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const openingHours = await facilityService.getOpeningHoursByFacilityId(
        facilityId
      );
      res.status(200).json({
        status: "success",
        data: openingHours,
      });
    } catch (err) {
      next(err);
    }
  },
  addOpeningHours: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const openingHours = req.body; // It can be an object or an array
      const result = await facilityService.addOpeningHours(
        facilityId,
        openingHours
      );
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteOpeningHours: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const result = await facilityService.deleteOpeningHours(facilityId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  getMenuByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const menu = await facilityService.getMenuByFacilityId(facilityId);
      res.status(200).json({
        status: "success",
        data: menu,
      });
    } catch (err) {
      next(err);
    }
  },

  getMenuItemById: async (req, res, next) => {
    try {
      const menuId = Number(req.params.menuId);

      const menuItem = await facilityService.getMenuItemById(menuId);
      res.status(200).json({
        status: "success",
        data: menuItem,
      });
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
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
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
      res.status(201).json({
        status: "success",
        data: updatedMenuItem,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteMenu: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const menuId = Number(req.params.menuId);
      const result = await facilityService.deleteMenu(facilityId, menuId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  getPostsByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const posts = await facilityService.getPostsByFacilityId(facilityId);
      res.status(200).json({
        status: "success",
        data: posts,
      });
    } catch (err) {
      next(err);
    }
  },

  getPostById: async (req, res, next) => {
    try {
      const { facilityId, postId } = req.params;
      const post = await facilityService.getPostById(postId);
      res.status(200).json({
        status: "success",
        data: post,
      });
    } catch (err) {
      next(err);
    }
  },

  createPost: async (req, res, next) => {
    try {
      const imgUri = (req.file !== undefined) ? makeS3Uri(req.file.bucket, req.file.key) : '';
      const facilityId = Number(req.params.facilityId);
      const { authorId, title, content } = req.body;

      const post = await facilityService.createPost(facilityId, {
        authorId,
        title,
        content,
        imgUri,
      });

      res.status(201).json({
        status: "success",
        data: post,
      });
    } catch (err) {
      next(err);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await facilityService.updatePost(postId, req.body);
      res.status(201).json({
        status: "success",
        data: post,
      });
    } catch (err) {
      next(err);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const { postId } = req.params;
      const result = await facilityService.deletePost(postId);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  getStampRulesetRewardsByFacilityId: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const ruleset = await facilityService.getStampRulesetRewardsByFacilityId(
        facilityId
      );
      res.status(200).json({
        status: "success",
        data: ruleset,
      });
    } catch (err) {
      next(err);
    }
  },

  createStampRuleset: async (req, res, next) => {
    try {
      const facilityId = req.params.facilityId;
      const data = req.body;
      const result = await facilityService.createStampRuleset(facilityId, data);
      res.status(201).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  updateStampRuleset: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const ruleset = await facilityService.updateStampRuleset(
        facilityId,
        req.body
      );
      res.status(201).json({
        status: "success",
        data: ruleset,
      });
    } catch (err) {
      next(err);
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
      res.status(201).json({
        status: "success",
        data: reward,
      });
    } catch (err) {
      next(err);
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
      res.status(201).json({
        status: "success",
        data: reward,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteStampReward: async (req, res, next) => {
    try {
      const facilityId = Number(req.params.facilityId);
      const rewardId = Number(req.params.rewardId);
      const result = await facilityService.deleteStampReward(
        facilityId,
        rewardId
      );
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  getPreferencesByFacilityId: async (req, res, next) => {
    try {
      const preferences = await facilityService.getPreferencesByFacilityId(
        req.params.facilityId
      );
      res.status(200).json({
        status: "success",
        data: preferences,
      });
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
      res.status(201).json({
        status: "success",
        data: preference,
      });
    } catch (err) {
      next(err);
    }
  },

  deletePreferenceFromFacility: async (req, res, next) => {
    try {
      const preference = await facilityService.deletePreferenceFromFacility(
        req.params.facilityId,
        req.params.preferenceId
      );
      res.status(200).json({
        status: "success",
        data: preference,
      });
    } catch (err) {
      next(err);
    }
  },

  /** upload facility profile image */
  uploadFacilityProfileImage: async (req,res,next) => {
    const id = Number(req.params.id);
    try{
      const imageUri = (req.file !== undefined) ? makeS3Uri(req.file.bucket, req.file.key) : '';
      const result = await facilityService.uploadFacilityProfileImage(id, imageUri);
      res.status(201).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** delete facility profile image */
  deleteFacilityProfileImage: async (req,res,next) => {
    const id = Number(req.params.id);
    try{
      const result = await facilityService.deleteFacilityProfileImage(id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** upload stamp logo image */
  uploadStampLogoImage: async (req,res,next) => {
    const id = Number(req.params.id);
    try{
      const imageUri = (req.file !== undefined) ? makeS3Uri(req.file.bucket, req.file.key) : '';
      const result = await facilityService.uploadStampLogoImage(id, imageUri);
      res.status(201).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** delete stamp logo image */
  deleteStampLogoImage: async (req,res,next) => {
    const id = Number(req.params.id);
    try{
      const result = await facilityService.deleteStampLogoImage(id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** upload menu image */
  uploadMenuImage: async (req,res,next) => {
    try{
      const imageUri = (req.file !== undefined) ? makeS3Uri(req.file.bucket, req.file.key) : '';
      const result = await facilityService.uploadMenuImage(
        req.params.facilityId, 
        req.params.menuId, 
        imageUri,
      );
      res.status(201).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** delete menu image */
  deleteMenuImage: async (req,res,next) => {
    try{
      const result = await facilityService.deleteMenuImage(
        req.params.facilityId,
        req.params.menuId,
      );
      res.status(200).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** get trending facilities */
  getTrendingFacilities: async (req,res,next) => {
    try{
      const result = await facilityService.getTrendingFacilities(req.query);
      res.status(200).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  },
  /** get newest facilities */
  getNewestFacilities: async (req,res,next) => {
    try{
      const limit = req.query.limit;
      const result = await facilityService.getNewestFacilities(limit);
      res.status(200).json({
        status: "success",
        data: result,
      });
    }catch(err){
      next(err);
    }
  }

};
