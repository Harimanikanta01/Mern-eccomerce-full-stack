// src/common/Summary.js

const backendDomain = "https://eccomerce-website-using-mern.onrender.com";

const SummaryApi = {
  // --- User Authentication ---
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "POST"
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "POST"
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "GET",
    auth: true
  },
  logout_user: {
    url: `${backendDomain}/api/userLogout`,
    method: "GET",
    auth: true
  },

  // --- User Management ---
  allUser: {
    url: `${backendDomain}/api/all-user`,
    method: "GET",
    auth: true
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "POST",
    auth: true
  },

  // --- Product Management ---
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "POST",
    auth: true
  },
  allProduct: {
    url: `${backendDomain}/api/get-product`,
    method: "GET"
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "POST",
    auth: true
  },
  categoryProduct: {
    url: `${backendDomain}/api/get-categoryProduct`,
    method: "GET"
  },
  categoryWiseProduct: {
    url: `${backendDomain}/api/category-product`,
    method: "POST"
  },
  productDetails: {
    url: `${backendDomain}/api/product-details`,
    method: "POST"
  },

  // --- Cart Management ---
  addToCartProduct: {
    url: `${backendDomain}/api/addtocart`,
    method: "POST",
    auth: true
  },
  addToCartProductCount: {
    url: `${backendDomain}/api/countAddToCartProduct`,
    method: "GET",
    auth: true
  },
  addToCartProductView: {
    url: `${backendDomain}/api/view-card-product`,
    method: "GET",
    auth: true
  },
  updateCartProduct: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "POST",
    auth: true
  },
  deleteCartProduct: {
    url: `${backendDomain}/api/delete-cart-product`,
    method: "POST",
    auth: true
  },

  // --- Product Search & Filter ---
  searchProduct: {
    url: `${backendDomain}/api/search`,
    method: "GET"
  },
  filterProduct: {
    url: `${backendDomain}/api/filter-product`,
    method: "POST"
  }
};

export default SummaryApi;
