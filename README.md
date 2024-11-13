Project Overview:

This is a full-stack web application built with Python FastAPI for the backend, React.js for the frontend, and PostgreSQL for data storage. The project includes a set of APIs for managing products, as well as user authentication and authorization features. It ensures that only logged-in users with a valid JWT token can access the product-related routes.

Key Features:

User Authentication: Secure login and signup functionality using JWT tokens. Users must be logged in to access product management APIs.
Product Management: APIs for creating, deleting, and retrieving products. Each product has a name, description, price, and quantity.
Stripe Payment Integration: Allows users to make payments via Visa, MasterCard, and other supported credit cards using the Stripe API.
JWT Authentication: Every API route is protected with JWT authentication, ensuring that only authenticated users can interact with the system.
PostgreSQL Database: All data is stored in a PostgreSQL database, managed through pgAdmin 4.

Technologies Used:

1: Backend: FastAPI (Python)
2: Frontend: React.js (JavaScript)
3: Database: PostgreSQL (pgAdmin 4)
4: Authentication: JWT tokens
5: Payment Gateway: Stripe API for card payments
