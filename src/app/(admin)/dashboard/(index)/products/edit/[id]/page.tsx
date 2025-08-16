import { notFound } from "next/navigation";
import { getBrands } from "../../../brands/lib/data";
import { getCategories } from "../../../categories/lib/data";
import { getLocations } from "../../../locations/lib/data";
import prisma from "../../../../../../../../lib/prisma";
import { EditProductForm } from "../../_components/product-form";


// Fungsi untuk mengambil product berdasarkan ID
async function getProductById(id: number) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                images: true,
                category_id: true,
                brand_id: true,
                location_id: true,
            },
        });
        return product;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {

    const { id } = await params;
    const productId = Number(id);

    // Validasi ID
    if (isNaN(productId)) {
        notFound();
    }

    // Fetch semua data yang diperlukan
    const [categories, brands, locations, product] = await Promise.all([
        getCategories(),
        getBrands(),
        getLocations(),
        getProductById(productId)
    ]);

    // Jika product tidak ditemukan
    if (!product) {
        notFound();
    }

    // Format data untuk form
    const productData = {
        id: product.id,
        name: product.name,
        description: product.description,
        categoryId: product.category_id,
        brandId: product.brand_id,
        locationId: product.location_id,
        price: typeof product.price === 'bigint' ? Number(product.price) : product.price,
        stock: product.stock,
        images: product.images || [],
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Update Product</h1>
                    <p className="text-muted-foreground mt-2">
                        Update the product in your inventory with all the necessary details.
                    </p>
                </div>
                <EditProductForm
                    categories={categories}
                    brands={brands}
                    locations={locations}
                    initialData={productData}
                />
            </div>
        </div>
    );
}