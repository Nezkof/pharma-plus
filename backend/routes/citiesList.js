const express = require("express");
const router = express.Router();
const citiesListController = require("../controllers/citiesListController");

router.get("/", citiesListController.renderCitiesList);

module.exports = router;
