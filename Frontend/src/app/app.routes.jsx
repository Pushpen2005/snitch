import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import GetSellerProduct from "../features/products/pages/GetSellerProduct.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductPage from "../features/products/pages/ProductPage.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import CartPage from "../features/cart/pages/CartPage.jsx";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/product/:id",
                element: <ProductPage />,
            },
            {
                path: "/cart",
                element: <CartPage />,
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/seller/create-product",
                element: (
                    <Protected role="seller">
                        <CreateProduct />
                    </Protected>
                )
            },
            {
                path: "/seller/products",
                element: (
                    <Protected role="seller">
                        <GetSellerProduct />
                    </Protected>
                )
            },
            {
                path: "/seller/product/:id/details",
                element: (
                    <Protected role="seller">
                        <SellerProductDetails />
                    </Protected>
                )
            }
        ]
    }
])
