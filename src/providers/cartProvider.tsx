"use client";

import { CartModal } from "@/components/main/cartDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/data"; // Adjust the import path as necessary
import { Heart, RefreshCw, Star, Truck } from "lucide-react";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  doc,
  setDoc,
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { useAuth } from "./authProvider";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Order } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the shape of a cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define Firestore cart item structure (for serialization)
interface FirestoreCartItem {
  product: Product;
  quantity: number;
}

// Define the context shape
interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  openCartModal: () => void;
  closeCartModal: () => void;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  favorites: Product[];
  favoritesCount: number;
  addToFavorites: (product: Product) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  orders: Order[];
  ordersCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// CartProvider component
interface CartProviderProps {
  children: ReactNode;
}

// Function to calculate discounted price
export const calculateDiscountedPrice = (
  price: number,
  discount: string | null
): number => {
  if (!discount) return price;
  const discountPercentage = parseFloat(discount.replace("% OFF", ""));
  return price - (price * discountPercentage) / 100;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { user, openLoginModal } = useAuth();
  // Calculate total cart and favorites count
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favoritesCount = favorites.length;

  const [orders, setOrders] = useState<Order[]>([]);
  const ordersCount = orders.length;

  // Firestore references
  const getCartRef = () => (user ? doc(db, "carts", user.uid) : null);
  const getFavoritesRef = () => (user ? doc(db, "favorites", user.uid) : null);
  const getOrdersRef = () => {
    if (!user) return null;
    return query(
      collection(db, "orders"),
      where("email", "==", user.email),
      orderBy("createdAt", "desc")
    );
  };

  // Sync cart with Firestore
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setFavorites([]);
      return;
    }

    const cartRef = getCartRef();
    const favoritesRef = getFavoritesRef();
    if (!cartRef || !favoritesRef) return;

    // Sync cart
    const unsubscribeCart = onSnapshot(
      cartRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as { items: FirestoreCartItem[] };
          setCartItems(data.items || []);
        } else {
          setCartItems([]);
        }
      },
      (error) => {
        console.error("Error syncing cart from Firestore:", error);
      }
    );

    // Sync favorites
    const unsubscribeFavorites = onSnapshot(
      favoritesRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as { items: Product[] };
          setFavorites(data.items || []);
        } else {
          setFavorites([]);
        }
      },
      (error) => {
        console.error("Error syncing favorites from Firestore:", error);
      }
    );

    const ordersRef = getOrdersRef();
    if (!ordersRef) return;

    // Sync orders collection in real time
    const unsubscribeOrders = onSnapshot(
      ordersRef,
      (querySnapshot) => {
        const ordersData: Order[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Order),
        }));
        setOrders(ordersData);
      },
      (error) => {
        console.error("Error syncing orders from Firestore:", error);
      }
    );

    return () => {
      unsubscribeCart();
      unsubscribeFavorites();
      unsubscribeOrders();
    };
  }, [user]);

  // Save cart to Firestore
  const saveCartToFirestore = async (items: CartItem[]) => {
    const cartRef = getCartRef();
    if (!cartRef) return;

    try {
      await setDoc(cartRef, { items }, { merge: true });
    } catch (error) {
      console.error("Error saving cart to Firestore:", error);
    }
  };

  // Save favorites to Firestore
  const saveFavoritesToFirestore = async (items: Product[]) => {
    const favoritesRef = getFavoritesRef();
    if (!favoritesRef) return;

    try {
      await setDoc(favoritesRef, { items }, { merge: true });
    } catch (error) {
      console.error("Error saving favorites to Firestore:", error);
    }
  };

  // Function to add a product to the cart
  const addToCart = async (product: Product) => {
    if (!user) {
      console.warn("User must be logged in to add to cart.");
      toast.error("Please log in to add items to your cart.", {
        action: {
          label: "Login",
          onClick: () => openLoginModal(),
        },
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id
      );
      let newItems;
      if (existingItem) {
        newItems = prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

      } else {
        newItems = [...prevItems, { product, quantity: 1 }];
      }

      saveCartToFirestore(newItems);
      return newItems;
    });
  };

  // Function to remove a product from the cart
  const removeFromCart = async (productId: string) => {
    if (!user) return;

    setCartItems((prevItems) => {
      const newItems = prevItems.filter(
        (item) => item.product.id !== productId
      );

      saveCartToFirestore(newItems);
        toast.success("item removed from cart")

      return newItems;
    });
  };

  // Function to update the quantity of a product
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (!user) return;

    setCartItems((prevItems) => {
      if (newQuantity < 1) {
        const newItems = prevItems.filter(
          (item) => item.product.id !== productId
        );
        saveCartToFirestore(newItems);
        return newItems;
      }
      const newItems = prevItems.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
      saveCartToFirestore(newItems);
      return newItems;
    });
  };

  // Function to clear the cart
  const clearCart = async () => {
    if (!user) return;

    setCartItems([]);
    saveCartToFirestore([]);
  };

  // Function to add a product to favorites
  const addToFavorites = async (product: Product) => {
    if (!user) {
      console.warn("User must be logged in to add to favorites.");
      toast.error("Please log in to add items to your favourite.", {
        action: {
          label: "Login",
          onClick: () => openLoginModal(),
        },
      });
      return;
    }
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((item) => item.id === product.id)) {
        return prevFavorites; // Already in favorites
      }
      const newFavorites = [...prevFavorites, product];
      saveFavoritesToFirestore(newFavorites);
      return newFavorites;
    });
  };

  // Function to remove a product from favorites
  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.filter(
        (item) => item.id !== productId
      );
      saveFavoritesToFirestore(newFavorites);
      return newFavorites;
    });
  };
