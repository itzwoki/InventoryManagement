import api from '../api';
import { useState } from "react";
import "./CreateProductForm.css"; 

const CreateProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setMessage("No authentication token found. Please log in.");
            return;
        }
        try {
            const response = await api.post('/inventory/products/', {
                name: product.name,
                description: product.description,
                price: parseInt(product.price, 10),
                quantity: parseInt(product.quantity, 10)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, 
                }
            });
            setMessage('Product Added');
            console.log(response.data);
            setTimeout(() => {
                window.location.reload();
                setMessage('');
                setProduct({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                });
            }, 500);

            
        } catch (err) {
            setMessage('Error Adding Product');
            console.error(err);
        }
    };

    return (
        <div className="product-form-container">
            <h2>Add Product</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <input type="text" name="description" value={product.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Price (Rs):</label>
                    <input type="number" name="price" value={product.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} />
                </div>
                <button className="submit-button" type="submit">Add Product</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default CreateProductForm;
