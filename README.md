# ShoeStore Microservices Project

Welcome to the **ShoeStore Microservices** project!

## 📖 About the Project

This application is a full-featured e-commerce platform designed for selling footwear. It demonstrates a modern **microservices architecture** where distinct business capabilities (Authentication, Products, Orders) are decoupled into separate services. This design ensures scalability, maintainability, and fault isolation.

This file serves as a guide to understanding the architecture, setting up the environment, and running the application.

## 🏗️ Architecture Overview

This project follows a **Microservices Architecture** pattern, consisting of a Frontend Micro-frontend (SPA) and three distinct Backend Microservices. All backend services are built with **Java Spring Boot**, while the frontend is built with **React**.


### 🎨 Frontend

- **Folder:** `front-end`
- **Technology Stack:** React, Vite, Tailwind CSS, Axios.
- **Role:** Serves as the user interface for browsing products, placing orders, and handling user authentication.


### 🔙 Backend Services

#### 1. 🔐 User Auth Service

- **Folder:** `user-auth-service`
- **Port:** `8080`
- **Database:** `user_auth` (MySQL)
- **Responsibilities:**
  - User Registration and Login.
  - JWT (JSON Web Token) generation and validation.
  - Secured with Spring Security.

#### 2. 📦 Product Service

- **Folder:** `product-service`
- **Port:** `8081`
- **Database:** `product_db` (MySQL)
- **Responsibilities:**
  - Management of shoe inventory.
  - CRUD operations for products.

#### 3. 🛒 Order Service

- **Folder:** `order-service`
- **Port:** `8082`
- **Database:** `order_db` (MySQL)
- **Responsibilities:**
  - Order placement and processing.
  - Order history management.

---

## 🔄 Data Flow

This section describes how data moves through the system during key user interactions.

### 1. User Authentication Flow

1.  **Registration:** A user submits details via the Frontend. The request is sent to `User Auth Service`. The service hashes the password and saves the user to `user_auth` database.
2.  **Login:** User enters credentials. `User Auth Service` validates them and issues a **JWT** (JSON Web Token).
3.  **Authenticated Requests:** For subsequent requests (like placing an order), the Frontend attaches this JWT to the header.

### 2. Product Browsing Flow

1.  **View Catalog:** When the user visits the shop page, the Frontend requests the product list from `Product Service`.
2.  **Fetch Data:** `Product Service` retrieves shoe details (name, price, stock) from `product_db`.
3.  **Display:** The data is returned as JSON and rendered by React on the screen.

### 3. Order Placement Flow

1.  **Cart & Checkout:** User adds items to the cart and proceeds to checkout.
2.  **Create Order:** Frontend sends an order request to `Order Service` with the JWT.
3.  **Processing:** `Order Service` saves the order details in `order_db`.
4.  **Confirmation:** The user receives an order confirmation, and the order appears in their history.

---

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** (or compatible JDK)
- **Node.js & npm** (for the frontend)
- **MySQL Server** (running on port `3306`)

---

## 🚀 Getting Started

### 1. Database Setup

You must create the following databases in your MySQL server before starting the applications:

```sql
CREATE DATABASE user_auth;
CREATE DATABASE product_db;
CREATE DATABASE order_db;
```

### 2. Backend Setup

For each service (`user-auth-service`, `product-service`, `order-service`), follow these steps:

1.  Navigate to the service directory:
    ```bash
    cd <service-name>
    ```
2.  Update the `src/main/resources/application.properties` file if your MySQL credentials differ from the default (`root` / empty password):
    ```properties
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```
3.  Run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```
    - **User Auth Service** will start on port `8080`.
    - **Product Service** will start on port `8081`.
    - **Order Service** will start on port `8082`.

### 3. Frontend Setup

1.  Navigate to the `front-end` directory:
    ```bash
    cd front-end
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will typically be accessible at `http://localhost:5173`.

---

## 🌐 API Interaction

The frontend interacts with the backend services directly via REST APIs.

- **User Auth:** `http://localhost:8080/ead/...`
- **Products:** `http://localhost:8081/ead/...`
- **Orders:** `http://localhost:8082/ead/...`

## 📁 Project Structure

```
c:\NIBMhnd\EAD\practice\project
├── front-end/           # React Frontend Application
├── order-service/       # Order Management Service (Spring Boot)
├── product-service/     # Product Management Service (Spring Boot)
└── user-auth-service/   # Authentication Service (Spring Boot)
```
