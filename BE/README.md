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

Dang tiep tuc:

- Inventory
- Supplier
- Cart
- Report
- Review
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

## Ghi chu

- Project BE hien tai doc bien moi truong tu file .env trong thu muc BE.
- Dong bo database bang file database/WebElectricShop.sql truoc khi test API.
