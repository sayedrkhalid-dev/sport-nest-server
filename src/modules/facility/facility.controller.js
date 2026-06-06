const mongoose = require("mongoose");
const facilityService = require("./facility.service");

// ─── Helper ───────────────────────────────────────────────────────────────────
const isValidId = (id) => mongoose.isValidObjectId(id);

// ─── GET /facilities ──────────────────────────────────────────────────────────
const getFacilities = async (req, res, next) => {
  try {
    // const { search, facility_type, location } = req.query;
    // const filters = {};

    // // Search by facility name using $regex
    // if (search) {
    //   filters.name = { $regex: search, $options: "i" };
    // }

    // // Filter by sport type using $in
    // if (facility_type) {
    //   const types = facility_type
    //     .split(",")
    //     .map((t) => t.trim().toLowerCase());
    //   filters.facility_type = { $in: types };
    // }

    // // Location search
    // if (location) {
    //   filters.location = { $regex: location, $options: "i" };
    // }

    const facilities = await facilityService.getAllFacilities();

    res.status(200).json({
      success: true,
      message: "Facilities retrieved successfully",
      count: facilities.length,
      data: facilities,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /facilities/:id ──────────────────────────────────────────────────────
const getFacility = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid facility ID",
      });
    }

    const facility = await facilityService.getFacilityById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Facility retrieved successfully",
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /facilities ─────────────────────────────────────────────────────────
const createFacility = async (req, res, next) => {
  try {
    // Auto-fill owner email from the logged in user
    req.body.owner_email = req.user.email;

    const facility = await facilityService.createFacility(req.body);

    res.status(201).json({
      success: true,
      message: "Facility created successfully",
      data: facility,
    });
  } catch (error) {
    next(error);
  }
};

// ─── PUT /facilities/:id ──────────────────────────────────────────────────────
const updateFacility = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid facility ID",
      });
    }

    // Fetch the facility first to check ownership
    const facility = await facilityService.getFacilityById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    // Only facility owner (or admin) can update facility
    if (facility.owner_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this facility.",
      });
    }

    const updated = await facilityService.updateFacility(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Facility updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /facilities/:id ───────────────────────────────────────────────────
const deleteFacility = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid facility ID",
      });
    }

    // Fetch the facility first to check ownership
    const facility = await facilityService.getFacilityById(req.params.id);
    if (!facility) {
      return res.status(404).json({
        success: false,
        message: "Facility not found",
      });
    }

    // Only facility owner (or admin) can delete facility
    if (facility.owner_email !== req.user.email && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this facility.",
      });
    }

    const deleted = await facilityService.deleteFacility(req.params.id);

    res.status(200).json({
      success: true,
      message: "Facility deleted successfully",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
};
