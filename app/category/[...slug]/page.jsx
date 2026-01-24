import CategoryProducts from "@/components/categoryProducts/CategoryProducts";

export default async function page({ params }) {
  const { slug } = await params;
  const [categoryId, subcategoryId, microCategoryId] = slug || [];
  
  return (
    <div>
      <CategoryProducts
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        microCategoryId={microCategoryId}
      />
    </div>
  );
}