import { useDispatch } from "react-redux";
import { setSellerProducts, setProducts, setLoading, setError } from "../state/product.slice.js";
import {
  createProduct, getProducts, getAllProducts, getProductById,
  updateProduct, deleteProduct, getProductVariants,
  addProductVariant, updateProductVariant, deleteProductVariant,
  searchProducts
} from "../services/product.api.js";

export const useProduct = () => {
    const dispatch = useDispatch();

    async function handleCreateProduct(formData) {
        try {
            dispatch(setLoading(true));
            const data = await createProduct(formData);
            return data.product;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetProducts() {
        try {
            dispatch(setLoading(true));
            const data = await getProducts();
            dispatch(setSellerProducts(data.products));
            return data.products;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetAllProducts() {
        try {
            dispatch(setLoading(true));
            const data = await getAllProducts();
            dispatch(setProducts(data.products));
            return data.products;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetProductById(_id) {
        try {
            dispatch(setLoading(true));
            const data = await getProductById(_id);
            return data.product || data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleUpdateProduct(productId, productData) {
        try {
            dispatch(setLoading(true));
            const data = await updateProduct(productId, productData);
            return data.product;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteProduct(productId) {
        try {
            dispatch(setLoading(true));
            const data = await deleteProduct(productId);
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetProductVariants(productId) {
        try {
            dispatch(setLoading(true));
            const data = await getProductVariants(productId);
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant);
        return data;
    }

    async function handleUpdateProductVariant(productId, variantId, variantData) {
        try {
            dispatch(setLoading(true));
            const data = await updateProductVariant(productId, variantId, variantData);
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleDeleteProductVariant(productId, variantId) {
        try {
            dispatch(setLoading(true));
            const data = await deleteProductVariant(productId, variantId);
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleSearchProducts(query){
        try {
            dispatch(setLoading(true));
            const data = await searchProducts(query);
            return data;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Something went wrong"));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        handleCreateProduct,
        handleGetProducts,
        handleGetAllProducts,
        handleGetProductById,
        handleUpdateProduct,
        handleDeleteProduct,
        handleGetProductVariants,
        handleAddProductVariant,
        handleUpdateProductVariant,
        handleDeleteProductVariant,
        handleSearchProducts
    };
};
