"use client";

import { Card } from "@/components/ui/card";
import { categories, Category, Product } from "@/data";
import { useProducts } from "@/providers/productsProvider";
import { Gift, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import ProductCard from "../product-card";
import Carousel from "./Carousal";
import Link from "next/link";
import { useAuth } from "@/providers/authProvider";
import { Button } from "@/components/ui/button";
import "keen-slider/keen-slider.min.css";

const MainComponent = () => {
  const { products } = useProducts();
  const { user } = useAuth();

  const groupedProducts = categories.reduce(
    (acc: { [key: string]: Product[] }, category: Category) => {
      acc[category.name] = products.filter(
        (product) => product.category.name === category.name
      );
      return acc;
    },
    {}
  );

  const allowedEmails =
    process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];

  return (
    <>
      {!allowedEmails.includes(user?.email || "") && (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FFE4E1] to-[#FFFFFF] text-[#1A2A44] w-full overflow-x-hidden font-sans">
          {/* Gradient background from light pink to white */}
          <div className="w-full">
            <Carousel />
          </div>

          <section className="py-22 px-6 bg-[url('/bg-19.jpg')] bg-cover bg-center bg-no-repeat relative ">
            {/* Relative positioning for overlay */}
            <div className="absolute inset-0 bg-black/10"></div>
            {/* 50% black overlay */}
            <div className="max-w-7xl mx-auto relative z-10">
              {/* Z-index to keep content above overlay */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div>
                  <h2 className="text-5xl font-extrabold tracking-tight text-[#1A2A44] mb-2 " style={{ textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF' }}>
                    OYE BABY
                  </h2>
                  {/* Dark blue for brand title */}
                  <p className="text-xl text-[#1A2A44] italic" style={{ textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF' }}>
                    Helping you with those first few steps
                  </p>
                  {/* Dark blue for subtitle */}
                </div>
                <Link href="/">
                  <Button className="mt-4 md:mt-0 bg-[#1A2A44]  text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 py-5 relative z-30 cursor-pointer border-white border-[1px]">
                    Explore All Categories
                  </Button>
                  {/* Dark blue button with white text, darkening on hover */}
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

                {categories.map((category) => (
                  <Link
                    href={`/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                    key={category.id}
                  >
                    <Card className="group text-center py-3 pt-8 md:pt-0 md:py-6 border-2 border-white bg-[url('/bg-22.jpg')] bg-cover bg-center bg-no-repeat shadow-black shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl relative overflow-hidden">
                      {/* Subtle blue-to-white gradient background, reduced padding for coziness */}
                      <div className="w-20 h-6 md:h-12 mx-auto mb-1 flex items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110">
                        <img
                          src={category.image || ""}
                          alt={category.name}
                          className="w-16 h-16 object-cover rounded-full border-4 bg-[#FFFFFF] border-[#1A2A44]"
                        />
                      </div>
                      {/* Enhanced image container with adjusted margin */}
                      <h3 className="font-semibold text-[#1A2A44] mb-1 text-lg">
                        {category.name}
                      </h3>
                      {/* Slightly larger text for cuteness */}
                      <p className="text-sm text-[#1A2A44] font-medium">
                        {
                          products.filter(
                            (product) => product.category.name === category.name
                          ).length
                        } products
                      </p>
                      {/* Medium font weight for a softer look */}
                      <div className="absolute top-2 right-2 w-4 h-4 bg-[#1A2A44] rounded-full flex items-center justify-center text-[#FFFFFF] text-xs">
                        ♥
                      </div>
                      {/* Small heart accent in dark blue */}
                      <div className="absolute top-2 left-2 w-4 h-4 bg-[#1A2A44] rounded-full flex items-center justify-center text-[#FFFFFF] text-xs">
                        ★
                      </div>
                      {/* Small star accent in dark blue */}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <div className="">
            {categories.map((category) => {
              const categoryProducts = groupedProducts[category.name];
              if (categoryProducts.length === 0) return null;
              return (
                <section key={category.id} className="py-16 px-6 bg-[url('/bg-23.jpg')] bg-cover bg-center bg-no-repeat relative">
                  {/* Relative positioning for overlay */}
                  {/* <div className="absolute inset-0 bg-black/ 10"></div> */}
                  {/* 10% black overlay */}
                  <div className="max-w-7xl mx-auto relative z-10">
                    {/* Z-index 10 to keep content above overlay */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                      <div>
                        <h2 className="text-4xl font-extrabold text-[#1A2A44] mb-2" style={{ textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF' }}>
                          {category.name}
                        </h2>
                        {/* Dark blue for section headings with white text border */}
                        <p className="text-[#1A2A44] text-xl italic" style={{ textShadow: '-1px -1px 0 #FFFFFF, 1px -1px 0 #FFFFFF, -1px 1px 0 #FFFFFF, 1px 1px 0 #FFFFFF' }}>
                          {category.description}
                        </p>
                        {/* Dark blue for description with white text border */}
                      </div>
                      <Link
                        href={`/${category.name
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                      >
                        <Button className="mt-4 md:mt-0 py-5 border-white border-[1px] bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full relative z-30 cursor-pointer">
                          View All {category.name}
                        </Button>
                        {/* Dark blue button with white text, darkening on hover */}
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {categoryProducts.map((product, i) => (
                        <ProductCard product={product} key={i} />
                      ))}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>


          <section className="py-16 px-6 bg-[url('/bg-8.png')] bg-cover bg-center bg-no-repeat">
            {/* Consistent gradient for footer section */}
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="p-8 text-center bg-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg rounded-xl">
                  <Truck className="h-12 w-12 mx-auto mb-4 text-[#1A2A44]" />
                  {/* Dark blue icons */}
                  <h3 className="font-semibold text-[#1A2A44] mb-2">
                    Free Shipping
                  </h3>
                  <p className="text-[#1A2A44] text-sm">
                    On all orders over ₹1000
                  </p>
                </Card>
                <Card className="p-8 text-center bg-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg rounded-xl">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 text-[#1A2A44]" />
                  <h3 className="font-semibold text-[#1A2A44] mb-2">
                    Easy Returns
                  </h3>
                  <p className="text-[#1A2A44] text-sm">30-day return policy</p>
                </Card>
                <Card className="p-8 text-center bg-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg rounded-xl">
                  <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-[#1A2A44]" />
                  <h3 className="font-semibold text-[#1A2A44] mb-2">
                    Secure Payment
                  </h3>
                  <p className="text-[#1A2A44] text-sm">
                    Protected by encryption
                  </p>
                </Card>
                <Card className="p-8 text-center bg-[#FFFFFF] border border-[#D3D3D3] hover:shadow-lg rounded-xl">
                  <Gift className="h-12 w-12 mx-auto mb-4 text-[#1A2A44]" />
                  <h3 className="font-semibold text-[#1A2A44] mb-2">
                    Gift Cards
                  </h3>
                  <p className="text-[#1A2A44] text-sm">
                    Perfect for any occasion
                  </p>
                </Card>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default MainComponent;