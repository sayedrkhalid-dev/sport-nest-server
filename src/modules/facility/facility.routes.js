const express = require("express");
const { validateRequest } = require("./facility.middleware");
const { protect } = require("../auth/auth.middleware");
const {
  createFacilitySchema,
  updateFacilitySchema,
} = require("./facility.validation");
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
} = require("./facility.controller");

const router = express.Router();

// GET  /facilities     → Public: explore facilities
// POST /facilities     → Private: add a facility (auto-fills owner)
router
  .route("/facilities")
  .get(getFacilities)
  .post(protect, validateRequest(createFacilitySchema), createFacility);

// GET    /facilities/:id → Public: view details
// PUT    /facilities/:id → Private: update a facility (owner only)
// DELETE /facilities/:id → Private: soft delete a facility (owner only)
router
  .route("/facilities/:id")
  .get(getFacility)
  .put(protect, validateRequest(updateFacilitySchema), updateFacility)
  .delete(protect, deleteFacility);

module.exports = router;
