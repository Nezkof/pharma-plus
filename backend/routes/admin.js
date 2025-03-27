const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/categories", adminController.getCategories);
router.post("/add-category", adminController.addCategory);
router.delete("/delete-category/:id", adminController.deleteCategory);
router.put("/update-category/:category_id", adminController.updateCategory);

module.exports = router;
