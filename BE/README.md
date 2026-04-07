# ElectricShop Backend

## API Groups (Theo yeu cau)

Xay dung cac API:

- API Authentication, Inventory, Supplier
- API Cart, Product, Report, Review, Voucher
- API Employees, Order, Invoice, Customer, News

## Trang thai hien tai

Da co trong source:

- Authentication API
- Product API
- Supplier API
- Inventory API
- Cart API
- Report API
- Review API


Dang tiep tuc:

- Voucher
- Employees
- Order
- Invoice
- Customer
- News

## Base URL

http://localhost:5000

## Routes da co

### Auth

- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/me
- GET /api/auth/accounts
- PUT /api/auth/change-password
- PATCH /api/auth/:id
- DELETE /api/auth/:id

### Product

- GET /api/products
- GET /api/products/slug/:slug
- GET /api/products/:id
- GET /api/products/:id/images
- POST /api/products
- PUT /api/products/:id
- PATCH /api/products/:id/status
- DELETE /api/products/:id
- DELETE /api/products/:id/images/:imageId

### Supplier

- GET /api/suppliers
- GET /api/suppliers/:id
- POST /api/suppliers
- PUT /api/suppliers/:id
- DELETE /api/suppliers/:id

### Inventory

- GET /api/inventory/stock
- GET /api/inventory/import-receipts
- GET /api/inventory/import-receipts/:id
- POST /api/inventory/import-receipts
- DELETE /api/inventory/import-receipts/:id

### Cart

- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/:productId
- DELETE /api/cart/items/:productId
- DELETE /api/cart/clear

### Report

- GET /api/reports/summary
- GET /api/reports/revenue-by-date
- GET /api/reports/top-products

### Review

- GET /api/reviews
- GET /api/reviews/product/:id
- POST /api/reviews
- PATCH /api/reviews/:id
- DELETE /api/reviews/:id

## Ghi chu

- Project BE hien tai doc bien moi truong tu file .env trong thu muc BE.
- Dong bo database bang file database/WebElectricShop.sql truoc khi test API.
