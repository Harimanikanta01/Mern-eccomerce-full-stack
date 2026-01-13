import SummaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, id) => {
  e?.stopPropagation();
  e?.preventDefault();

  // 🔐 Get JWT token
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login first");
    return { success: false };
  }

  try {
    const response = await fetch(SummaryApi.addToCartProduct.url, {
      method: SummaryApi.addToCartProduct.method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ JWT
      },
      body: JSON.stringify({
        productId: id,
      }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
    }

    if (responseData.error) {
      toast.error(responseData.message);
    }

    return responseData;
  } catch (error) {
    console.error("Add to cart error:", error);
    toast.error("Something went wrong");
    return { success: false };
  }
};

export default addToCart;
