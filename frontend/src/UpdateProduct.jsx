import axios from "axios";
import { useState } from "react";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";

const UpdateProduct = ({ product, onProductUpdated }) => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatedProduct, setUpdatedProduct] = useState({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
    });
    const [loading, setLoading] = useState(false); 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProduct({ ...updatedProduct, [name]: value });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found. Please log in.");
            }

            setLoading(true); // Show loading spinner during update

            await axios.put(
                `http://localhost:8000/inventory/products/${product.id}`,
                updatedProduct,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Product updated successfully");
            setIsUpdating(false);
            setLoading(false); // Hide loading spinner
            onProductUpdated(); // Refresh the parent component
        } catch (err) {
            alert("Error updating product");
            setLoading(false);
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setIsUpdating(true)}
            >
                Update Product
            </Button>

            <Dialog open={isUpdating} onClose={() => setIsUpdating(false)} fullWidth>
                <DialogTitle>Update Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={updatedProduct.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={updatedProduct.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price (Rs)"
                        name="price"
                        type="number"
                        value={updatedProduct.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={updatedProduct.quantity}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsUpdating(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdate}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UpdateProduct;
