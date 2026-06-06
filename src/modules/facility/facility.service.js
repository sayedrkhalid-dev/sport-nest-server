const Facility = require("./facility.model");

// Retrieve active facilities with optional filters
const getAllFacilities = async (filters = {}) => {
  return await Facility.find(filters).sort({ createdAt: -1 });
};

// Retrieve a single facility by ID
const getFacilityById = async (id) => {
  return await Facility.findOne({ _id: id });
};

// Create a new facility
const createFacility = async (data) => {
  const facility = new Facility(data);
  return await facility.save();
};

// Update an existing facility
const updateFacility = async (id, data) => {
  return await Facility.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true },
  );
};

// Soft delete facility (set is_active to false)
const deleteFacility = async (id) => {
  return await Facility.findByIdAndUpdate(
    id,
    { $set: { is_active: false } },
    { new: true },
  );
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
