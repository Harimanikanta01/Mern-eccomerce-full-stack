import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const Cart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  const loadingCart = new Array(4).fill(null);

  const token = localStorage.getItem("token");

  // 🔐 Common auth header
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        SummaryApi.addToCartProductView.url,
        {
          method: SummaryApi.addToCartProductView.method,
          headers: authHeader,
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (err) {
      console.error("Fetch cart error", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const increaseQty = async (id, qty) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      headers: authHeader,
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
      }),
    });

    const responseData = await response.json();
    if (responseData.success) fetchData();
  };

  const decreaseQty = async (id, qty) => {
    if (qty < 2) return;

    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      headers: authHeader,
      body: JSON.stringify({
        _id: id,
        quantity: qty - 1,
      }),
    });

    const responseData = await response.json();
    if (responseData.success) fetchData();
  };

  const deleteCartProduct = async (id) => {
    const response = await fetch(SummaryApi.deleteCartProduct.url, {
      method: SummaryApi.deleteCartProduct.method,
      headers: authHeader,
      body: JSON.stringify({ _id: id }),
    });

    const responseData = await response.json();

    if (responseData.success) {
      fetchData();
      context.fetchUserAddToCart();
      toast.success("Item removed");
    }
  };

  const totalQty = data.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = data.reduce(
    (sum, item) =>
      sum + item.quantity * item?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto">
      <div className="text-center text-lg my-3">
        {data.length === 0 && !loading && (
          <p className="bg-white py-5">No Data</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 p-4">
        {/* CART LIST */}
        <div className="w-full max-w-3xl">
          {loading
            ? loadingCart.map((_, index) => (
                <div
                  key={index}
                  className="w-full bg-slate-200 h-32 my-2 animate-pulse rounded"
                />
              ))
            : data.map((product) => (
                <div
                  key={product._id}
                  className="w-full bg-white h-32 my-2 border rounded grid grid-cols-[128px,1fr]"
                >
                  <div className="w-32 h-32 bg-slate-200">
                    <img
                      src={product?.productId?.productImage[0]}
                      className="w-full h-full object-scale-down"
                      alt=""
                    />
                  </div>

                  <div className="px-4 py-2 relative">
                    <div
                      className="absolute right-0 text-red-600 p-2 cursor-pointer"
                      onClick={() => deleteCartProduct(product._id)}
                    >
                      <MdDelete />
                    </div>

                    <h2 className="text-lg line-clamp-1">
                      {product?.productId?.productName}
                    </h2>

                    <p className="text-slate-500 capitalize">
                      {product?.productId?.category}
                    </p>

                    <div className="flex justify-between">
                      <p className="text-red-600 font-medium">
                        {displayINRCurrency(
                          product?.productId?.sellingPrice
                        )}
                      </p>

                      <p className="font-semibold">
                        {displayINRCurrency(
                          product?.productId?.sellingPrice *
                            product?.quantity
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-1">
                      <button
                        onClick={() =>
                          decreaseQty(product._id, product.quantity)
                        }
                        className="border w-6 h-6"
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQty(product._id, product.quantity)
                        }
                        className="border w-6 h-6"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        {/* SUMMARY */}
        <div className="w-full max-w-sm">
          <div className="bg-white">
            <h2 className="bg-red-600 text-white px-4 py-1">
              Summary
            </h2>

            <div className="flex justify-between px-4">
              <p>Quantity</p>
              <p>{totalQty}</p>
            </div>

            <div className="flex justify-between px-4">
              <p>Total</p>
              <p>{displayINRCurrency(totalPrice)}</p>
            </div>

            <button className="bg-blue-600 text-white w-full mt-2 p-2">
              Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
