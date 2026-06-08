const express = require("express");
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility,
} = require("./facility.controller");

const router = express.Router();

router.get("/facilities", getFacilities);
router.get("/facilities/:id", getFacility);
router.post("/facilities", createFacility);
router.put("/facilities/:id", updateFacility);
router.delete("/facilities/:id", deleteFacility);

module.exports = router;