# Team 3 - E-Commerce Frontend

This repository contains the frontend application for the E-Commerce Microservices project. It is built with Vue.js and consumes two backend microservices (Products and Orders) via a unified API Gateway.

## Project Structure and Features

The application is divided into three main sections:
* **Catalog:** Product listing, search, filters, and product details.
* **Cart and Checkout:** Local state management for added products, cart review, and order placement.
* **My Orders:** Order history, details, and status tracking.

## Tech Stack

* **Framework:** Vue.js
* **Routing:** Vue Router
* **State Management:** Pinia (used for Cart state)
* **Build Tool:** Vite

## Prerequisites

Make sure you have Node.js installed on your local machine to run this project.

## Local Setup

1. Clone the repository:
   git clone <URL_DEL_REPOSITORIO>

2. Navigate to the project directory:
   cd team3-frontend

3. Install dependencies:
   npm install

4. Configure environment variables:
   Create a `.env` file in the root directory and add the API Gateway endpoints. Ask the infrastructure team (Saúl/Juan Pablo) for the current URLs.
   
   VITE_PRODUCTS_API_URL=http://<api-gateway-url>/products
   VITE_ORDERS_API_URL=http://<api-gateway-url>/orders

5. Start the development server:
   npm run dev

