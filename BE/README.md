## 1. Tong quan du an

ElectricShop gom 2 phan:

- FE: React + TypeScript (UI user + admin)
- BE: Express + TypeScript + SQL Server

Muc tieu file nay:

- Liet ke toan bo chuc nang chinh cua web
- Liet ke API dang co
- Liet ke API can lam de web hoan thien end-to-end

---

## 2. Chuc nang chinh cua web

### 2.1. Nhom User

- Trang chu
- Danh sach san pham, loc theo danh muc
- Chi tiet san pham
	- danh gia
	- phan hoi nguoi ban tren danh gia
- Gio hang
- Checkout
- Don hang cua toi
- Ho so ca nhan
- Voucher
- Tin tuc + chi tiet tin tuc
- Lien he
- Lien he cua toi (kiem tra shop da phan hoi chua)

### 2.2. Nhom Auth

- Dang ky
- Dang nhap
- Doi mat khau

### 2.3. Nhom Admin/Employee (quan tri)

- Dashboard
- Quan ly san pham
- Quan ly don hang
- Quan ly tai khoan
- Quan ly nhan vien
- Quan ly danh muc
- Quan ly thuong hieu
- Quan ly voucher
- Quan ly tin tuc
- Quan ly nha cung cap
- Quan ly phieu nhap
- Quan ly danh gia (xem + phan hoi)
- Quan ly lien he (admin)

### 2.4. Phan quyen hien tai

- Admin: full tat ca tab admin
- Employee: mot so tab va mot so tab chi xem theo ma tran da cau hinh

---

## 3. API dang co (BE da implement)

Hien tai BE moi co nhom `auth`.

Base URL mac dinh: `http://localhost:5000`

### 3.1. Health/Test

- `GET /`
- `GET /test-db`

### 3.2. Auth va tai khoan

- `POST /api/auth/login`
- `POST /api/auth/register`
- `PUT /api/auth/change-password` (can token)
- `GET /api/auth/accounts` (admin)
- `PATCH /api/auth/:id` (admin hoac chinh user do)
- `DELETE /api/auth/:id` (admin)

### 3.3. Stored procedures auth da co trong SQL

- `sp_DangNhap`
- `sp_TaiKhoan_LayTheoId`
- `sp_TaiKhoan_Them`
- `sp_TaiKhoan_DoiMatKhau`
- `sp_TaiKhoan_XoaMem`
- `sp_TaiKhoan_LayDanhSach`
- `sp_TaiKhoan_Sua`

---

## 4. API can lam de hoan thien web

Luu y: FE hien con dung mock/localStorage o nhieu module. De production-ready can chuyen sang API that.

## 4.1. Auth/Profile bo sung

- `GET /api/auth/me`
	- Lay thong tin user hien tai theo token

## 4.2. Product module

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/slug/:slug`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `PATCH /api/products/:id/status` (admin)

## 4.3. Category module

- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

## 4.4. Brand module

- `GET /api/brands`
- `GET /api/brands/:id`
- `POST /api/brands` (admin)
- `PUT /api/brands/:id` (admin)
- `DELETE /api/brands/:id` (admin)

## 4.5. Supplier module

- `GET /api/suppliers`
- `GET /api/suppliers/:id`
- `POST /api/suppliers` (admin)
- `PUT /api/suppliers/:id` (admin)
- `DELETE /api/suppliers/:id` (admin)

## 4.6. Voucher module

- `GET /api/vouchers`
- `GET /api/vouchers/:id`
- `POST /api/vouchers` (admin)
- `PUT /api/vouchers/:id` (admin)
- `DELETE /api/vouchers/:id` (admin)
- `POST /api/vouchers/validate`

## 4.7. News module

- `GET /api/news`
- `GET /api/news/:slug`
- `POST /api/news` (admin/employee duoc cap)
- `PUT /api/news/:id` (admin/employee duoc cap)
- `DELETE /api/news/:id` (admin)

## 4.8. Review module

- `GET /api/reviews`
- `GET /api/reviews/product/:productId`
- `POST /api/reviews` (user)
- `PUT /api/reviews/:id` (owner)
- `DELETE /api/reviews/:id` (owner/admin)
- `POST /api/reviews/:id/reply` (admin/employee)
- `PUT /api/reviews/:id/reply` (admin/employee)

## 4.9. Contact module

- `POST /api/contacts` (user/gui lien he)
- `GET /api/contacts/me` (xem lien he cua tai khoan dang nhap)
- `GET /api/contacts` (admin)
- `PATCH /api/contacts/:id/status` (admin)
- `POST /api/contacts/:id/reply` (admin)
- `PUT /api/contacts/:id/reply` (admin)

## 4.10. Cart module

- `GET /api/cart` (theo tai khoan)
- `POST /api/cart/items`
- `PUT /api/cart/items/:productId`
- `DELETE /api/cart/items/:productId`
- `DELETE /api/cart/clear`

## 4.11. Order module

- `POST /api/orders` (checkout)
- `GET /api/orders/me`
- `GET /api/orders/:id` (owner/admin)
- `GET /api/admin/orders` (admin/employee)
- `PATCH /api/admin/orders/:id/status` (admin/employee)

## 4.12. Import receipt module

- `GET /api/import-receipts` (admin/employee)
- `GET /api/import-receipts/:id` (admin/employee)
- `POST /api/import-receipts` (admin/employee)
- `DELETE /api/import-receipts/:id` (admin/employee neu duoc phep)

## 4.13. Employee module

- `GET /api/employees` (admin)
- `GET /api/employees/:id` (admin)
- `POST /api/employees` (admin)
- `PUT /api/employees/:id` (admin)
- `DELETE /api/employees/:id` (admin)

## 4.14. Dashboard module

- `GET /api/dashboard/summary` (admin/employee)
- `GET /api/dashboard/recent-orders` (admin/employee)
- `GET /api/dashboard/order-status-stats` (admin/employee)

---

## 5. Goi y implementation order (de khong bi roi)

1. Product/Category/Brand APIs
2. Cart + Order APIs
3. News + Review + Reply APIs
4. Supplier + ImportReceipt APIs
5. Contact APIs
6. Employee APIs
7. Dashboard aggregate APIs

---

## 6. Moi truong va bao mat

- Commit: chi commit `.env.example`
- Khong commit `.env`
- Rotate JWT secret va DB password khi deploy

File env mau: `BE/.env.example`