"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product, categories, collections } from "@/data";

// Types
interface Color {
    id: string;
    name: string;
    value: string;
}

interface SubCategory {
    id: string;
    name: string;
    description: string;
    image: string;
}

interface ProductsContextType {
    products: Product[];
    colors: Color[];
    subCollections: SubCategory[];
    categories: typeof categories;
    collections: typeof collections;
    addProduct: (product: Omit<Product, "id" | "ratings">) => Promise<void>;
    uploadFile: (file: File) => Promise<string>;
}

// Context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// File upload function
const uploadFile = async (file: File): Promise<string> => {
    const apiKey = "57e5c2617e80c2dd29dc924d41564574";
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    return data.data.url;
};

// Provider Component
export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [subCollections, setSubCollections] = useState<SubCategory[]>([]);

    // Fetch data from Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                
                const productsSnapshot = await getDocs(collection(db, "products"));
               
                const productsData = productsSnapshot.docs.map((doc) => ({
                    
                    ...doc.data(),
                    id: doc.id,

                })) as Product[];

               
                setProducts(productsData);
                // Fetch colors
                const colorsSnapshot = await getDocs(collection(db, "colors"));
                const colorsData = colorsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    value: doc.data().value,
                })) as Color[];
                setColors(colorsData);

                // Fetch sub-collections
                const subCollectionsSnapshot = await getDocs(collection(db, "subCollections"));
                const subCollectionsData = subCollectionsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    description: doc.data().description,
                    image: doc.data().image || "",
                })) as SubCategory[];
                setSubCollections(subCollectionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Add product
    const addProduct = async (product: Omit<Product, "id" | "ratings">) => {
        try {
            const newProduct = { ...product, ratings: 0 };
            const docRef = await addDoc(collection(db, "products"), newProduct);
            setProducts([...products, { id: docRef.id, ...newProduct }]);
        } catch (error) {
            console.error("Error adding product:", error);
            throw error;
        }
    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                colors,
                subCollections,
                categories,
                collections,
                addProduct,
                uploadFile,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};

// Hook to use the context
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
};
