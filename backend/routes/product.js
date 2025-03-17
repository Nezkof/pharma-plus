const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:id", productController.getProductCardData);
router.get("/product-details/:id", productController.getProductDetails);

module.exports = router;
