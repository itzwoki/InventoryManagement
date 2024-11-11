import axios from "axios";
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from "@mui/material";

const DeleteProduct = ({ productId, onProductDeleted }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found. Please log in.");
            }

            setIsDeleting(true); 

            await axios.delete(`http://localhost:8000/inventory/product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert("Product deleted successfully");
            setIsDeleting(false); 
            setIsDialogOpen(false); 
            onProductDeleted(productId); 
        } catch (err) {
            alert("Error deleting product");
            setIsDeleting(false); 
        }
    };

    return (
        <div>
            <Button
                variant="contained"
                color="error" 
                onClick={() => setIsDialogOpen(true)}
                sx={{
                    marginTop: '16px', 
                    marginLeft: '2px'  
                }}
            >
                Delete Product
            </Button>

            
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} fullWidth>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this product?</p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="primary"
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? <CircularProgress size={3} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteProduct;
