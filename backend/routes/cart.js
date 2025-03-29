const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/render", cartController.renderOrderItem);
router.post("/delivery-section/render", cartController.renderItemsToConfirm);

router.post("/post-order", cartController.postOrder);

module.exports = router;
