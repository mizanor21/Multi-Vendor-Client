import CategoryProducts from "@/components/categoryProducts/CategoryProducts";

export default function page({ params }) {
  const [categoryId, subcategoryId, microCategoryId] = params?.slug;
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
