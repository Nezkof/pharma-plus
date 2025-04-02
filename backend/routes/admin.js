const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminCategoriesController = require("../controllers/admin/adminCategoriesController");
const adminMethodsController = require("../controllers/admin/adminMethodsController");
const adminFormsController = require("../controllers/admin/adminFormsController");
const adminPharmaciesController = require("../controllers/admin/adminPharmaciesController");
const adminProductsController = require("../controllers/admin/adminProductsController");
const adminPharmacyProductsController = require("./../controllers/admin/adminPharmacyProductsController");
const adminOrdersController = require("./../controllers/admin/adminOrdersController");

router.get("/", adminController.getAdminPage);

router.get("/categories", adminCategoriesController.getCategories);
router.get("/categories-json", adminCategoriesController.getCategoriesJSON);
router.post("/add-category", adminCategoriesController.addCategory);
router.delete("/delete-category/:id", adminCategoriesController.deleteCategory);
router.put(
   "/update-category/:category_id",
   adminCategoriesController.updateCategory
);

router.get(
   "/application-methods",
   adminMethodsController.getApplicationMethods
);
router.get(
   "/application-methods-json",
   adminMethodsController.getApplicationMethodsJSON
);
router.post(
   "/add-application-method",
   adminMethodsController.addApplicationMethod
);
router.delete(
   "/delete-application-method/:id",
   adminMethodsController.deleteApplicationMethod
);
router.put(
   "/update-application-method/:id",
   adminMethodsController.updateApplicationMethod
);

router.get("/forms", adminFormsController.getForms);
router.get("/forms-json", adminFormsController.getFormsJSON);
router.post("/add-form", adminFormsController.addForm);
router.delete("/delete-form/:id", adminFormsController.deleteForm);
router.put("/update-form/:id", adminFormsController.updateForm);

router.get("/pharmacies", adminPharmaciesController.getPharmacies);
router.post("/add-pharmacy", adminPharmaciesController.addPharmacy);
router.delete("/delete-pharmacy/:id", adminPharmaciesController.deletePharmacy);
router.put("/update-pharmacy/:id", adminPharmaciesController.updatePharmacy);

router.get("/products", adminProductsController.getProducts);
router.post("/add-product", adminProductsController.addProduct);
router.delete("/delete-product/:id", adminProductsController.deleteProduct);
router.put("/update-product/:id", adminProductsController.updateProduct);

router.get(
   "/pharmacies-products",
   adminPharmacyProductsController.getPharmacyProducts
);
router.post(
   "/add-pharmacy-product",
   adminPharmacyProductsController.addPharmacyProduct
);
router.delete(
   "/delete-pharmacy-product/:id",
   adminPharmacyProductsController.deletePharmacyProduct
);
router.put(
   "/update-pharmacy-product/:id",
   adminPharmacyProductsController.updatePharmacyProduct
);

router.get("/orders", adminOrdersController.getOrders);
router.delete("/delete-order-item/:id", adminOrdersController.deleteOrder);
router.put("/update-order-item/:id", adminOrdersController.updateOrder);

module.exports = router;
