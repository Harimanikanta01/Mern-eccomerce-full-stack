import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import getPublicImage from "../helpers/getPublicImage";

const BannerProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // 🔹 paths (can come from DB also)
  const desktopImages = [
    "src/assets/banner/img1.webp",
    "src/assets/banner/img2.webp",
    "src/assets/banner/img3.jpg",
    "src/assets/banner/img4.jpg",
    "src/assets/banner/img5.webp",
  ];

  const mobileImages = [
    "src/assets/banner/img1_mobile.jpg",
    "src/assets/banner/img2_mobile.webp",
    "src/assets/banner/img3_mobile.jpg",
    "src/assets/banner/img4_mobile.jpg",
    "src/assets/banner/img5_mobile.png",
  ];

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev < desktopImages.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev > 0 ? prev - 1 : desktopImages.length - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔥 DEBUG: see converted paths
  useEffect(() => {
    console.log(
      "Desktop Image Path:",
      getPublicImage(desktopImages[currentImage])
    );
    console.log(
      "Mobile Image Path:",
      getPublicImage(mobileImages[currentImage])
    );
  }, [currentImage]);

  return (
    <div className="container mx-auto px-4 rounded">
      <div className="h-56 md:h-72 w-full bg-slate-200 relative overflow-hidden">

        {/* ARROWS */}
        <div className="absolute z-10 h-full w-full hidden md:flex items-center">
          <div className="flex justify-between w-full text-2xl px-2">
            <button
              onClick={prevImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={nextImage}
              className="bg-white shadow-md rounded-full p-1"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div
          className="hidden md:flex h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {desktopImages.map((img, index) => {
            const finalPath = getPublicImage(img);
            console.log("Desktop mapped:", finalPath);

            return (
              <img
                key={index}
                src={finalPath}
                className="min-w-full h-full object-cover"
                alt="banner"
              />
            );
          })}
        </div>

        {/* MOBILE */}
        <div
          className="flex md:hidden h-full w-full transition-transform duration-700"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {mobileImages.map((img, index) => {
            const finalPath = getPublicImage(img);
            console.log("Mobile mapped:", finalPath);

            return (
              <img
                key={index}
                src={finalPath}
                className="min-w-full h-full object-cover"
                alt="banner"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;
