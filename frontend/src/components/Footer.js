import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaShieldAlt,
  FaTruck,
  FaHeadset,
  FaLeaf
} from 'react-icons/fa'
import { BiSupport } from 'react-icons/bi'
import { TbTruckReturn } from 'react-icons/tb'
import { GiReceiveMoney } from 'react-icons/gi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const features = [
    {
      icon: <FaTruck className="text-2xl" />,
      title: "Free Shipping",
      description: "On orders over $50"
    },
    {
      icon: <TbTruckReturn className="text-2xl" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <BiSupport className="text-2xl" />,
      title: "24/7 Support",
      description: "Dedicated support"
    }
  ]

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Shipping Info", path: "/shipping" }
  ]

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports & Outdoors",
    "Beauty & Health",
    "Books & Stationery",
    "Toys & Games",
    "Automotive"
  ]

  const socialLinks = [
    { icon: <FaFacebook />, name: "Facebook", url: "https://facebook.com" },
    { icon: <FaTwitter />, name: "Twitter", url: "https://twitter.com" },
    { icon: <FaInstagram />, name: "Instagram", url: "https://instagram.com" },
    { icon: <FaLinkedin />, name: "LinkedIn", url: "https://linkedin.com" },
    { icon: <FaYoutube />, name: "YouTube", url: "https://youtube.com" }
  ]

  const paymentMethods = [
    { icon: <FaCcVisa />, name: "Visa" },
    { icon: <FaCcMastercard />, name: "Mastercard" },
    { icon: <FaCcPaypal />, name: "PayPal" },
    { icon: <FaCcAmex />, name: "American Express" }
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Features Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                Halvon
              </span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your one-stop destination for premium shopping experience. We deliver quality products with exceptional customer service.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <FaLeaf className="text-green-400 text-xl" />
              <span className="text-sm text-gray-300">Eco-friendly packaging</span>
            </div>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/10">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/10">
              Shop by Category
            </h3>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    href={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                    className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-white/10">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="mt-8">
              <h4 className="font-semibold mb-3">We Accept</h4>
              <div className="flex gap-3">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                    title={method.name}
                  >
                    <span className="text-2xl text-white">{method.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} Halvon. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Sitemap
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaHeadset className="text-red-500" />
                <span>Support: 1-800-HALVON</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs">
              Made with ❤️ by Halvon Team • Designed for the best shopping experience
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:shadow-red-500/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center z-50"
        aria-label="Back to top"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}

export default Footer