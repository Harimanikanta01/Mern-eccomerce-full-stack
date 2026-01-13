import React, { useState, useContext, useEffect, useRef } from "react";
import Logo from "./Logo";
import { GrSearch } from "react-icons/gr";
import { FaShoppingCart, FaRegUserCircle, FaChevronDown } from "react-icons/fa";
import { FiLogOut, FiUser, FiSettings, FiHome } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const token = localStorage.getItem("token");
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q") || "";
  const [search, setSearch] = useState(searchQuery);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setMenuDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(setUserDetails(null));
    toast.success("Logged out successfully!", {
      position: "top-right",
      theme: "colored",
    });
    setMenuDisplay(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setIsSearchFocused(false);
    }
  };

  const menuItems = [
    {
      title: "Home",
      icon: <FiHome />,
      path: "/",
      show: true,
    },
    {
      title: "Admin Panel",
      icon: <MdAdminPanelSettings />,
      path: "/admin-panel/all-products",
      show: user?.role === ROLE.ADMIN,
    },
    {
      title: "Profile",
      icon: <FiUser />,
      path: "/profile",
      show: !!token,
    },
    {
      title: "Settings",
      icon: <FiSettings />,
      path: "/settings",
      show: !!token,
    },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "h-16 shadow-lg backdrop-blur-lg bg-white/95"
          : "h-20 bg-white shadow-md"
      }`}
    >
      <div className="h-full container mx-auto px-4 lg:px-8 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-all duration-300"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            Halvon
          </span>
        </Link>

        {/* SEARCH BAR - Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
          <div
            className={`relative w-full transition-all duration-300 ${
              isSearchFocused ? "scale-105" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="w-full px-6 py-3 pr-12 rounded-full border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-300 shadow-sm"
              onChange={handleSearch}
              onKeyPress={handleSearchSubmit}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              value={search}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors duration-200"
              onClick={() => search.trim() && navigate(`/search?q=${encodeURIComponent(search)}`)}
            >
              <GrSearch className="text-xl" />
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH ICON */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => navigate("/search")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <GrSearch className="text-xl text-gray-600" />
          </button>
        </div>

        {/* USER / CART / LOGIN */}
        <div className="flex items-center gap-4">
          {/* CART */}
          {token && (
            <Link
              to="/cart"
              className="relative p-2 group hover:bg-gray-50 rounded-full transition-all duration-200"
            >
              <FaShoppingCart className="text-2xl text-gray-700 group-hover:text-red-600 transition-colors duration-200" />
              {context?.cartProductCount > 0 && (
                <>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce">
                    {context.cartProductCount > 9 ? "9+" : context.cartProductCount}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                </>
              )}
            </Link>
          )}

          {/* USER PROFILE DROPDOWN */}
          {token ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setMenuDisplay(!menuDisplay)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-50 transition-all duration-200 group"
              >
                <div className="relative">
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow group-hover:border-red-200 transition-all duration-300"
                      alt={user?.name || "User"}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-2 border-white shadow group-hover:border-red-200 transition-all duration-300">
                      <FaRegUserCircle className="text-2xl text-gray-600" />
                    </div>
                  )}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </div>
                <FaChevronDown
                  className={`text-gray-500 transition-transform duration-300 ${
                    menuDisplay ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* DROPDOWN MENU */}
              {menuDisplay && (
                <div
                  ref={menuRef}
                  className="absolute right-0 top-14 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeIn"
                >
                  {/* USER INFO */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900 truncate">
                      {user?.name || "Welcome"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || "User"}
                    </p>
                  </div>

                  {/* MENU ITEMS */}
                  <div className="py-2">
                    {menuItems
                      .filter((item) => item.show)
                      .map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                          onClick={() => setMenuDisplay(false)}
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      ))}
                  </div>

                  {/* LOGOUT BUTTON */}
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <FiLogOut className="text-lg group-hover:rotate-12 transition-transform duration-200" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-red-200 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 group"
            >
              <FaRegUserCircle className="group-hover:rotate-12 transition-transform duration-300" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH BAR (Expanded) */}
      {location.pathname === "/search" && (
        <div className="lg:hidden px-4 py-3 border-t border-gray-100 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
              onChange={handleSearch}
              onKeyPress={handleSearchSubmit}
              value={search}
              autoFocus
            />
            <GrSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;