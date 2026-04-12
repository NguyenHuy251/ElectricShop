# ElectricShop Backend

## API Groups (Theo yeu cau)

Xay dung cac API:

- API Authentication, Inventory, Supplier
- API Cart, Product, Report, Review, Voucher, Category
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
- Voucher API
- Category API
- Employees API
- Orders API
- Invoice API
- Customer API
- News API


Dang tiep tuc:

- Invoice (mo rong nghiep vu)
- Customer(khach hang) (mo rong nghiep vu)
- News (mo rong nghiep vu)

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

### Voucher

- GET /api/vouchers
- GET /api/vouchers/:id
- POST /api/vouchers
- PUT /api/vouchers/:id
- DELETE /api/vouchers/:id

### Category

- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

### Employees

- GET /api/employees
- GET /api/employees/:id
- POST /api/employees
- PUT /api/employees/:id
- DELETE /api/employees/:id

### Orders

- GET /api/orders
- GET /api/orders/my
- POST /api/orders
- PATCH /api/orders/:id/status

### Invoice

- GET /api/invoices
- GET /api/invoices/order/:orderId

### Customer

- GET /api/customers
- GET /api/customers/:id
- PUT /api/customers/:id
- DELETE /api/customers/:id

### News

- GET /api/news
- GET /api/news/slug/:slug
- POST /api/news
- PUT /api/news/:id
- DELETE /api/news/:id

## Ghi chu

- Project BE hien tai doc bien moi truong tu file .env trong thu muc BE.
- Dong bo database bang file database/WebElectricShop.sql truoc khi test API.
- Can chay script proc moi trong database/WebElectricShop.sql de su dung Voucher/Category/Employees/Orders/Invoice/Customer/News API.
