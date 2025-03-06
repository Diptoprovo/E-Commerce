

# eCommerce Website (MERN Stack)

## Overview
This is a full-stack eCommerce web application built using the **MERN stack (MongoDB, Express.js, React, Node.js)**. The platform supports three types of users: **Buyer, Seller, and Admin**, each with specific roles and functionalities.

## Features
### Buyer
- View all available products.
- Add products to the cart.
- Edit items in the cart.
- Place orders.

### Seller
- View the products they sell.
- Manage their product listings.
- View received orders (without knowing buyer details).

### Admin
- View all products on the platform.
- View all orders placed by buyers.
- See detailed order information, including which buyer ordered which item from which seller.
- View buyer and seller addresses.
- Change order statuses.

## Technologies Used
- **Frontend:** React.js (with Redux for state management)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose for ORM)
- **Authentication:** JSON Web Token (JWT)
- **Styling:** Tailwind CSS / Bootstrap

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Diptoprovo/E-commerce.git
   cd ecommerce-mern
   ```
2. Install dependencies:
   ```sh
   npm install
   cd client
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
4. Start the backend server:
   ```sh
   npm start server
   ```
5. Start the frontend:
   ```sh
   cd client
   npm run dev
   ```


## User Roles & Permissions
| Feature             | Buyer | Seller | Admin |
|---------------------|-------|--------|-------|
| View products      | ✅    | ✅     | ✅    |
| Add to cart        | ✅    | ❌     | ❌    |
| Place order        | ✅    | ❌     | ❌    |
| View received orders | ❌  | ✅     | ✅    |
| View buyer details  | ✅   | ❌     | ✅    |
| Change order status | ❌   | ❌     | ✅    |

## Contributing
1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`.
3. Make your changes and commit them: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature-branch`.
5. Submit a pull request.

## License
This project is licensed under the MIT License.



