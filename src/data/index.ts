// data.ts

// Color interface
export interface Color {
    name: string;
    value: string; // Hex code or color name
}

// Category interface
export interface Category {
    id: string;
    name: string;
    description: string;
    image: string;
}
export interface AdminPanel {
    id: string;
    name: string;
    description: string;
    image: string;
}

// Collection interface
export interface Collection {
    id: string;
    name: string;
    description: string;
    image: string;
}

// SubCategory interface
export interface SubCategory {
    id: string;
    name: string;
    description: string;
    image: string;
}

// Product interface
export interface Product {
    id: string;
    title: string;
    description: string;
    images: string[]; // Array of image links
    colors: Color[];
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
    quantity?:number;
}

// Categories Data
export const categories: Category[] = [
  {
    id: "cat1",
    name: "Indo Westerns",
    description: "Chic western outfits for the modern woman—perfect for casual and party wear.",
    image: "https://i.pinimg.com/736x/6e/4a/81/6e4a818682a089e577cfae69b3d470cf.jpg",
  },
  {
    id: "cat2",
    name: "Tops",
    description: "Graceful and timeless sarees designed for elegance and tradition.",
    image: "https://i.pinimg.com/736x/5f/86/16/5f86163ce9bdfd8b8e16b3aa2fb808e1.jpg",
  },
  {
    id: "cat3",
    name: "Shirts",
    description: "Comfortable and stylish kurtis for daily wear, office, or outings.",
    image: "https://i.pinimg.com/736x/54/79/16/5479168e33834b10b448ea856f0b1ac3.jpg",
  },
//   {
//     id: "cat4",
//     name: "Lehenga",
//     description: "Dazzling lehengas perfect for weddings, festivals, and grand occasions.",
//     image: "/api/placeholder/400/200",
//   },
//   {
//     id: "cat8",
//     name: "Ethnic Sets",
//     description: "Beautifully coordinated ethnic sets for festive and family occasions.",
//     image: "/api/placeholder/400/200",
//   },
//   {
//     id: "cat10",
//     name: "Co-Ord Sets",
//     description: "Stylish and matching co-ord sets for that sleek, ready-to-go look.",
//     image: "/api/placeholder/400/200",
//   },
//   {
//     id: "cat12",
//     name: "Kaftans",
//     description: "Soft and cozy nightwear designed for comfort and style at home.",
//     image: "/api/placeholder/400/200",
//   },
//   {
//     id: "cat13",
//     name: "Nightwear",
//     description: "Soft and cozy nightwear designed for comfort and style at home.",
//     image: "/api/placeholder/400/200",
//   }
  
];
export const admin: AdminPanel[] = [
  {
    id: "cat1",
    name: "Users",
    description: "Chic western outfits for the modern woman—perfect for casual and party wear.",
    image: "/api/placeholder/400/200",
  },
  {
    id: "cat2",
    name: "Users Orders",
    description: "Graceful and timeless sarees designed for elegance and tradition.",
    image: "/api/placeholder/400/200",
  },
  {
    id: "cat3",
    name: "Add Product",
    description: "Comfortable and stylish kurtis for daily wear, office, or outings.",
    image: "/api/placeholder/400/200",
  },
  {
    id: "cat4",
    name: "All Product",
    description: "Dazzling lehengas perfect for weddings, festivals, and grand occasions.",
    image: "/api/placeholder/400/200",
  },
 
  
];



// Collections Data
export const collections: Collection[] = [
    {
        id: "col1",
        name: "Summer Essentials",
        description: "Light fabrics and vibrant colors for warm days",
        image: "/api/placeholder/400/200",
    },
    {
        id: "col2",
        name: "Workwear Edit",
        description: "Professional styles with modern comfort",
        image: "/api/placeholder/400/200",
    },
    {
        id: "col3",
        name: "Sustainable Collection",
        description: "Eco-friendly materials and ethical production",
        image: "/api/placeholder/400/200",
    },
];

