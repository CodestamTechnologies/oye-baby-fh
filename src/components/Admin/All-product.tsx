"use client";

import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/authProvider";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubCategory } from "@/data";
import { Textarea } from "../ui/textarea";
// import { Product } from "@/data";
export interface ProductForEdit {
    id: string;
    title: string;
    description: string;
    images: string[]; // Array of image links
    tags: string[];
    priceBeforeDiscount: number;
    discount: string; // e.g., "25% OFF" or null
    category: {
        id: string;
        name: string;
    };
    ratings: number; // 0-5
    collection: {
        id: string;
        name: string;
    };
    subCategories: SubCategory[];
    quantity?: number;
}
interface ProductWithId extends ProductForEdit {
    docId: string;
}

const AllProduct = () => {
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [productToDelete, setProductToDelete] = useState<ProductWithId | null>(
        null
    );
    const [productToEdit, setProductToEdit] = useState<ProductWithId | null>(
        null
    );
    const [productImageFiles, setProductImageFiles] = useState<FileList | null>(
        null
    );
    const { user } = useAuth();

    const allowedEmails =
        process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];
    const fetchProducts = async () => {
        setIsLoadingData(true);
        try {
            const productsSnapshot = await getDocs(collection(db, "products"));
            const productsData = productsSnapshot.docs.map((doc) => ({
                docId: doc.id,
                ...(doc.data() as ProductForEdit),
            }));
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setErrors((prev) => ({ ...prev, fetch: "Failed to load products" }));
        } finally {
            setIsLoadingData(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);

    if (!allowedEmails.includes(user?.email || "")) {
        return <div>Unauthorized</div>;
    }

    const handleDelete = async (product: ProductWithId) => {
        setIsDeleting(true);
        try {
            await deleteDoc(doc(db, "products", product.docId));
            setProducts(products.filter((p) => p.docId !== product.docId));
            setProductToDelete(null);
            setErrors((prev) => ({ ...prev, delete: "" }));
        } catch (error) {
            console.error("Error deleting product:", error);
            setErrors((prev) => ({ ...prev, delete: "Failed to delete product" }));
        } finally {
            setIsDeleting(false);
        }
    };
    const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setProductImageFiles(e.target.files);
    };
    const uploadFile = async (file: File): Promise<string> => {
        const apiKey = "57e5c2617e80c2dd29dc924d41564574";
        const formData = new FormData();
        formData.append("image", file);
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData,
            }
        );
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        return data.data.url;
    };

    const handleUpdate = async () => {
        if (!productToEdit) return;
        // const imageUrl = productToEdit?.images[0];
        const productImageUrls: string[] = [];
        if (productImageFiles) {
            for (let i = 0; i < productImageFiles.length; i++) {
                const url = await uploadFile(productImageFiles[i]);
                productImageUrls.push(url);
            }
        }
        try {
            const docRef = doc(db, "products", productToEdit.docId);
            await updateDoc(docRef, {
                title: productToEdit.title,
                priceBeforeDiscount: productToEdit.priceBeforeDiscount,
                discount: productToEdit.discount,
                tags: productToEdit.tags,
                description: productToEdit.description || "",
                quantity: productToEdit.quantity || 0,
                images: productImageUrls.length > 0 ? productImageUrls : productToEdit.images,
            });
            fetchProducts();
            setProductToEdit(null);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    if (isLoadingData) {
        return (
            <div className="p-4 max-w-4xl mx-auto text-center">
                Loading products...
            </div>
        );
    }

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
            {errors.fetch && (
                <p className="text-red-500 text-sm mb-4">{errors.fetch}</p>
            )}
            {products.length === 0 ? (
                <p className="text-lg">No products available to manage.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.docId}>
                                <TableCell>
                                    <img
                                        src={product?.images[0] || ""}
                                        alt={product.title}
                                        className="w-[40px]"
                                    />
                                </TableCell>
                                <TableCell>{product.title}</TableCell>
                                <TableCell>Rs. {product.priceBeforeDiscount}</TableCell>
                                <TableCell>{product.discount}%</TableCell>
                                <TableCell>{product.tags.join(", ")}</TableCell>
                                <TableCell className="flex gap-2 items-center justify-center my-3">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => setProductToDelete(product)}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                onClick={() => setProductToEdit({ ...product })}
                                            >
                                                Edit
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="overflow-y-auto h-full py-4">
                                            <DialogHeader>
                                                <DialogTitle>Edit Product</DialogTitle>
                                            </DialogHeader>
                                            {productToEdit && (
                                                <form
                                                    className="space-y-4"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleUpdate();
                                                    }}
                                                >
                                                    <div>
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={productToEdit.title}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    title: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Price</Label>
                                                        <Input
                                                            type="number"
                                                            value={productToEdit.priceBeforeDiscount}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    priceBeforeDiscount: parseFloat(
                                                                        e.target.value
                                                                    ),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Discount (%)</Label>
                                                        <Input
                                                            type="number"
                                                            value={productToEdit?.discount}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    discount: e.target.value,
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Tags (comma separated)</Label>
                                                        <Input
                                                            value={productToEdit.tags.join(", ")}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    tags: e.target.value
                                                                        .split(",")
                                                                        .map((tag) => tag.trim()),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Description</Label>

                                                        <Textarea
                                                            id="description"
                                                            value={productToEdit.description || ""}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    description: e.target.value,
                                                                })
                                                            }
                                                            maxLength={500}
                                                            placeholder="Max 500 characters"
                                                            rows={4}
                                                        />
                                                    </div>
                                            
                                                    <div>
                                                        <Label>Quantity</Label>
                                                        <Input
                                                            type="number"
                                                            value={productToEdit.quantity || 0}
                                                            onChange={(e) =>
                                                                setProductToEdit({
                                                                    ...productToEdit,
                                                                    quantity: parseInt(e.target.value),
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label>Image</Label>
                                                        <div className="mb-4">
                                                            <label
                                                                htmlFor="productImages"
                                                                className="block mb-1 font-medium"
                                                            >
                                                                Upload Product Images:
                                                            </label>
                                                            <Input
                                                                id="productImages"
                                                                type="file"
                                                                multiple
                                                                onChange={handleProductImageChange}
                                                            // disabled={isSubmitting}
                                                            />
                                                            {errors.images && (
                                                                <p className="text-red-500 text-sm">
                                                                    {errors.images}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {productToEdit?.images[0] &&
                                                            typeof productToEdit.images[0] !== "string" ? (
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    productToEdit.images[0]
                                                                )}
                                                                alt="Preview"
                                                                className="mt-2 h-24 rounded"
                                                            />
                                                        ) : productToEdit.images[0] ? (
                                                            <img
                                                                src={productToEdit.images[0]}
                                                                alt="Current"
                                                                className="mt-2 h-24 rounded"
                                                            />
                                                        ) : null}
                                                    </div>

                                                    <Button type="submit">Save Changes</Button>
                                                </form>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {productToDelete && (
                <AlertDialog
                    open={!!productToDelete}
                    onOpenChange={() => setProductToDelete(null)}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete the product &quot;
                                {productToDelete.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleDelete(productToDelete)}
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );
};

export default AllProduct;
