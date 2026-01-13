const productModel = require("../../models/productModel");

const getProductController = async (req, res) => {
  try {
    // Fetch all products sorted by newest first
    const allProducts = await productModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All products fetched successfully",
      success: true,
      error: false,
      data: allProducts,
    });
  } catch (err) {
    console.error("Get Product Error:", err);

    return res.status(500).json({
      message: err.message || "Something went wrong while fetching products",
      success: false,
      error: true,
      data: [],
    });
  }
};

module.exports = getProductController;
