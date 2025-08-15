import { getBrands } from "../../brands/lib/data";
import { getCategories } from "../../categories/lib/data";
import { getLocations } from "../../locations/lib/data";
import { CreateProductForm } from "../_components/product-form";

export default async function CreateProductPage() {

    const categories = await getCategories()
    const brands = await getBrands()
    const locations = await getLocations()


    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground">Create New Product</h1>
                    <p className="text-muted-foreground mt-2">
                        Add a new product to your inventory with all the necessary details.
                    </p>
                </div>
                <CreateProductForm
                    categories={categories}
                    brands={brands}
                    locations={locations}
                />
            </div>
        </div>
    )
}
