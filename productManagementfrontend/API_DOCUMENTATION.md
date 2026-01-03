# Product Management Dashboard - Backend API Documentation

## Table of Contents
1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
   - [Authentication APIs](#authentication-apis)
   - [Category APIs](#category-apis)
   - [Product APIs](#product-apis)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Pagination](#pagination)
7. [Filtering & Sorting](#filtering--sorting)

---

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

---

## Authentication

### Authentication Method
- **JWT (JSON Web Tokens)** recommended
- Token should be sent in the Authorization header:
  ```
  Authorization: Bearer <token>
  ```

### Token Expiration
- Access Token: 24 hours (recommended)
- Refresh Token: 7 days (optional)

---

## API Endpoints

### Authentication APIs

#### 1. Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid username or password",
  "error": "INVALID_CREDENTIALS"
}
```

---

#### 2. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

#### 3. Verify Token / Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "UNAUTHORIZED"
}
```

---

### Category APIs

#### 1. Get All Categories
**GET** `/categories`

**Query Parameters:**
- `search` (optional): Search by category name
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Electronics",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Clothing",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 2,
      "itemsPerPage": 10
    }
  }
}
```

---

#### 2. Get Single Category
**GET** `/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Category not found",
  "error": "NOT_FOUND"
}
```

---

#### 3. Create Category
**POST** `/categories`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Books"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Books",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "Category name is required"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Category with this name already exists",
  "error": "DUPLICATE_CATEGORY"
}
```

---

#### 4. Update Category
**PUT** `/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Category Name"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Category Name",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

#### 5. Delete Category
**DELETE** `/categories/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Cannot delete category. Products are associated with this category",
  "error": "CATEGORY_IN_USE"
}
```

---

### Product APIs

#### 1. Get All Products
**GET** `/products`

**Query Parameters:**
- `search` (optional): Search by product name
- `category` (optional): Filter by category name (e.g., `category=Electronics`)
- `sortBy` (optional): Sort field (`name`, `price`, `stock`, `category`, `id`) - default: `name`
- `sortOrder` (optional): Sort order (`asc` or `desc`) - default: `asc`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 5)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "category": "Electronics",
        "stock": 50,
        "images": [
          "https://example.com/images/laptop1.jpg",
          "https://example.com/images/laptop2.jpg"
        ],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 15,
      "itemsPerPage": 5
    }
  }
}
```

---

#### 2. Get Single Product
**GET** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 50,
    "images": [
      "https://example.com/images/laptop1.jpg",
      "https://example.com/images/laptop2.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

#### 3. Create Product
**POST** `/products`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Smartphone",
  "price": 699.99,
  "category": "Electronics",
  "stock": 75,
  "images": [
    "https://example.com/images/phone1.jpg",
    "https://example.com/images/phone2.jpg"
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 4,
    "name": "Smartphone",
    "price": 699.99,
    "category": "Electronics",
    "stock": 75,
    "images": [
      "https://example.com/images/phone1.jpg",
      "https://example.com/images/phone2.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": "Product name is required",
    "price": "Price must be greater than 0",
    "category": "Category is required",
    "stock": "Stock must be 0 or greater"
  }
}
```

---

#### 4. Update Product
**PUT** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Product Name",
  "price": 799.99,
  "category": "Electronics",
  "stock": 80,
  "images": [
    "https://example.com/images/updated1.jpg"
  ]
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    "price": 799.99,
    "category": "Electronics",
    "stock": 80,
    "images": [
      "https://example.com/images/updated1.jpg"
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

#### 5. Delete Product
**DELETE** `/products/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Product not found",
  "error": "NOT_FOUND"
}
```

---

## Data Models

### User Model
```typescript
interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

