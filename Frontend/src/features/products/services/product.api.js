import axios from "axios";


const productApiInstance = axios.create({
    baseURL: "/api/products",
    withCredentials: true
});


export async function createProduct(formData){
    try {
        const response = await productApiInstance.post("/create", formData,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
}

export async function getProducts(){
    try {
        const response = await productApiInstance.get("/seller");
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export async function getAllProducts(){
    try {
        const response = await productApiInstance.get("/");
        return response.data;
    }catch (error) {
        console.error("Error fetching all products:", error);
        throw error;
    }
}
export async function getProductById(_id){
    try {
        const response = await productApiInstance.get(`/${_id}`);
        return response.data;
    }catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}


export async function getProductVariants(productId){
    try {
        const response = await productApiInstance.get(`/${productId}/variants`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product variants:", error);
        throw error;
    }
}

export async function updateProduct(_id, productData){
    try {
        const response = await productApiInstance.patch(`/${_id}`, productData);
        return response.data;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
}
export async function deleteProduct(_id){
    try {
        const id = typeof _id === "object" ? _id._id : _id;

        console.log("API DELETE ID:", id);

        const response = await productApiInstance.delete(`/${id}`);
        return response.data;

    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}
export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    if (newProductVariant.images && Array.isArray(newProductVariant.images)) {
        newProductVariant.images.forEach((image) => {
            formData.append(`images`, image.file || image)
        })
    }

    formData.append("stock", newProductVariant.stock)
    if (newProductVariant.price) {
        formData.append("priceAmount", newProductVariant.price.amount)
        formData.append("priceCurrency", newProductVariant.price.currency)
    }
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)

    return response.data
}

export async function updateProductVariant(productId, variantId, variantData){
    try {
        const response = await productApiInstance.patch(`/${productId}/variants/${variantId}`, variantData);
        return response.data;
    } catch (error) {
        console.error("Error updating product variant:", error);
        throw error;
    }
}

export async function deleteProductVariant(productId, variantId){
    try {
        const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting product variant:", error);
        throw error;
    }
}

export async function searchProducts(query){
    try {
        const response = await productApiInstance.get(`/search?q=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}
