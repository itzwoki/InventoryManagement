import api from '../api';
import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
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

    const handleProductUpdate = (updatedProduct) => {
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
        <Box sx={{ padding: '20px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 600, marginBottom: '30px' }}>
                Inventory
            </Typography>

            {/* Product Grid */}
            <Grid container spacing={3} justifyContent="center">
                {products.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '20px',
                            boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-10px)',
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
                            },
                        }}>
                            <CardContent sx={{ paddingBottom: '16px' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
                            </CardContent>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                {/* Update and Delete Icons */}
                                <UpdateProduct product={product} onProductUpdated={handleProductUpdate} />
                                <DeleteProduct productId={product.id} onProductDeleted={handleProductDeleted} />
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add New Product Section */}
            <Grid container spacing={3} justifyContent="center" sx={{ marginTop: '30px' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{
                        padding: '20px',
                        boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        backgroundColor: '#ffffff',
                    }}>
                        <CardContent>
                            <Typography variant="h5" align="center" sx={{ fontWeight: 600 }}>
                                Add New Product
                            </Typography>
                            <CreateProductForm />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProductList;