### Category Model
```typescript
interface Category {
  id: number;
  name: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

### Product Model
```typescript
interface Product {
  id: number;
  name: string;
  price: number; // Decimal/Float
  category: string; // Category name
  stock: number; // Integer, >= 0
  images: string[]; // Array of image URLs
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}
```

### Pagination Model
```typescript
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message here",
  "error": "ERROR_CODE",
  "errors": {} // Optional: For validation errors
}
```

### HTTP Status Codes
- `200 OK` - Successful GET, PUT, DELETE requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Validation errors, invalid input
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource (e.g., category name already exists)
- `500 Internal Server Error` - Server error

### Error Codes
- `INVALID_CREDENTIALS` - Wrong username/password
- `UNAUTHORIZED` - Invalid or expired token
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Input validation failed
- `DUPLICATE_CATEGORY` - Category name already exists
- `CATEGORY_IN_USE` - Cannot delete category with associated products
- `SERVER_ERROR` - Internal server error

---

## Pagination

### Query Parameters
- `page`: Page number (starts from 1)
- `limit`: Number of items per page

### Response Format
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Default Values
- Default page: `1`
- Default limit for products: `5`
- Default limit for categories: `10`

---

## Filtering & Sorting

### Filtering

#### Products
- **Search**: `?search=laptop` - Searches in product name
- **Category**: `?category=Electronics` - Filters by category name

#### Categories
- **Search**: `?search=electronics` - Searches in category name

### Sorting

#### Products
- **Sort By**: `?sortBy=name|price|stock|category|id`
- **Sort Order**: `?sortOrder=asc|desc`
- **Example**: `?sortBy=price&sortOrder=desc`

#### Default Sorting
- Products: `name` ascending
- Categories: `name` ascending

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Product Images Table
```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Validation Rules

### Category
- `name`: Required, string, min 2 characters, max 100 characters, unique

### Product
- `name`: Required, string, min 2 characters, max 200 characters
- `price`: Required, number, must be > 0, max 2 decimal places
- `category`: Required, string, must exist in categories table
- `stock`: Required, integer, must be >= 0
- `images`: Optional, array of strings (URLs), max 10 images per product

### User (Login)
- `username`: Required, string
- `password`: Required, string, min 6 characters

---

## Image Upload (Optional Enhancement)

If you want to support image uploads instead of URLs:

### Upload Image
**POST** `/products/:id/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
FormData:
- file: [image file]
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "imageUrl": "https://example.com/uploads/product1_image1.jpg",
    "displayOrder": 0
  }
}
```

---

## Notes for Backend Developer

1. **Authentication**: Implement JWT-based authentication. Store tokens securely.

2. **CORS**: Enable CORS for the frontend domain:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Authorization
   ```

3. **Image Storage**: 
   - For MVP: Store image URLs as strings in database
   - For production: Consider cloud storage (AWS S3, Cloudinary, etc.)

4. **Category-Product Relationship**:
   - Products should reference categories
   - When returning products, include category name (not just ID)
   - Prevent category deletion if products exist (or cascade delete based on requirements)

5. **Search Implementation**:
   - Use case-insensitive search
   - Search should work with partial matches

6. **Sorting**:
   - Support sorting by multiple fields
   - Default sorting should be consistent

7. **Pagination**:
   - Always return pagination metadata
   - Calculate total pages: `Math.ceil(totalItems / itemsPerPage)`

8. **Error Messages**:
   - Use clear, user-friendly error messages
   - Return validation errors in a structured format

9. **Response Format**:
   - Always use consistent response structure
   - Include `success` boolean in all responses
   - Wrap data in `data` object

10. **Security**:
    - Hash passwords (bcrypt recommended)
    - Validate all inputs
    - Sanitize user inputs
    - Use parameterized queries to prevent SQL injection
    - Rate limiting for authentication endpoints

---

## Example API Integration Code (Frontend Reference)

```javascript
// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Example: Get all products with filters
const getProducts = async (filters) => {
  const token = localStorage.getItem('token');
  const params = new URLSearchParams({
    page: filters.page || 1,
    limit: filters.limit || 5,
    ...(filters.search && { search: filters.search }),
    ...(filters.category && { category: filters.category }),
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
  });

  const response = await fetch(`${API_BASE_URL}/products?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};
```

---

## Contact & Support

For any questions or clarifications about the API requirements, please contact the frontend development team.

**Last Updated**: January 2024

