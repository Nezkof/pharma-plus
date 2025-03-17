const express = require("express");
const router = express.Router();
const catalogController = require("../controllers/catalogController");

router.get("/", catalogController.getFilters);

router.get("/:categoryId", async (req, res) => {
   const { categoryId } = req.params;

   const filters = req.query.filters || "";

   try {
      const products = await catalogController.getCategoryProducts(
         parseInt(categoryId, 10),
         filters
      );
      res.render("product-catalog", { products });
   } catch (error) {
      console.error("Помилка:", error);
      res.status(500).json({ error: "Помилка отримання даних" });
   }
});

module.exports = router;
