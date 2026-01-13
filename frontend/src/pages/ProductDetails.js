import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar, FaStarHalf, FaShareAlt, FaHeart, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import { GiReturnArrow } from "react-icons/gi";
import displayINRCurrency from '../helpers/displayCurrency';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: ""
  })
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [zoomImage, setZoomImage] = useState(false)
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({ x: 0, y: 0 })

  const { fetchUserAddToCart } = useContext(Context)
  const navigate = useNavigate()

  const fetchProductDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          productId: params?.id
        })
      })
      const dataReponse = await response.json()
      setData(dataReponse?.data)
      setActiveImage(dataReponse?.data?.productImage[0])
    } catch (error) {
      console.error("Error fetching product details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true)
    const { left, top, width, height } = e.target.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    setZoomImageCoordinate({ x, y })
  }, [])

  const handleLeaveImageZoom = () => {
    setZoomImage(false)
  }

  const handleAddToCart = async (e, id) => {
    await addToCart(e, id, quantity)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, id, quantity)
    fetchUserAddToCart()
    navigate("/cart")
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const features = [
    { icon: <FaTruck />, text: "Free Delivery", subtext: "On orders above ₹999" },
    { icon: <FaShieldAlt />, text: "2 Year Warranty", subtext: "Manufacturer warranty" },
    { icon: <GiReturnArrow />, text: "30 Day Returns", subtext: "Easy return policy" },
    { icon: <FaUndo />, text: "Replacement", subtext: "7 day replacement" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <span className="hover:text-red-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
          <span>/</span>
          <span className="hover:text-red-600 cursor-pointer" onClick={() => navigate("/products")}>Products</span>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">{data?.productName}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Product Images Section */}
          <div className="lg:w-1/2">
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnail Images */}
              <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:h-[500px] scrollbar-thin">
                {loading ? (
                  Array(4).fill(null).map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg animate-pulse" />
                  ))
                ) : (
                  data?.productImage?.map((imgURL, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-lg border-2 cursor-pointer transition-all duration-300 overflow-hidden ${activeImage === imgURL ? 'border-red-600' : 'border-gray-200'}`}
                      onClick={() => handleMouseEnterProduct(imgURL)}
                      onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                    >
                      <img
                        src={imgURL}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))
                )}
              </div>

              {/* Main Image */}
              <div className="relative flex-1">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  {loading ? (
                    <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse" />
                  ) : (
                    <div
                      className="relative w-full h-96 rounded-lg overflow-hidden"
                      onMouseMove={handleZoomImage}
                      onMouseLeave={handleLeaveImageZoom}
                    >
                      <img
                        src={activeImage}
                        className="w-full h-full object-contain mix-blend-multiply"
                        alt={data?.productName}
                      />
                      {zoomImage && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            className="absolute inset-0 bg-contain bg-no-repeat scale-150"
                            style={{
                              backgroundImage: `url(${activeImage})`,
                              backgroundPosition: `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}%`
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`flex-1 py-3 rounded-lg border flex items-center justify-center gap-2 transition-all duration-300 ${isFavorite
                          ? 'bg-red-50 border-red-300 text-red-600'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-red-300'
                        }`}
                    >
                      <FaHeart className={isFavorite ? 'fill-current' : ''} />
                      {isFavorite ? 'Saved' : 'Save'}
                    </button>
                    <button className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-300 flex items-center justify-center gap-2 transition-all duration-300">
                      <FaShareAlt />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {loading ? (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse w-1/4" />
                  <div className="h-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              ) : (
                <>
                  {/* Brand & Category */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 text-sm font-semibold rounded-full">
                      {data?.brandName}
                    </span>
                    <span className="ml-3 text-gray-500 capitalize">{data?.category}</span>
                  </div>

                  {/* Product Name */}
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                    {data?.productName}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="w-5 h-5" />
                      ))}
                    </div>
                    <span className="text-gray-600">4.8 • 124 Reviews</span>
                  </div>

                  {/* Price Section */}
                  <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-4xl font-bold text-red-600">
                        {displayINRCurrency(data.sellingPrice)}
                      </span>
                      <span className="text-2xl text-gray-400 line-through">
                        {displayINRCurrency(data.price)}
                      </span>
                      <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                        {Math.round(((data.price - data.sellingPrice) / data.price) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-green-600 font-medium">Inclusive of all taxes • EMI available</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-8">
                    <p className="text-gray-700 font-medium mb-3">Quantity</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                          onClick={decrementQuantity}
                          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                        >
                          −
                        </button>
                        <span className="w-16 text-center text-xl font-semibold">{quantity}</span>
                        <button
                          onClick={incrementQuantity}
                          className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-300"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-gray-500">Only 12 items left</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button
                      onClick={(e) => handleBuyProduct(e, data?._id)}
                      className="flex-1 py-4 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-red-200 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(e, data?._id)}
                      className="flex-1 py-4 px-8 border-2 border-red-600 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-700 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-red-600 text-xl">{feature.icon}</div>
                        <div>
                          <p className="font-medium text-gray-800">{feature.text}</p>
                          <p className="text-sm text-gray-500">{feature.subtext}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <div className="prose max-w-none text-gray-600 leading-relaxed">
                      <p>{data?.description}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Specifications & Details */}
        {!loading && (
          <div className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{data?.brandName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{data?.category}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">2 Years</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Material</span>
                    <span className="font-medium">Premium Quality</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Country of Origin</span>
                    <span className="font-medium">India</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Return Policy</span>
                    <span className="font-medium">30 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Products */}
      {data.category && (
        <div className="container mx-auto px-4 pb-12">
          <CategroyWiseProductDisplay category={data?.category} heading={"You May Also Like"} />
        </div>
      )}
    </div>
  )
}

export default ProductDetails