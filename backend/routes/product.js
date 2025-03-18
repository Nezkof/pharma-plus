const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/:id", productController.getProductCardData);
router.get("/product-details/:id", productController.getProductDetails);
router.get(
   "/:productId/pharmacies/:pharmacyId",
   productController.getPharmacyProductData
);

module.exports = router;