const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  // Function to open the quick view modal
  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  // Function to close the quick view modal
  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  // Function to open the cart modal
  const openCartModal = () => {
    setIsCartModalOpen(true);
  };

  // Function to close the cart modal
  const closeCartModal = () => {
    setIsCartModalOpen(false);
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQuickView(); // Call your close function
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Quick View Modal component

  const QuickViewModal = () => {
  return (
    <Dialog open={!!quickViewProduct} onOpenChange={closeQuickView} >
      <DialogContent className=" min-w-[70vw] max-h-[90vh] overflow-auto p-4 md:p-6">
        {quickViewProduct  &&  (
          <>
            <DialogHeader className="flex justify-between items-center">
              <DialogTitle className="text-xl font-semibold">
                {quickViewProduct.title}
              </DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Left: Image */}
              <div>
                <img
                  src={quickViewProduct.images[0]}
                  alt={quickViewProduct.title}
                  className="w-full h-auto object-cover rounded-md"
                />
              </div>

              {/* Right: Product Info */}
              <div>
                <Badge className="mb-2">{quickViewProduct.category.name}</Badge>
                <h2 className="text-2xl font-serif font-medium mb-2">
                  {quickViewProduct.title}
                </h2>

                <div className="flex items-center mb-4">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm ml-1">
                    {quickViewProduct.ratings}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">
                  {quickViewProduct.description}
                </p>

                {/* Pricing */}
                <div className="flex items-center mb-6">
                  <span className="text-xl font-medium">
                    ₹
                    {quickViewProduct.discount
                      ? calculateDiscountedPrice(
                          quickViewProduct.priceBeforeDiscount,
                          quickViewProduct.discount
                        ).toFixed(2)
                      : quickViewProduct.priceBeforeDiscount.toFixed(2)}
                  </span>
                  {quickViewProduct.discount && (
                    <>
                      <span className="text-gray-400 line-through text-base ml-2">
                        ₹{quickViewProduct.priceBeforeDiscount.toFixed(2)}
                      </span>
                      <Badge className="ml-2 bg-rose-100 text-rose-800">
                        {quickViewProduct.discount}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Colors */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Colors</h3>
                  <div className="flex gap-2">
                    {quickViewProduct.colors.map((color, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="border-2 hover:bg-gray-50"
                      >
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Subcategories */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Subcategories</h3>
                  <div className="flex gap-2">
                    {quickViewProduct.subCategories.map((sub, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {sub.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Tags</h3>
                  <div className="flex gap-2">
                    {quickViewProduct.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Collection */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Collection</h3>
                  <p className="text-gray-600">
                    {quickViewProduct.collection.name}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 mb-4">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={async () => {
                      await addToCart(quickViewProduct);
                      toast.success("item added to cart")

                    }}
                    // disabled={!user || loading}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="flex gap-2 items-center"
                    onClick={async (e) => {
                      e.stopPropagation();
                      const isFavorited = favorites.some(
                        (fav) => fav.id === quickViewProduct.id
                      );
                      try {
                        if (isFavorited) {
                          await removeFromFavorites(quickViewProduct.id);
                          toast.success("item removed from favourite")

                        } else {
                          await addToFavorites(quickViewProduct);
                          toast.success("item added to favourite")

                        }
                      } catch (err) {
                        console.error("Favorite action failed", err);
                      }
                    }}
                    // disabled={!user || loading}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.some((fav) => fav.id === quickViewProduct.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    {favorites.some((fav) => fav.id === quickViewProduct.id)
                      ? "Remove"
                      : "Save"}
                  </Button>
                </div>

                {/* Shipping Info */}
                <div className="border-t mt-6 pt-4">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};


  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        openQuickView,
        closeQuickView,
        openCartModal,
        closeCartModal,
        updateQuantity,
        favorites,
        favoritesCount,
        addToFavorites,
        removeFromFavorites,
        orders,
        ordersCount,
      }}
    >
      {children}
      <QuickViewModal />
      <CartModal
        isCartModalOpen={isCartModalOpen}
        setIsCartModalOpen={setIsCartModalOpen}
      />
    </CartContext.Provider>
  );
};
