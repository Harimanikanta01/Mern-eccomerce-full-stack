const productModel = require("../../models/productModel");

const getCategoryWiseProduct = async (req, res) => {
  try {
    const { category } = req?.body || req?.query;

    if (!category) {
      return res.status(400).json({
        message: "Category is required",
        error: true,
        success: false
      });
    }

    const product = await productModel.find({
      category: { $regex: new RegExp(`^${category}$`, "i") } // case-insensitive
    });

    res.json({
      data: product,
      message: "Product",
      success: true,
      error: false
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = getCategoryWiseProduct;