// Products Data
export const products: Product[] = [
    // Products for "New In"
    {
        id: "prod1",
        title: "Floral Print Midi Dress",
        description:
            "Elegant floral midi dress with a flattering silhouette, perfect for both casual and formal occasions.",
        images: ["/api/placeholder/280/320", "/api/placeholder/280/320"],
        colors: [
            { name: "Navy", value: "#000080" },
            { name: "Rose", value: "#FF007F" },
            { name: "Cream", value: "#FFFDD0" },
        ],
        tags: ["new", "floral", "midi", "summer"],
        priceBeforeDiscount: 89.99,
        discount: '0',
        category: { id: "cat1", name: "New In" },
        ratings: 4.8,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub1",
                name: "Midi Dresses",
                description: "Mid-length dresses for versatile styling",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod2",
        title: "Eco-Friendly Tote Bag",
        description: "Spacious tote bag made from recycled materials",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Natural", value: "#F5F5DC" },
            { name: "Black", value: "#000000" },
        ],
        tags: ["new", "eco-friendly", "tote"],
        priceBeforeDiscount: 39.99,
        discount: '0',
        category: { id: "cat1", name: "New In" },
        ratings: 4.7,
        collection: { id: "col3", name: "Sustainable Collection" },
        subCategories: [
            {
                id: "sub2",
                name: "Bags",
                description: "Functional and stylish bags",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Products for "Clothing"
    {
        id: "prod3",
        title: "Classic White Shirt",
        description: "Timeless white shirt made from premium cotton",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Light Blue", value: "#ADD8E6" },
        ],
        tags: ["classic", "shirt", "cotton"],
        priceBeforeDiscount: 59.99,
        discount: "10% OFF",
        category: { id: "cat2", name: "Clothing" },
        ratings: 4.5,
        collection: { id: "col2", name: "Workwear Edit" },
        subCategories: [
            {
                id: "sub3",
                name: "Shirts",
                description: "Versatile shirts for any occasion",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod4",
        title: "Denim Jacket",
        description: "Classic denim jacket with a modern fit",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Blue", value: "#0000FF" },
            { name: "Black", value: "#000000" },
        ],
        tags: ["denim", "jacket", "casual"],
        priceBeforeDiscount: 79.99,
        discount: '0',
        category: { id: "cat2", name: "Clothing" },
        ratings: 4.4,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub4",
                name: "Jackets",
                description: "Stylish jackets for all seasons",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Products for "Shoes"
    {
        id: "prod5",
        title: "Leather Loafers",
        description: "Comfortable leather loafers with a modern twist",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Brown", value: "#8B4513" },
        ],
        tags: ["loafers", "leather", "comfort"],
        priceBeforeDiscount: 99.99,
        discount: '0',
        category: { id: "cat3", name: "Shoes" },
        ratings: 4.8,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub5",
                name: "Loafers",
                description: "Casual and comfortable loafers",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod6",
        title: "Running Sneakers",
        description: "Lightweight sneakers designed for optimal performance",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Gray", value: "#808080" },
        ],
        tags: ["sneakers", "running", "performance"],
        priceBeforeDiscount: 89.99,
        discount: "20% OFF",
        category: { id: "cat3", name: "Shoes" },
        ratings: 4.7,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub6",
                name: "Sneakers",
                description: "Comfortable and stylish sneakers",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Products for "Accessories"
    {
        id: "prod7",
        title: "Silk Scarf",
        description: "Luxurious silk scarf with a vibrant print",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Floral", value: "#FF69B4" },
            { name: "Geometric", value: "#00CED1" },
        ],
        tags: ["scarf", "silk", "accessory"],
        priceBeforeDiscount: 49.99,
        discount: '0',
        category: { id: "cat4", name: "Accessories" },
        ratings: 4.6,
        collection: { id: "col3", name: "Sustainable Collection" },
        subCategories: [
            {
                id: "sub7",
                name: "Scarves",
                description: "Stylish scarves for any season",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod8",
        title: "Leather Wallet",
        description: "Compact leather wallet with multiple card slots",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Brown", value: "#8B4513" },
        ],
        tags: ["wallet", "leather", "accessory"],
        priceBeforeDiscount: 34.99,
        discount: '0',
        category: { id: "cat4", name: "Accessories" },
        ratings: 4.5,
        collection: { id: "col2", name: "Workwear Edit" },
        subCategories: [
            {
                id: "sub8",
                name: "Wallets",
                description: "Functional and stylish wallets",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Products for "Activewear"
    {
        id: "prod9",
        title: "Performance Leggings",
        description: "High-performance leggings with moisture-wicking fabric",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Black", value: "#000000" },
            { name: "Navy", value: "#000080" },
        ],
        tags: ["activewear", "leggings", "performance"],
        priceBeforeDiscount: 69.99,
        discount: "15% OFF",
        category: { id: "cat5", name: "Activewear" },
        ratings: 4.9,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub9",
                name: "Leggings",
                description: "Comfortable and functional leggings",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod10",
        title: "Breathable Tank Top",
        description: "Lightweight tank top perfect for workouts",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Gray", value: "#808080" },
            { name: "White", value: "#FFFFFF" },
        ],
        tags: ["activewear", "tank", "breathable"],
        priceBeforeDiscount: 29.99,
        discount: '0',
        category: { id: "cat5", name: "Activewear" },
        ratings: 4.6,
        collection: { id: "col1", name: "Summer Essentials" },
        subCategories: [
            {
                id: "sub10",
                name: "Tops",
                description: "Performance tops for active lifestyles",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Products for "Gifts & Living"
    {
        id: "prod11",
        title: "Aromatherapy Candle Set",
        description: "Set of three scented candles for a relaxing atmosphere",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Lavender", value: "#E6E6FA" },
            { name: "Vanilla", value: "#F3E5AB" },
            { name: "Sandalwood", value: "#DEB887" },
        ],
        tags: ["gifts", "candles", "home"],
        priceBeforeDiscount: 29.99,
        discount: '0',
        category: { id: "cat6", name: "Gifts & Living" },
        ratings: 4.7,
        collection: { id: "col2", name: "Workwear Edit" },
        subCategories: [
            {
                id: "sub11",
                name: "Home Decor",
                description: "Beautiful items to enhance your living space",
                image: "/api/placeholder/200/200",
            },
        ],
    },
    {
        id: "prod12",
        title: "Ceramic Mug",
        description: "Handcrafted ceramic mug with a minimalist design",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "White", value: "#FFFFFF" },
            { name: "Blue", value: "#0000FF" },
        ],
        tags: ["gifts", "mug", "home"],
        priceBeforeDiscount: 19.99,
        discount: "10% OFF",
        category: { id: "cat6", name: "Gifts & Living" },
        ratings: 4.5,
        collection: { id: "col3", name: "Sustainable Collection" },
        subCategories: [
            {
                id: "sub12",
                name: "Kitchenware",
                description: "Unique and practical kitchen items",
                image: "/api/placeholder/200/200",
            },
        ],
    },

    // Optional Product for "Inspiration" (if products are desired)
    {
        id: "prod13",
        title: "DIY Craft Kit",
        description: "Complete kit for creating your own inspired designs",
        images: ["/api/placeholder/280/320"],
        colors: [
            { name: "Multi", value: "#FFFFFF" }, // Represents assorted colors
        ],
        tags: ["diy", "craft", "inspiration"],
        priceBeforeDiscount: 24.99,
        discount: '0',
        category: { id: "cat7", name: "Inspiration" },
        ratings: 4.3,
        collection: { id: "col3", name: "Sustainable Collection" },
        subCategories: [
            {
                id: "sub13",
                name: "Craft Kits",
                description: "Inspirational DIY projects",
                image: "/api/placeholder/200/200",
            },
        ],
    },
];
