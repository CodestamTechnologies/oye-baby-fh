"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cartProvider";
import { Heart } from "lucide-react";

const FavoritesPage = () => {
    const { favorites } = useCart();

    return (
        <div className="flex flex-col min-h-screen bg-[url('/bg-17.png')] bg-cover bg-center bg-no-repeat relative">
                {/* <div className="absolute inset-0 bg-black/10"></div> */}

            <section className="py-16 px-6 relative">
                {/* 10% black overlay to tone down the background image */}
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Z-index to keep content above overlay */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <div className=" p-2 rounded-lg">
                            {/* Added white background with 80% opacity for contrast */}
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A44] mb-3 tracking-tight">
                                My Favorites
                            </h2>
                            <p className="text-[#666666] text-lg">
                                Your collection of loved items
                            </p>
                        </div>
                        <Button
                            className="mt-4 md:mt-0 bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 border-white border-[1px] py-5 relative z-30 cursor-pointer "
                            onClick={() => window.history.back()}
                        >
                            Back to Shopping
                        </Button>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="text-center py-12 bg-white/80 rounded-xl shadow-lg border border-[#D3D3D3]">
                            {/* Adjusted background to 80% opacity white */}
                            <Heart className="h-16 w-16 text-[#1A2A44] mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-[#1A2A44] mb-2">
                                Your favorites list is empty
                            </h3>
                            <p className="text-[#666666] mb-6">
                                Add items to your favorites to save them for later
                            </p>
                            <Button
                                className="bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 py-3"
                                onClick={() => window.location.href = "/"}
                            >
                                Discover Products
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {favorites?.map((product, i) => (
                                <ProductCard
                                    key={product.id + i}
                                    product={product}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default FavoritesPage;