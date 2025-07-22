"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/data";
import { useCart } from "@/providers/cartProvider";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const [loading, setLoading] = useState(false);
  const {
    addToCart,
    favorites,
    addToFavorites,
    removeFromFavorites,
    openQuickView,
  } = useCart();

  const isFavorite = favorites.some((fav) => fav.id === product?.id);
  const disableFavoriteButton = false;

  const calculateDiscountedPrice = (
    price: number,
    discount: string | null
  ): number => {
    if (!discount) return price;
    const discountPercentage = parseFloat(discount.replace("% OFF", ""));
    return price - (price * discountPercentage) / 100;
  };

  const discountedPrice = calculateDiscountedPrice(
    product?.priceBeforeDiscount,
    product?.discount
  );

  const handleToggleFavorite = async () => {
    setLoading(true);
    if (isFavorite) {
      await removeFromFavorites(product?.id);
      toast.error("item removed to favourite")

    } else {
      await addToFavorites(product);
      toast.success("item added to favourite")

    }
    setLoading(false);
  };

  return (
    <Card className="overflow-hidden group h-full p-0 flex flex-col border-2 border-white  bg-[url('/bg-14.jpg')] bg-cover bg-center bg-no-repeat shadow-black shadow-md rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative">
      {/* Subtle blue-to-white gradient, bigger rounded corners, subtle hover lift */}
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.images?.[0] ?? "/fallback.jpg"}
            alt={product?.title}
            className="w-full h-fit object-contain group-hover:scale-105 transition-transform duration-500 "
          />
        </div>
        {product?.tags?.includes("new") && (
          <Badge className="absolute top-2 left-2 bg-[#E6F0FA] text-[#1A2A44] text-[10px] sm:text-xs">
            New
          </Badge>
        )}
        {product?.discount && (
          <Badge className="absolute top-2 right-2 bg-[#E6F0FA] text-[#1A2A44] text-[10px] sm:text-xs">
            {product?.discount}% OFF
          </Badge>
        )}
        <div className="absolute bottom-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full bg-[#FFFFFF] text-[#1A2A44] shadow-md hover:bg-[#E6F0FA] hover:text-[#14263A] ${isFavorite ? "text-red-500" : ""
              }`}
            onClick={handleToggleFavorite}
            disabled={disableFavoriteButton || loading}
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? "fill-red-500" : ""
                }`}
            />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-[#1A2A44] text-[#FFFFFF] shadow-md hover:bg-[#14263A]"
            onClick={async () => {
                await addToCart(product);
                toast.success("item added to cart")
              }}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute left-1/2 -translate-x-1/2 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-xs sm:text-sm bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] rounded-full"
          onClick={() => openQuickView(product)}
        >
          Quick View
        </Button>
      </div>
      <div className="p-2 sm:p-3 lg:p-4 flex-grow flex flex-col">
        <span className="text-[10px] sm:text-xs text-[#1A2A44] mb-1">
          {product?.category?.name}
        </span>
        <h3 className="font-medium text-sm sm:text-base text-[#1A2A44] mb-1 group-hover:text-[#14263A] transition-colors duration-200 line-clamp-2">
          {product?.title}
        </h3>
        <div className="flex items-center mb-1 sm:mb-2">
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-[#1A2A44] text-[#1A2A44]" />
            <span className="text-[10px] sm:text-xs text-[#1A2A44] ml-1">
              {product?.ratings}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center mb-1 sm:mb-2 gap-1">
          {product?.tags?.map((tag, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="text-[10px] sm:text-xs border-[#1A2A44] text-[#1A2A44]"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center mt-auto">
          <span className="font-medium text-sm sm:text-base text-[#1A2A44]">
            ₹
            {product?.discount
              ? discountedPrice.toFixed(2)
              : product?.priceBeforeDiscount?.toFixed(2)}
          </span>
          {product?.discount && (
            <span className="text-[#1A2A44] line-through text-xs sm:text-sm ml-2">
              ₹{product?.priceBeforeDiscount?.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex gap-1 mt-1 sm:mt-2">
          {product?.colors?.slice(0, 3).map((color, idx) => (
            <span
              key={idx}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-[#1A2A44]"
              style={{ backgroundColor: color.value }}
              title={color?.name}
            />
          ))}
          {product?.colors?.length > 3 && (
            <span className="text-[10px] sm:text-xs text-[#1A2A44]">
              +{product?.colors?.length - 3}
            </span>
          )}
        </div>
        <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-[#1A2A44]">
          Part of: <span className="text-[#1A2A44]">{product?.collection?.name}</span>
        </div>
        <div className="flex items-center justify-between mt-2 sm:mt-3">
          <Button
            variant="secondary"
            size="lg"
            className="md:hidden whitespace-nowrap px-4 group-hover:opacity-100 transition-opacity duration-200 text-xs sm:text-sm bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] rounded-full py-1"
            onClick={() => openQuickView(product)}
          >
            Quick View
          </Button>
          <div className="md:hidden flex gap-4 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="secondary"
              className={`rounded-full bg-[#FFFFFF] text-[#1A2A44] shadow-md hover:bg-[#E6F0FA] hover:text-[#14263A] ${isFavorite ? "text-red-500" : ""
                }`}
              onClick={handleToggleFavorite}
              disabled={disableFavoriteButton || loading}
            >
              <Heart
                className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? "fill-red-500" : ""
                  }`}
              />
            </Button>
            <Button
              size="icon"
              className="rounded-full bg-[#1A2A44] text-[#FFFFFF] shadow-md hover:bg-[#14263A]"
              onClick={async () => {
                await addToCart(product);
                toast.success("item added to cart")
              }}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Small heart and star accents in dark blue */}
    </Card>
  );
};

export default ProductCard;