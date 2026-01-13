const backendDomin = "https://eccomerce-website-using-mern.onrender.com"

const SummaryApi = {
  signUP: {
    url: `${backendDomin}/api/signup`,
    method: "POST"
  },

  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "POST"
  },

  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "GET",
    auth: true
  },

  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "GET",
    auth: true
  },

  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "GET",
    auth: true
  },

  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "POST",
    auth: true
  },

  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "POST",
    auth: true
  },

  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "GET"
  },

  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "POST",
    auth: true
  },

  categoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "GET"
  },

  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "POST"
  },

  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "POST"
  },

  addToCartProduct: {
    url: `${backendDomin}/api/addtocart`,
    method: "POST",
    auth: true
  },

  addToCartProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "GET",
    auth: true
  },

  addToCartProductView: {
    url: `${backendDomin}/api/view-card-product`,
    method: "GET",
    auth: true
  },

  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "POST",
    auth: true
  },

  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "POST",
    auth: true
  },

  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "GET"
  },

  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "POST"
  }
}

export default SummaryApi
