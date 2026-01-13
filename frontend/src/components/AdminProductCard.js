import React, { useState } from 'react'
import { CgClose } from "react-icons/cg"
import productCategory from '../helpers/productCategory'
import { FaCloudUploadAlt } from "react-icons/fa"
import uploadImage from '../helpers/uploadImage'
import DisplayImage from './DisplayImage'
import { MdDelete } from "react-icons/md"
import SummaryApi from '../common'
import { toast } from 'react-toastify'

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {

  const [data, setData] = useState({
    _id: productData?._id,
    productName: productData?.productName || "",
    brandName: productData?.brandName || "",
    category: productData?.category || "",
    productImage: productData?.productImage || [],
    description: productData?.description || "",
    price: productData?.price || "",
    sellingPrice: productData?.sellingPrice || ""
  })

  const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
  const [fullScreenImage, setFullScreenImage] = useState("")

  const handleOnChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const uploadImageCloudinary = await uploadImage(file)

    setData(prev => ({
      ...prev,
      productImage: [...prev.productImage, uploadImageCloudinary.url]
    }))
  }

  const handleDeleteProductImage = (index) => {
    const newImages = [...data.productImage]
    newImages.splice(index, 1)

    setData(prev => ({
      ...prev,
      productImage: newImages
    }))
  }

  // ✅ JWT BASED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Unauthorized. Please login again.")
      return
    }

    try {
      const response = await fetch(SummaryApi.updateProduct.url, {
        method: SummaryApi.updateProduct.method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })

      const responseData = await response.json()

      if (responseData.success) {
        toast.success(responseData.message)
        onClose()
        fetchdata()
      } else {
        toast.error(responseData.message)
      }

    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className='fixed inset-0 bg-slate-200 bg-opacity-35 flex justify-center items-center z-50'>
      <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%]'>

        <div className='flex justify-between items-center pb-3'>
          <h2 className='font-bold text-lg'>Edit Product</h2>
          <div
            className='text-2xl cursor-pointer hover:text-red-600'
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form className='grid gap-2 overflow-y-scroll h-full pb-5' onSubmit={handleSubmit}>

          <label>Product Name</label>
          <input
            type='text'
            name='productName'
            value={data.productName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label>Brand Name</label>
          <input
            type='text'
            name='brandName'
            value={data.brandName}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label>Category</label>
          <select
            name='category'
            value={data.category}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          >
            <option value="">Select Category</option>
            {productCategory.map((el, index) => (
              <option key={index} value={el.value}>{el.label}</option>
            ))}
          </select>

          <label>Product Images</label>
          <label htmlFor='uploadImageInput'>
            <div className='h-32 border bg-slate-100 flex flex-col justify-center items-center cursor-pointer'>
              <FaCloudUploadAlt size={32} />
              <p>Upload Image</p>
              <input
                type='file'
                id='uploadImageInput'
                className='hidden'
                onChange={handleUploadProduct}
              />
            </div>
          </label>

          <div className='flex gap-2'>
            {data.productImage.map((img, index) => (
              <div key={index} className='relative group'>
                <img
                  src={img}
                  alt=''
                  className='w-20 h-20 border cursor-pointer'
                  onClick={() => {
                    setFullScreenImage(img)
                    setOpenFullScreenImage(true)
                  }}
                />
                <div
                  className='absolute bottom-1 right-1 bg-red-600 text-white p-1 rounded-full hidden group-hover:block cursor-pointer'
                  onClick={() => handleDeleteProductImage(index)}
                >
                  <MdDelete />
                </div>
              </div>
            ))}
          </div>

          <label>Price</label>
          <input
            type='number'
            name='price'
            value={data.price}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label>Selling Price</label>
          <input
            type='number'
            name='sellingPrice'
            value={data.sellingPrice}
            onChange={handleOnChange}
            className='p-2 bg-slate-100 border rounded'
            required
          />

          <label>Description</label>
          <textarea
            name='description'
            value={data.description}
            onChange={handleOnChange}
            className='bg-slate-100 border p-2 resize-none h-28'
          />

          <button className='bg-red-600 text-white py-2 rounded hover:bg-red-700'>
            Update Product
          </button>

        </form>
      </div>

      {openFullScreenImage && (
        <DisplayImage
          imgUrl={fullScreenImage}
          onClose={() => setOpenFullScreenImage(false)}
        />
      )}
    </div>
  )
}

export default AdminEditProduct
