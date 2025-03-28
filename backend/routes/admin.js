const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminPharmaciesController = require("../controllers/admin/adminPharmaciesController");
const adminProductsController = require("../controllers/admin/adminProductsController");

router.get("/categories", adminController.getCategories);
router.post("/add-category", adminController.addCategory);
router.delete("/delete-category/:id", adminController.deleteCategory);
router.put("/update-category/:category_id", adminController.updateCategory);

router.get("/application-methods", adminController.getApplicationMethods);
router.post("/add-application-method", adminController.addApplicationMethod);
router.delete(
   "/delete-application-method/:id",
   adminController.deleteApplicationMethod
);
router.put(
   "/update-application-method/:id",
   adminController.updateApplicationMethod
);

router.get("/forms", adminController.getForms);
router.post("/add-form", adminController.addForm);
router.delete("/delete-form/:id", adminController.deleteForm);
router.put("/update-form/:id", adminController.updateForm);

router.get("/pharmacies", adminPharmaciesController.getPharmacies);
router.post("/add-pharmacy", adminPharmaciesController.addPharmacy);
router.delete("/delete-pharmacy/:id", adminPharmaciesController.deletePharmacy);
router.put("/update-pharmacy/:id", adminPharmaciesController.updatePharmacy);

router.get("/products", adminProductsController.getProducts);
router.post("/add-product", adminProductsController.addProduct);
router.delete("/delete-product/:id", adminProductsController.deleteProduct);
router.put("/update-product/:id", adminProductsController.updateProduct);

module.exports = router;
