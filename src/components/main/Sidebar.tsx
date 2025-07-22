"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  LayoutDashboard,
  Plus,
  Shirt,
  ShoppingCart,
  Trash,
} from "lucide-react";
import { useCart } from "@/providers/cartProvider";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/authProvider";
import Image from "next/image";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { cartCount, favoritesCount } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) toggleSidebar();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        toggleSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const categories = [
    {
      name: "Indo Western Kurti",
      link: "/indo-westerns",
      img:'https://i.pinimg.com/736x/6e/4a/81/6e4a818682a089e577cfae69b3d470cf.jpg',
      icon: <LayoutDashboard className="h-4 w-4 mr-3" />,
    },
    {
      name: "Tops",
      link: "/tops",
      img:"https://i.pinimg.com/736x/5f/86/16/5f86163ce9bdfd8b8e16b3aa2fb808e1.jpg",
      icon: <Shirt className="h-4 w-4 mr-3" />,
      isNew: true,
    },
    {
      name: "Shirts",
      link: "/shirts",
      img:"https://i.pinimg.com/736x/54/79/16/5479168e33834b10b448ea856f0b1ac3.jpg",
      icon: <Shirt className="h-4 w-4 mr-3" />,
      isNew: true,
    },
    // { name: "Saree", link: "/saree", icon: <Shirt className="h-4 w-4 mr-3" /> },
    // { name: "Kurti", link: "/kurti", icon: <Shirt className="h-4 w-4 mr-3" /> },
    // {
    //   name: "Lehenga",
    //   link: "/lehenga",
    //   icon: <Shirt className="h-4 w-4 mr-3" />,
    // },
    // {
    //   name: "Ethnic Sets",
    //   link: "/ethnic-sets",
    //   icon: <Shirt className="h-4 w-4 mr-3" />,
    // },
    // {
    //   name: "Nightwear",
    //   link: "/nightwear",
    //   icon: <Shirt className="h-4 w-4 mr-3" />,
    // },
    // {
    //   name: "Co-Ord Sets",
    //   link: "/co-ord-sets",
    //   icon: <Shirt className="h-4 w-4 mr-3" />,
    // },
    // {
    //   name: "Kaftans",
    //   link: "/kaftans",
    //   icon: <Shirt className="h-4 w-4 mr-3" />,
    // },
  ];

  const quickLinks = [
    {
      name: "Favorites",
      icon: <Heart className="h-4 w-4 mr-2" />,
      count: favoritesCount,
      onClick: () => router.push("/favourites"),
    },
    {
      name: "My Cart",
      icon: <ShoppingCart className="h-4 w-4 mr-2" />,
      count: cartCount,
      onClick: () => router.push("/cart"),
    },
    {
      name: "Orders",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      onClick: () => router.push("/orders"),
    },
  ];

  const allowedEmails =
    process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];
  const adminPanel = [
    {
      name: "Users",
      icon: <Plus className="h-4 w-4 mr-2" />,
      link: "/users",
    },

    {
      name: "Add Product",
      icon: <Plus className="h-4 w-4 mr-2" />,
      link: "/add-product",
    },
    {
      name: "All Product",
      icon: <Trash className="h-4 w-4 mr-2" />,
      link: "/all-product",
    },
  ];

  return (
    <aside
            ref={sidebarRef}
            className={` fixed top-0 left-0 h-screen w-64  bg-[url('/bg-15.jpg')] bg-cover bg-center bg-no-repeat  z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block font-sans`}
    >
            {/* Close button for mobile */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-[#1A2A44] hover:text-[#14263A] md:hidden"
            >
                <span className="text-2xl">×</span>
            </button>

            <div className="h-full flex flex-col overflow-y-auto custom-scrollbar relative z-30">
                {/* Logo */}
                <Link href="/">
                    <div className="px-4  md:py-[8px] flex items-center justify-start transition-transform duration-200 group-hover:scale-105 bg-gradient-to-b from-blue-300 to-white py-[15px] z-20 relative">
                        <div className="flex items-center gap-3 group">
                            <Image
                                src="/logo.jpg"
                                alt="OYE BABY"
                                width={60}
                                height={50}
                                className="object-contain  drop-shadow-md transition-transform duration-200 group-hover:scale-105 rounded-xl border-2 border-[#1A2A44]"
                            />
                            <div className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#1A2A44] mb-2 transition-transform duration-200 group-hover:scale-105">
                                OYE BABY
                            </div>
                        </div>
                    </div>
                </Link>
                <Separator />

                {/* Explore */}
                {allowedEmails.includes(user?.email || "") && (
                    <div className="px-6 pt-4">
                        <h2 className="font-semibold text-xl tracking-tight text-[#1A2A44]">
                            Admin Panel
                        </h2>
                    </div>
                )}

                {allowedEmails.includes(user?.email || "") && (
                    <div className="space-y-1 p-2 ml-3">
                        {adminPanel.map((category) => (
                            <Link
                                key={category.name}
                                href={category.link}
                                className={buttonVariants({
                                    variant: "ghost",
                                    className:
                                        "w-full flex justify-start font-medium text-sm gap-3 my-1 text-[#1A2A44] hover:bg-[#E6F0FA] rounded-lg transition-all duration-200",
                                })}
                            >
                                <p className="">{category.name}</p>
                            </Link>
                        ))}
                    </div>
                )}
                {!allowedEmails.includes(user?.email || "") && (
                    <div className="px-6 pt-4">
                        <h2 className="font-semibold text-xl text-[#1A2A44] tracking-wide">Explore</h2>
                    </div>
                )}

                {!allowedEmails.includes(user?.email || "") && (
                    <div className="space-y-1 p-2 ml-3 my-3">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                href={category.link}
                                className={buttonVariants({
                                    variant: "ghost",
                                    className:
                                        "w-full flex justify-start items-center text-sm font-medium text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A] rounded-lg py-5 px-3 transition-all duration-200 group",
                                })}
                            >
                                <img
                                    src={category.img || ""}
                                    alt={category.name}
                                    className="w-6 h-6 object-cover rounded-full mr-3 group-hover:scale-110 transition-transform duration-200 border border-[#1A2A44]"
                                />
                                <p className="">{category.name}</p>
                                {category?.isNew && (
                                    <Badge
                                        variant="secondary"
                                        className="ml-auto bg-[#E6F0FA] text-[#1A2A44] text-xs font-medium"
                                    >
                                        New
                                    </Badge>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
                {/* Quick Access */}
                {!allowedEmails.includes(user?.email || "") && (
                    <div className="px-4 pt-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-2 text-[#1A2A44]">
                            Quick Access
                        </h3>
                        <div className="space-y-1 ml-3">
                            {quickLinks.map((link) => (
                                <Button
                                    key={link.name}
                                    variant="ghost"
                                    className="w-full justify-start items-center text-sm font-medium text-[#1A2A44] hover:bg-[#E6F0FA] hover:text-[#14263A] rounded-lg py-3 px-3 transition-all duration-200"
                                    onClick={link.onClick}
                                >
                                    {link.icon}
                                    {link.name}
                                    {link.count ? (
                                        <Badge className="ml-auto bg-[#1A2A44] text-[#FFFFFF] text-xs font-medium">
                                            {link.count}
                                        </Badge>
                                    ) : null}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
  );
};

export default Sidebar;
