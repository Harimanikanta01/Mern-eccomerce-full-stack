import React, { useContext, useState } from 'react'
import displayINRCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import { Link } from 'react-router-dom'
import { FaCartPlus, FaHeart, FaEye, FaStar, FaFire } from 'react-icons/fa'

const VerticalCard = ({ loading, data = [] }) => {
    const { fetchUserAddToCart } = useContext(Context)
    const [hoveredCard, setHoveredCard] = useState(null)

    const handleAddToCart = async (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        await addToCart(e, id)
        fetchUserAddToCart()
    }

    const handleQuickView = (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        // Implement quick view modal here
        console.log("Quick view for product:", id)
    }

    const handleAddToWishlist = (e, id) => {
        e.preventDefault()
        e.stopPropagation()
        // Implement wishlist functionality here
        console.log("Add to wishlist:", id)
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
                Array(8).fill(null).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                        <div className="h-56 bg-gray-200"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                ))
            ) : data.length > 0 ? (
                data.map((product, index) => (
                    <Link
                        key={product?._id || index}
                        to={`/product/${product?._id}`}
                        className="group relative bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 overflow-hidden"
                        onMouseEnter={() => setHoveredCard(product._id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {/* Badge */}
                        <div className="absolute top-3 left-3 z-10">
                            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full shadow-lg">
                                Hot
                            </span>
                        </div>

                        {/* Quick Actions */}
                        <div className={`absolute top-3 right-3 z-10 flex flex-col gap-2 transition-all duration-300 ${hoveredCard === product._id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                            <button
                                onClick={(e) => handleAddToWishlist(e, product._id)}
                                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 hover:text-red-600 hover:scale-110 transition-all duration-300"
                            >
                                <FaHeart className="text-lg" />
                            </button>
                            <button
                                onClick={(e) => handleQuickView(e, product._id)}
                                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                            >
                                <FaEye className="text-lg" />
                            </button>
                        </div>

                        {/* Product Image */}
                        <div className="relative h-56 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
                            <img
                                src={product?.productImage?.[0] || 'https://via.placeholder.com/300'}
                                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                alt={product?.productName}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Product Details */}
                        <div className="p-4">
                            <div className="mb-3">
                                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
                                    {product?.productName}
                                </h3>
                                <p className="text-sm text-gray-500 capitalize mt-1">
                                    {product?.category}
                                </p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar key={star} className="w-4 h-4" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">(4.8)</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-xl font-bold text-red-600">
                                        {displayINRCurrency(product?.sellingPrice)}
                                    </p>
                                    {product?.price > product?.sellingPrice && (
                                        <p className="text-sm text-gray-400 line-through">
                                            {displayINRCurrency(product?.price)}
                                        </p>
                                    )}
                                </div>
                                {product?.price > product?.sellingPrice && (
                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                        {Math.round((1 - product?.sellingPrice / product?.price) * 100)}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={(e) => handleAddToCart(e, product?._id)}
                                className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                            >
                                <FaCartPlus />
                                Add to Cart
                            </button>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-full py-12 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaFire className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                        <p className="text-gray-500">No products available in this category.</p>
                        <Link
                            to="/products"
                            className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                            Browse All Products
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VerticalCard