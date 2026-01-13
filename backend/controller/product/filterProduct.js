const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];

    // If no categories sent, return all products
    const query = categoryList.length > 0 ? { category: { $in: categoryList } } : {};

    const products = await productModel.find(query);

    return res.status(200).json({
      data: products,
      message: "Products fetched successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    console.error("Filter Product Error:", err);
    return res.status(500).json({
      message: err.message || "Something went wrong",
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
