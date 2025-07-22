"use client";

import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { admin, categories } from "@/data";
import { notFound } from "next/navigation";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/providers/productsProvider";
import { useAuth } from "@/providers/authProvider";
import AddProduct from "@/components/Admin/add-product";
import UserAndOrdersPage from "@/components/Admin/AllUsers";
import AllProduct from "@/components/Admin/All-product";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const router = useRouter();
  const { category: cat } = use(params);
  const { products } = useProducts();
  const { user } = useAuth();

  const allowedEmails =
    process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];

  const decodedSlug = decodeURIComponent(cat);

  const category = categories.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );
  const adminpaneloptions = admin.find(
    (cat) => cat.name.toLowerCase().replace(/\s+/g, "-") === decodedSlug
  );
  if (!category && !adminpaneloptions) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) => product.category.name === category?.name
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-[url('/bg-12.jpg')] bg-cover bg-center bg-no-repeat">
      {/* Category Products Section */}
      {!allowedEmails.includes(user?.email || "") && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl  font-extrabold tracking-tight text-[#1A2A44] mb-2">
                  {category?.name}
                </h2>
                <p className="text-gray-900 text-lg italic">{category?.description}</p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 md:mt-0 bg-[#1A2A44] text-[#FFFFFF] hover:bg-[#14263A] transition-colors duration-200 rounded-full px-6 py-3"
              >
                Back to Home
              </Button>
            </div>

            {/* Only show products for this category */}
            <div className="p-4 sm:p-0 grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts?.map((product, i) => (
                <ProductCard product={product} key={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      {allowedEmails.includes(user?.email || "") && (
        <section className="py-26 px-6 bg-gradient-to-br from-blue-50 to-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif font-semibold text-purple-800 mb-3 tracking-tight">
                  {adminpaneloptions?.name}
                </h2>
                <p className="text-gray-600 text-lg">
                  {adminpaneloptions?.description || "Manage your admin tasks efficiently"}
                </p>
              </div>
              <Button
                onClick={() => router.push("/")}
                className="mt-4 md:mt-0 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                Back to Home
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
              {adminpaneloptions?.name === "Add Product" && <AddProduct />}
              {adminpaneloptions?.name === "All Product" && <AllProduct />}
              {adminpaneloptions?.name === "Users" && <UserAndOrdersPage />}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryPage;