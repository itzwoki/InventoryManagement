import axios from "axios";
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import UpdateProduct from "./UpdateProduct";
import DeleteProduct from "./DeleteProduct";
import CreateProductForm from "./CreateProductForm";
import "./ProductList.css"; 

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
    
            const response = await axios.get('http://localhost:8000/inventory/products/', {
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
        return <Typography variant="h6" align="center">Loading Products...</Typography>;
    }
    if (error) {
        return <Typography variant="h6" color="error" align="center">{error}</Typography>;
    }

    return (
        <div className="product-list-container" style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600 }}>
                Inventory
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={8}>
                    <div className="product-list">
                        {products.map(product => (
                            <Card key={product.id} sx={{ marginBottom: '20px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: 1 }}>
                                        {product.description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.primary', marginTop: 1 }}>
                                        Price (Rs): <strong>{product.price}</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.primary', marginTop: 1 }}>
                                        Quantity Available: <strong>{product.quantity}</strong>
                                    </Typography>
                                    <div style={{ marginTop: '10px' }}>
                                        <UpdateProduct product={product} onProductUpdated={handleProductUpdate} />
                                        <DeleteProduct productId={product.id} onProductDeleted={handleProductDeleted} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Card sx={{ padding: '20px' }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom align="center">
                                Add New Product
                            </Typography>
                            <CreateProductForm />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProductList;
