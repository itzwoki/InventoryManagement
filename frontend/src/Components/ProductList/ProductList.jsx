import api from '../api';
import { useEffect, useState } from "react";
import { Box, Notification } from "react-bulma-components";
import CreateProductForm from "../CreateProductForm/CreateProductForm";
import UpdateProduct from "../UpdateProduct/UpdateProduct";
import DeleteProduct from "../DeleteProduct/DeleteProduct";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found. Please log in.");
            }

            const response = await api.get('/inventory/products/', {
                params: { skip: 0, limit: 10 },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error Details:", err);
            if (err.response && err.response.status === 401) {
                setError('Unauthorized. Please log in.');
            } else if (err.response) {
                setError(`Error ${err.response.status}: ${err.response.data.detail || 'Unexpected error'}`);
            } else {
                setError('Network error. Please try again.');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleProductUpdate = () => {
        fetchProducts();
    };

    const handleProductDeleted = (productId) => {
        setProducts(products.filter(product => product.id !== productId));
    };

    if (loading) {
        return <Notification color="info" style={{ textAlign: 'center' }}>Loading Products...</Notification>;
    }
    if (error) {
        return <Notification color="danger" style={{ textAlign: 'center' }}>{error}</Notification>;
    }

    return (
        <Box className="container">
            <h1 className="title has-text-centered" style={{ fontWeight: 600 }}>Inventory</h1>

            <div className="columns is-multiline">
                
                <div className="column is-12-tablet is-8-desktop">
                    <div className="columns is-multiline">
                        {products.map(product => (
                            <div className="column is-12-mobile is-6-tablet is-4-desktop" key={product.id}>
                                <div className="card">
                                    <div className="card-content">
                                        <h2 className="title is-5">{product.name}</h2>
                                        <p>{product.description}</p>
                                        <p><strong>Price (Rs):</strong> {product.price}</p>
                                        <p><strong>Quantity Available:</strong> {product.quantity}</p>
                                    </div>
                                    <footer className="card-footer">
                                        <UpdateProduct product={product} onProductUpdated={handleProductUpdate} />
                                        <DeleteProduct productId={product.id} onProductDeleted={handleProductDeleted} />
                                    </footer>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                
                <div className="column is-12-tablet is-4-desktop">
                    <div className="card">
                        <div className="card-content">
                            <h2 className="title is-5 has-text-centered">Add New Product</h2>
                            <CreateProductForm />
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    );
};

export default ProductList;