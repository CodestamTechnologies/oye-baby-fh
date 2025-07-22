"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Product, categories, collections } from "@/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/authProvider";

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

const AddProduct = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priceBeforeDiscount, setPriceBeforeDiscount] = useState("");
    const [discount, setDiscount] = useState("");
    const [tags, setTags] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");
    const [productImageFiles, setProductImageFiles] = useState<FileList | null>(null);

    // Colors state
    const [colors, setColors] = useState<Color[]>([]);
    const [dbColors, setDbColors] = useState<Color[]>([]);
    const [colorName, setColorName] = useState("");
    const [colorValue, setColorValue] = useState("#000000");

    // Sub-collections state
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [dbSubCollections, setDbSubCollections] = useState<SubCategory[]>([]);
    const [subCatName, setSubCatName] = useState("");
    const [subCatDescription, setSubCatDescription] = useState("");
    const [subCatImageFile, setSubCatImageFile] = useState<File | null>(null);

    // Loading states
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isAddingColor, setIsAddingColor] = useState(false);
    const [isAddingSubCategory, setIsAddingSubCategory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { user } = useAuth();

    // Fetch colors and sub-collections from Firestore
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingData(true);
            try {
                const colorsSnapshot = await getDocs(collection(db, "colors"));
                const colorsData = colorsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name as string,
                    value: doc.data().value as string,
                }));
                setDbColors(colorsData);

                const subCollectionsSnapshot = await getDocs(collection(db, "subCollections"));
                const subCollectionsData = subCollectionsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name as string,
                    description: doc.data().description as string,
                    image: (doc.data().image as string) || "",
                }));
                setDbSubCollections(subCollectionsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrors((prev) => ({ ...prev, fetch: "Failed to load data" }));
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, []);

    // Validation Functions
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!title) newErrors.title = "Title is required";
        else if (title.length > 50) newErrors.title = "Title must be 50 characters or less";

        if (!description) newErrors.description = "Description is required";
        else if (description.length > 500) newErrors.description = "Description must be 500 characters or less";

        if (!priceBeforeDiscount) newErrors.priceBeforeDiscount = "Price is required";
        else if (!/^\d+(\.\d{1,2})?$/.test(priceBeforeDiscount) || parseFloat(priceBeforeDiscount) <= 0 || parseFloat(priceBeforeDiscount) > 999999.99)
            newErrors.priceBeforeDiscount = "Price must be a positive number up to 999999.99 with max 2 decimals";

        if (discount) {
            if (!/^\d+(\.\d{1,2})?$/.test(discount) || parseFloat(discount) < 0 || parseFloat(discount) > 100)
                newErrors.discount = "Discount must be a number between 0 and 100";
        }

        if (tags) {
            const tagArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
            if (tagArray.length > 5) newErrors.tags = "Maximum 5 tags allowed";
            if (tagArray.some((tag) => tag.length > 20)) newErrors.tags = "Each tag must be 20 characters or less";
        }

        if (!selectedCategory) newErrors.category = "Category is required";
        if (!selectedCollection) newErrors.collection = "Collection is required";

        if (!productImageFiles || productImageFiles.length === 0) newErrors.images = "At least one product image is required";

        if (colors.length === 0) newErrors.colors = "At least one color is required";

        if (subCategories.length === 0) newErrors.subCategories = "At least one sub-collection is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateNewColor = () => {
        if (!colorName) return "Color name is required";
        if (colorName.length > 20) return "Color name must be 20 characters or less";
        return "";
    };

    const validateNewSubCategory = () => {
        if (!subCatName) return "Sub-collection name is required";
        if (subCatName.length > 30) return "Sub-collection name must be 30 characters or less";
        if (!subCatDescription) return "Sub-collection description is required";
        if (subCatDescription.length > 200) return "Sub-collection description must be 200 characters or less";
        return "";
    };

    // Handlers
    const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setProductImageFiles(e.target.files);
    };

    const handleSubCatImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) setSubCatImageFile(e.target.files[0]);
    };

    // Color management
    const handleAddColor = async () => {
        const colorError = validateNewColor();
        if (colorError) {
            setErrors((prev) => ({ ...prev, colorName: colorError }));
            return;
        }
        setIsAddingColor(true);
        try {
            const newColor = { name: colorName.trim(), value: colorValue };
            const docRef = await addDoc(collection(db, "colors"), newColor);
            const updatedColor: Color = { id: docRef.id, ...newColor };
            setDbColors([...dbColors, updatedColor]);
            setColors([...colors, updatedColor]);
            setColorName("");
            setColorValue("#000000");
            setErrors((prev) => ({ ...prev, colorName: "" }));
        } catch (error) {
            console.error("Error adding color:", error);
            setErrors((prev) => ({ ...prev, colorName: "Failed to add color" }));
        } finally {
            setIsAddingColor(false);
        }
    };

    const handleSelectColor = (colorId: string) => {
        const selectedColor = dbColors.find((c) => c.id === colorId);
        if (selectedColor && !colors.some((c) => c.id === selectedColor.id)) {
            setColors([...colors, selectedColor]);
            setErrors((prev) => ({ ...prev, colors: "" }));
        }
    };

    const handleRemoveColor = (index: number) => {
        const newColors = colors.filter((_, i) => i !== index);
        setColors(newColors);
        if (newColors.length === 0) setErrors((prev) => ({ ...prev, colors: "At least one color is required" }));
    };

    // Sub-collection management
    const handleAddSubCategory = async () => {
        const subCatError = validateNewSubCategory();
        if (subCatError) {
            setErrors((prev) => ({ ...prev, subCatName: subCatError }));
            return;
        }
        setIsAddingSubCategory(true);
        try {
            let imageUrl = "";
            if (subCatImageFile) imageUrl = await uploadFile(subCatImageFile);
            const newSubCat = {
                name: subCatName.trim(),
                description: subCatDescription.trim(),
                image: imageUrl,
            };
            const docRef = await addDoc(collection(db, "subCollections"), newSubCat);
            const updatedSubCat: SubCategory = { id: docRef.id, ...newSubCat };
            setDbSubCollections([...dbSubCollections, updatedSubCat]);
            setSubCategories([...subCategories, updatedSubCat]);
            setSubCatName("");
            setSubCatDescription("");
            setSubCatImageFile(null);
            setErrors((prev) => ({ ...prev, subCatName: "", subCategories: "" }));
        } catch (error) {
            console.error("Error adding sub-category:", error);
            setErrors((prev) => ({ ...prev, subCatName: "Failed to add sub-collection" }));
        } finally {
            setIsAddingSubCategory(false);
        }
    };

    const handleSelectSubCategory = (subCatId: string) => {
        const selectedSubCat = dbSubCollections.find((sc) => sc.id === subCatId);
        if (selectedSubCat && !subCategories.some((sc) => sc.id === selectedSubCat.id)) {
            setSubCategories([...subCategories, selectedSubCat]);
            setErrors((prev) => ({ ...prev, subCategories: "" }));
        }
    };

    const handleRemoveSubCategory = (index: number) => {
        const newSubCats = subCategories.filter((_, i) => i !== index);
        setSubCategories(newSubCats);
        if (newSubCats.length === 0) setErrors((prev) => ({ ...prev, subCategories: "At least one sub-collection is required" }));
    };

    // Form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const productImageUrls: string[] = [];
            if (productImageFiles) {
                for (let i = 0; i < productImageFiles.length; i++) {
                    const url = await uploadFile(productImageFiles[i]);
                    productImageUrls.push(url);
                }
            }

            const categoryObj = categories.find((cat) => cat.id === selectedCategory) || { id: "", name: "" };
            const collectionObj = collections.find((col) => col.id === selectedCollection) || { id: "", name: "" };

            const newProduct: Product = {
                id: "",
                title,
                description,
                images: productImageUrls,
                colors,
                tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
                priceBeforeDiscount: parseFloat(priceBeforeDiscount),
                discount: discount,
                category: { id: categoryObj.id, name: categoryObj.name },
                ratings: 0,
                collection: { id: collectionObj.id, name: collectionObj.name },
                subCategories,
            };

            await addDoc(collection(db, "products"), newProduct);
            alert("Product added successfully!");
            setTitle("");
            setDescription("");
            setPriceBeforeDiscount("");
            setDiscount("");
            setTags("");
            setSelectedCategory("");
            setSelectedCollection("");
            setProductImageFiles(null);
            setColors([]);
            setSubCategories([]);
            setColorName("");
            setColorValue("#000000");
            setSubCatName("");
            setSubCatDescription("");
            setSubCatImageFile(null);
            setErrors({});
        } catch (error) {
            console.error("Error adding product:", error);
            alert("There was an error adding your product. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render loading state for initial data fetch
    if (isLoadingData) {
        return (
            <div className="p-4 max-w-4xl mx-auto text-center">
                <p className="text-lg">Loading data...</p>
            </div>
        );
    }

    const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];

    if (!allowedEmails.includes(user?.email || "")) {
        return <div>Unauthorised</div>;
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
            {errors.fetch && <p className="text-red-500 text-sm mb-4">{errors.fetch}</p>}
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-1 font-medium">
                        Title:
                    </label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={50}
                        placeholder="Max 50 characters"
                        disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 font-medium">
                        Description:
                    </label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={500}
                        placeholder="Max 500 characters"
                        rows={4}
                        disabled={isSubmitting}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                {/* Price and Discount */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="priceBeforeDiscount" className="block mb-1 font-medium">
                            Price:
                        </label>
                        <Input
                            id="priceBeforeDiscount"
                            value={priceBeforeDiscount}
                            onChange={(e) => setPriceBeforeDiscount(e.target.value)}
                            placeholder="e.g., ₹999"
                            disabled={isSubmitting}
                        />
                        {errors.priceBeforeDiscount && <p className="text-red-500 text-sm">{errors.priceBeforeDiscount}</p>}
                    </div>
                    <div>
                        <label htmlFor="discount" className="block mb-1 font-medium">
                            Discount (%):
                        </label>
                        <Input
                            id="discount"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="e.g., 10 (0-100)"
                            disabled={isSubmitting}
                        />
                        {errors.discount && <p className="text-red-500 text-sm">{errors.discount}</p>}
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                    <label htmlFor="tags" className="block mb-1 font-medium">
                        Tags (comma separated):
                    </label>
                    <Input
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., new, summer (max 5, 20 chars each)"
                        disabled={isSubmitting}
                    />
                    {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                </div>

                {/* Category and Collection */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block mb-1 font-medium">
                            Category:
                        </label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                    </div>
                    <div>
                        <label htmlFor="collection" className="block mb-1 font-medium">
                            Collection:
                        </label>
                        <Select value={selectedCollection} onValueChange={setSelectedCollection} disabled={isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {collections.map((col) => (
                                    <SelectItem key={col.id} value={col.id}>
                                        {col.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.collection && <p className="text-red-500 text-sm">{errors.collection}</p>}
                    </div>
                </div>

                {/* Product Images */}
                <div className="mb-4">
                    <label htmlFor="productImages" className="block mb-1 font-medium">
                        Upload Product Images:
                    </label>
                    <Input id="productImages" type="file" multiple onChange={handleProductImageChange} disabled={isSubmitting} />
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                </div>

                {/* Colors Section */}
                <fieldset className="mb-4 border p-4">
                    <legend className="font-bold">Colors</legend>
                    <div className="flex gap-4 items-center my-2">
                        <Select onValueChange={handleSelectColor} disabled={isAddingColor || isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Existing Color" />
                            </SelectTrigger>
                            <SelectContent>
                                {dbColors.map((color) => (
                                    <SelectItem key={color.id} value={color.id}>
                                        {color.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>or</span>
                        <Input
                            placeholder="New Color Name"
                            value={colorName}
                            onChange={(e) => setColorName(e.target.value)}
                            maxLength={20}
                            className="w-1/2"
                            disabled={isAddingColor || isSubmitting}
                        />
                        <Input
                            type="color"
                            value={colorValue}
                            onChange={(e) => setColorValue(e.target.value)}
                            className="w-16 p-0"
                            disabled={isAddingColor || isSubmitting}
                        />
                        <Button type="button" onClick={handleAddColor} disabled={isAddingColor || isSubmitting}>
                            {isAddingColor ? "Adding..." : "Add New Color"}
                        </Button>
                    </div>
                    {errors.colorName && <p className="text-red-500 text-sm">{errors.colorName}</p>}
                    {errors.colors && <p className="text-red-500 text-sm">{errors.colors}</p>}
                    {colors.length > 0 && (
                        <ul className="list-disc pl-6 mt-2">
                            {colors.map((color, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    {color.name}
                                    <span
                                        style={{
                                            backgroundColor: color.value,
                                            width: "16px",
                                            height: "16px",
                                            display: "inline-block",
                                            borderRadius: "4px",
                                        }}
                                    ></span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveColor(index)}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </fieldset>

                {/* Sub-Collections Section */}
                <fieldset className="mb-4 border p-4">
                    <legend className="font-bold">Sub-Collections</legend>
                    <div className="mb-2">
                        <Select onValueChange={handleSelectSubCategory} disabled={isAddingSubCategory || isSubmitting}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Existing Sub-Collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {dbSubCollections.map((subCat) => (
                                    <SelectItem key={subCat.id} value={subCat.id}>
                                        {subCat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="my-2 block">or</span>
                        <Input
                            placeholder="New Sub-Collection Name"
                            value={subCatName}
                            onChange={(e) => setSubCatName(e.target.value)}
                            maxLength={30}
                            className="mb-2"
                            disabled={isAddingSubCategory || isSubmitting}
                        />
                        <Textarea
                            placeholder="Sub-Collection Description"
                            value={subCatDescription}
                            onChange={(e) => setSubCatDescription(e.target.value)}
                            maxLength={200}
                            rows={2}
                            className="mb-2"
                            disabled={isAddingSubCategory || isSubmitting}
                        />
                        <Input
                            type="file"
                            onChange={handleSubCatImageChange}
                            className="mb-2"
                            disabled={isAddingSubCategory || isSubmitting}
                        />
                        <Button type="button" onClick={handleAddSubCategory} disabled={isAddingSubCategory || isSubmitting}>
                            {isAddingSubCategory ? "Adding..." : "Add New Sub-Collection"}
                        </Button>
                    </div>
                    {errors.subCatName && <p className="text-red-500 text-sm">{errors.subCatName}</p>}
                    {errors.subCategories && <p className="text-red-500 text-sm">{errors.subCategories}</p>}
                    {subCategories.length > 0 && (
                        <ul className="list-disc pl-6 mt-2">
                            {subCategories.map((subCat, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <strong>{subCat.name}</strong> - {subCat.description}
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleRemoveSubCategory(index)}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </fieldset>

                {/* Submit Button */}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Uploading..." : "Add Product"}
                </Button>
            </form>
        </div>
    );
};

export default AddProduct;
