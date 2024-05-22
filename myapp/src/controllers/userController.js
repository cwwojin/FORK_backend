const userService = require("../services/userService");
const { makeS3Uri } = require("../helper/helper");

module.exports = {
  /** get user by query - account_id, user_type */
  getUsers: async (req, res, next) => {
    try {
      const result = await userService.getUsers(req.query);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  // get user by ID
  getUserById: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.getUserById(id);
      if (result.length !== 0) {
        res.status(200).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `No user with id: ${id}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // create new user
  createUser: async (req, res, next) => {
    try {
      const result = await userService.createUser(req.body);
      if (result.length !== 0) {
        res.status(201).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `No records were inserted`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // update user - profile
  updateUserProfile: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.updateUserProfile(req.body, id);
      if (result.length !== 0) {
        res.status(201).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `No user with id: ${id}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  // delete user
  deleteUser: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.deleteUser(id);
      res.status(200).json({
        status: "success",
        data: result[0],
      });
    } catch (err) {
      next(err);
    }
  },
  // get user preferences
  getUserPreference: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.getUserPreference(id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  // add a preference to user (if it isnt already added)
  addUserPreference: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.addUserPreference(
        id,
        req.body.preferenceId
      );
      res.status(201).json({
        status: "success",
        data: result[0],
      });
    } catch (err) {
      next(err);
    }
  },
  // delete a preference of a user
  deleteUserPreference: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.deleteUserPreference(
        id,
        req.body.preferenceId
      );
      res.status(200).json({
        status: "success",
        data: result[0],
      });
    } catch (err) {
      next(err);
    }
  },
  // get user favorites
  getUserFavorite: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.getUserFavorite(id);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  // add a favorite
  addUserFavorite: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.addUserFavorite(id, req.body.facilityId);
      res.status(201).json({
        status: "success",
        data: result[0],
      });
    } catch (err) {
      next(err);
    }
  },
  // delete a favorite
  deleteUserFavorite: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.deleteUserFavorite(
        id,
        req.body.facilityId
      );
      res.status(200).json({
        status: "success",
        data: result[0],
      });
    } catch (err) {
      next(err);
    }
  },
  /** upload a user profile image */
  uploadUserProfileImage: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const imageUri =
        req.file !== undefined ? makeS3Uri(req.file.bucket, req.file.key) : "";
      const result = await userService.uploadUserProfileImage(id, imageUri);
      if (result.length !== 0) {
        res.status(201).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `No user with id: ${id}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  /** delete a user profile image */
  deleteUserProfileImage: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.deleteUserProfileImage(id);
      if (result.length !== 0) {
        res.status(201).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `No user with id: ${id}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  /** get all preferences */
  getAllPreferences: async (req, res, next) => {
    try {
      const result = await userService.getAllPreferences();
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },
  /** get preference by id */
  getPreference: async (req, res, next) => {
    const id = Number(req.params.id);
    try {
      const result = await userService.getPreference(id);
      if (result.length !== 0) {
        res.status(200).json({
          status: "success",
          data: result[0],
        });
      } else {
        res.status(404).json({
          status: "fail",
          message: `no preference with id: ${id}`,
        });
      }
    } catch (err) {
      next(err);
    }
  },
  /** get my facilities */
  getMyFacility: async (req, res, next) => {
    try {
      const facility = await userService.getMyFacility(req.params.id);
      if (facility) {
        res.status(200).json({ status: "success", data: facility });
      } else {
        res.status(404).json({ status: "fail", message: "Facility not found" });
      }
    } catch (err) {
      next(err);
    }
  },
  /** update my facility by ID */
  updateMyFacility: async (req, res, next) => {
    try {
      const facility = await userService.updateMyFacility(
        req.params.user,
        req.params.facility,
        req.body
      );
      res.status(200).json({ status: "success", data: facility });
    } catch (err) {
      next(err);
    }
  },
  /** delete facility relationship */
  deleteFacilityRelationship: async (req, res, next) => {
    try {
      const result = await userService.deleteFacilityRelationship(
        req.params.id,
        req.params.facilityId
      );
      if (result) {
        res.status(200).json({ status: "success", data: result });
      } else {
        res.status(404).json({
          status: "fail",
          message: "Facility for current user not found",
        });
      }
    } catch (err) {
      next(err);
    }
  },
};
