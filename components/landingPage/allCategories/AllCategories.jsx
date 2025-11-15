import React from "react";
import CategoryProductsClient from "./CategoryProductsClient";

// Fetch products with revalidation
async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      next: {
        revalidate: 300, // 5 minutes
        tags: ['products']
      },
    });

    if (!res.ok) throw new Error('Failed to fetch products');

    const data = await res.json();
    return data?.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch categories with revalidation
async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      next: {
        revalidate: 600, // 10 minutes (categories change less frequently)
        tags: ['categories']
      },
    });

    if (!res.ok) throw new Error('Failed to fetch categories');

    const data = await res.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Build a map from categoryId -> products, sort each bucket, attach top `limit`
function organizeProductsByCategory(categories, products, limit = 8) {
  if (!Array.isArray(categories) || !Array.isArray(products)) return [];

  // Group products by category id
  const map = new Map();
  for (const p of products) {
    if (!p) continue;
    const key = p.category;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  // For each category, sort its bucket once and take top `limit`
  return categories
    .map(cat => {
      const bucket = map.get(cat?._id) || [];
      bucket.sort((a, b) => {
        const ta = new Date(a?.createdAt || 0).getTime();
        const tb = new Date(b?.createdAt || 0).getTime();
        return tb - ta;
      });
      return { ...cat, products: bucket.slice(0, limit) };
    })
    .filter(cat => cat.products.length > 0);
}

export default async function CategoryProducts() {
  // Parallel data fetching for better performance
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // Return null if no data
  if (!categories.length || !products.length) {
    return null;
  }

  // Organize data on server
  const categoriesWithProducts = organizeProductsByCategory(categories, products);

  // Return null if no products in any category
  if (!categoriesWithProducts.length) {
    return null;
  }

  return <CategoryProductsClient categoriesWithProducts={categoriesWithProducts} />;
}