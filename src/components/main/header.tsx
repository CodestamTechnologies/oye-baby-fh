"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/providers/cartProvider";
import { useAuth } from "@/providers/authProvider";
import SearchProducts from "./Search";
import { useProducts } from "@/providers/productsProvider";
import Sidebar from "./Sidebar";
import Image from "next/image";

const Header = () => {
  const { cartCount, openCartModal } = useCart();
  const { openLoginModal } = useAuth();
  const { products } = useProducts();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Close sidebar on click outside (without ref, using event delegation)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector("aside");
      const menuButton = document.querySelector('button[aria-label="Toggle Sidebar"]');
      if (
        isSidebarOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className="z-40 bg-gradient-to-b from-blue-300 to-white py-[20px] px-6   sticky top-0  bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-[#1A2A44] text-4xl hover:text-[#262c36] transition-colors duration-200 "
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <Menu className=" text-2xl" />
              </Button>
              <div className="flex items-center gap-3 group">
                <div className="flex items-center gap-3 group md:hidden">
                  <Image
                    src="/logo.jpg"
                    alt="FEMEIE"
                    width={50}
                    height={50}
                    className="object-contain rounded-xl drop-shadow-md transition-transform duration-200 group-hover:scale-105"
                  />
                  
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <SearchProducts products={products} />
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                onClick={openLoginModal}
                aria-label="User Account"
              >
                <User className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-[#1A2A44] transition-colors duration-200"
                onClick={openCartModal}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#1A2A44] text-white text-xs flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>

            <div className="flex md:hidden items-center space-x-3">
              <SearchProducts products={products} />
               <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-purple-600 transition-colors duration-200"
                onClick={openLoginModal}
                aria-label="User Account"
              >
                <User className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-pink-600 transition-colors duration-200"
                onClick={openCartModal}
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-pink-600 text-white text-xs flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar for Mobile View */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;