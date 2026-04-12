create database ElectricShop
 
 CREATE TABLE TaiKhoan(
    id INT IDENTITY PRIMARY KEY,
    tenDangNhap NVARCHAR(50) UNIQUE,
    matKhau NVARCHAR(255),
    tenHienThi NVARCHAR(100),
    email NVARCHAR(100),
    sdt NVARCHAR(15),
    diaChi NVARCHAR(255),
    vaiTro NVARCHAR(20),
    trangThai BIT DEFAULT 1,
    ngayTao DATETIME DEFAULT GETDATE()
);

CREATE TABLE KhachHang(
    id INT IDENTITY PRIMARY KEY,
    idTaiKhoan INT NOT NULL UNIQUE,
    maKhachHang NVARCHAR(50) NOT NULL UNIQUE,
    hoTen NVARCHAR(100) NOT NULL,
    ngaySinh DATE NULL,
    gioiTinh NVARCHAR(10) NULL,
    ghiChu NVARCHAR(255) NULL,
    trangThai BIT DEFAULT 1,
    ngayTao DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_KhachHang_TaiKhoan FOREIGN KEY (idTaiKhoan) REFERENCES dbo.TaiKhoan(id)
);

CREATE TABLE NhanVien(
    id INT IDENTITY PRIMARY KEY,
    idTaiKhoan INT NOT NULL,
    maNhanVien NVARCHAR(50) NOT NULL,
    hoTen NVARCHAR(100) NOT NULL,
    sdt NVARCHAR(20) NULL,
    email NVARCHAR(100) NULL,
    diaChi NVARCHAR(255) NULL,
    chucVu NVARCHAR(100) NULL,
    boPhan NVARCHAR(100) NULL,
    ngayVaoLam DATE NULL,
    luongCoBan FLOAT NULL,
    trangThai BIT DEFAULT 1,
    ngayTao DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_NhanVien_TaiKhoan FOREIGN KEY (idTaiKhoan) REFERENCES dbo.TaiKhoan(id)
);

CREATE TABLE ThuongHieu(
    id INT IDENTITY PRIMARY KEY,
    tenThuongHieu NVARCHAR(150),
    slug NVARCHAR(150),
    logo NVARCHAR(255),
    quocGia NVARCHAR(100),
    trangThai BIT DEFAULT 1
);

CREATE TABLE DanhMuc(
    id INT IDENTITY PRIMARY KEY,
    tenDanhMuc NVARCHAR(200),
    slug NVARCHAR(200),
    moTa NVARCHAR(MAX),
    trangThai BIT DEFAULT 1
);

CREATE TABLE SanPham(
    id INT IDENTITY PRIMARY KEY,
    maSanPham NVARCHAR(50),
    tenSanPham NVARCHAR(200),
    slug NVARCHAR(200),
    idDanhMuc INT,
    idThuongHieu INT,
    moTa NVARCHAR(MAX),
    giaBan FLOAT,
    giaGoc FLOAT,
    baoHanhThang INT,
    hinhAnh NVARCHAR(MAX),
    soLuongBan INT DEFAULT 0,
    danhGia FLOAT DEFAULT 0,
    trangThai BIT DEFAULT 1,
    ngayTao DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (idDanhMuc) REFERENCES DanhMuc(id),
    FOREIGN KEY (idThuongHieu) REFERENCES ThuongHieu(id)
);

CREATE TABLE AnhSanPham(
    id INT IDENTITY PRIMARY KEY,
    idSanPham INT,
    hinhAnh NVARCHAR(MAX),

    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);	

CREATE TABLE ThuocTinh(
    id INT IDENTITY PRIMARY KEY,
    tenThuocTinh NVARCHAR(150)
);

CREATE TABLE GiaTriThuocTinh(
    id INT IDENTITY PRIMARY KEY,
    idSanPham INT,
    idThuocTinh INT,
    giaTri NVARCHAR(200),

    FOREIGN KEY (idSanPham) REFERENCES SanPham(id),
    FOREIGN KEY (idThuocTinh) REFERENCES ThuocTinh(id)
);

CREATE TABLE BienTheSanPham(
    id INT IDENTITY PRIMARY KEY,
    idSanPham INT,
    sku NVARCHAR(100),
    mauSac NVARCHAR(50),
    dungTich NVARCHAR(50),
    giaBan FLOAT,
    soLuongTon INT,

    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);

CREATE TABLE GioHang(
    id INT IDENTITY PRIMARY KEY,
    idTaiKhoan INT,
    idSanPham INT,
    soLuong INT,

    FOREIGN KEY (idTaiKhoan) REFERENCES TaiKhoan(id),
    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);

CREATE TABLE DonHang(
    id INT IDENTITY PRIMARY KEY,
    maDonHang NVARCHAR(50),
    idTaiKhoan INT,
    idNhanVienXuly INT,
    tongTien FLOAT,
    trangThai NVARCHAR(50),
    diaChi NVARCHAR(MAX),
    phuongThucThanhToan NVARCHAR(50),
    ngayDatHang DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (idTaiKhoan) REFERENCES TaiKhoan(id),
    FOREIGN KEY (idNhanVienXuLy) REFERENCES dbo.NhanVien(id);
);

CREATE TABLE ChiTietDonHang(
    id INT IDENTITY PRIMARY KEY,
    idDonHang INT,
    idSanPham INT,
    gia FLOAT,
    soLuong INT,

    FOREIGN KEY (idDonHang) REFERENCES DonHang(id),
    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);

CREATE TABLE DanhGia(
    id INT IDENTITY PRIMARY KEY,
    idSanPham INT,
    idTaiKhoan INT,
    soSao INT,
    noiDung NVARCHAR(MAX),
    ngayDanhGia DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (idSanPham) REFERENCES SanPham(id),
    FOREIGN KEY (idTaiKhoan) REFERENCES TaiKhoan(id)
);

CREATE TABLE NhaCungCap(
    id INT IDENTITY PRIMARY KEY,
    tenNhaCungCap NVARCHAR(200),
    sdt NVARCHAR(20),
    email NVARCHAR(100),
    diaChi NVARCHAR(MAX)
);

CREATE TABLE PhieuNhap(
    id INT IDENTITY PRIMARY KEY,
    idNhaCungCap INT,
    idNhanVienLap INT,
    tongTien FLOAT,
    ngayNhap DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (idNhaCungCap) REFERENCES NhaCungCap(id),
    FOREIGN KEY (idNhanVienLap) REFERENCES dbo.NhanVien(id)
);

CREATE TABLE ChiTietPhieuNhap(
    id INT IDENTITY PRIMARY KEY,
    idPhieuNhap INT,
    idSanPham INT,
    soLuong INT,
    giaNhap FLOAT,

    FOREIGN KEY (idPhieuNhap) REFERENCES PhieuNhap(id),
    FOREIGN KEY (idSanPham) REFERENCES SanPham(id)
);

CREATE TABLE Voucher(
    id INT IDENTITY PRIMARY KEY,
    maVoucher NVARCHAR(50),
    loaiGiam NVARCHAR(50),
    giaTri FLOAT,
    ngayBatDau DATETIME,
    ngayKetThuc DATETIME,
    soLuong INT
);

CREATE TABLE TinTuc(
    id INT IDENTITY PRIMARY KEY,
    idNhanVienDang INT,
    tieuDe NVARCHAR(300),
    slug NVARCHAR(300),
    noiDung NVARCHAR(MAX),
    hinhAnh NVARCHAR(255),
    ngayDang DATETIME DEFAULT GETDATE()

    FOREIGN KEY (idNhanVienDang) REFERENCES dbo.NhanVien(id)
);

CREATE TABLE LienHe(
    id INT IDENTITY PRIMARY KEY,
    idTaiKhoan INT NULL,
    hoTen NVARCHAR(120) NOT NULL,
    email NVARCHAR(120) NOT NULL,
    sdt NVARCHAR(20) NULL,
    tieuDe NVARCHAR(255) NOT NULL,
    noiDung NVARCHAR(MAX) NOT NULL,
    trangThai NVARCHAR(30) DEFAULT N'Moi',
    ngayTao DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (idTaiKhoan) REFERENCES dbo.TaiKhoan(id)
);

-- =====================================
-- THUONG HIEU
-- =====================================
INSERT INTO ThuongHieu (tenThuongHieu, slug, logo, quocGia, trangThai) VALUES
(N'Panasonic','panasonic','panasonic.png','Japan',1),
(N'Philips','philips','philips.png','Netherlands',1),
(N'Xiaomi','xiaomi','xiaomi.png','China',1),
(N'Sunhouse','sunhouse','sunhouse.png','Vietnam',1),
(N'Electrolux','electrolux','electrolux.png','Sweden',1);

-- =====================================
-- DANH MUC
-- =====================================
INSERT INTO DanhMuc (tenDanhMuc, slug, moTa, trangThai) VALUES
(N'Quạt điện','quat-dien',N'Các loại quạt điện gia đình',1),
(N'Nồi cơm điện','noi-com-dien',N'Nồi cơm điện hiện đại',1),
(N'Máy xay','may-xay',N'Máy xay sinh tố',1),
(N'Ấm siêu tốc','am-sieu-toc',N'Ấm đun nước',1),
(N'Máy hút bụi','may-hut-bui',N'Máy hút bụi gia đình',1);

-- =====================================
-- TAI KHOAN
-- =====================================
INSERT INTO TaiKhoan (tenDangNhap, matKhau, tenHienThi, email, sdt, diaChi, vaiTro, trangThai, ngayTao) VALUES
('admin','123456',N'Admin','admin@gmail.com','0900000000',N'Hà Nội','Admin',1,GETDATE()),
('user1','123456',N'Nguyễn Văn A','a@gmail.com','0901111111',N'HCM','Customer',1,GETDATE()),
('user2','123456',N'Trần Thị B','b@gmail.com','0902222222',N'Đà Nẵng','Customer',1,GETDATE()),
('user3','123456',N'Lê Văn C','c@gmail.com','0903333333',N'Hải Phòng','Customer',1,GETDATE()),
('user4','123456',N'Phạm Thị D','d@gmail.com','0904444444',N'Cần Thơ','Customer',1,GETDATE());

-- =====================================
-- KHACH HANG
-- =====================================
INSERT INTO KhachHang (idTaiKhoan, maKhachHang, hoTen, ngaySinh, gioiTinh, ghiChu, trangThai) VALUES
(2, 'KH001', N'Nguyễn Văn A', '1998-05-12', N'Nam', N'Khách mua thường xuyên', 1),
(3, 'KH002', N'Trần Thị B', '1999-08-20', N'Nữ', NULL, 1),
(4, 'KH003', N'Lê Văn C', '1995-03-01', N'Nam', N'Ưu tiên tư vấn sản phẩm mới', 1),
(5, 'KH004', N'Phạm Thị D', '2000-11-30', N'Nữ', NULL, 1);

-- =====================================
-- NHAN VIEN
-- =====================================
INSERT INTO NhanVien (idTaiKhoan, maNhanVien, hoTen, sdt, email, diaChi, chucVu, boPhan, ngayVaoLam, luongCoBan, trangThai) VALUES
(1, 'NV001', N'Admin Hệ Thống', '0900000000', 'admin@gmail.com', N'Hà Nội', N'Quản trị viên', N'Vận hành', CAST(GETDATE() AS DATE), 15000000, 1),
(2, 'NV002', N'Nguyễn Văn Hùng', '0901234567', 'hung@gmail.com', N'HCM', N'Nhân viên bán hàng', N'Tổng hợp', CAST(GETDATE() AS DATE), 8000000, 1),
(3, 'NV003', N'Trần Thị Linh', '0902345678', 'linh@gmail.com', N'Đà Nẵng', N'Nhân viên kho', N'Kho hàng', CAST(GETDATE() AS DATE), 6500000, 1),
(4, 'NV004', N'Lê Văn Tuấn', '0903456789', 'tuan@gmail.com', N'Hải Phòng', N'Nhân viên giao hàng', N'Logistics', CAST(GETDATE() AS DATE), 7000000, 1),
(5, 'NV005', N'Phạm Thị Hoa', '0904567890', 'hoa@gmail.com', N'Cần Thơ', N'Nhân viên mua hàng', N'Mua hàng', CAST(GETDATE() AS DATE), 7500000, 1);

-- =====================================
-- SAN PHAM
-- =====================================
INSERT INTO SanPham (maSanPham, tenSanPham, slug, idDanhMuc, idThuongHieu, moTa, giaBan, giaGoc, baoHanhThang, hinhAnh, soLuongBan, danhGia, trangThai, ngayTao) VALUES
('SP001',N'Quạt Panasonic 5 cánh','quat-panasonic-5-canh',1,1,N'Quạt chạy êm',1500000,1800000,24,'fan.jpg',10,4.5,1,GETDATE()),
('SP002',N'Nồi cơm Panasonic 1.8L','noi-com-panasonic',2,1,N'Nấu cơm ngon',1200000,1400000,24,'rice.jpg',8,4.3,1,GETDATE()),
('SP003',N'Máy xay Philips','may-xay-philips',3,2,N'Xay mạnh',900000,1100000,24,'blender.jpg',6,4.7,1,GETDATE()),
('SP004',N'Ấm Sunhouse','am-sunhouse',4,4,N'Đun nhanh',350000,450000,12,'kettle.jpg',12,4.2,1,GETDATE()),
('SP005',N'Máy hút bụi Electrolux','may-hut-bui',5,5,N'Hút mạnh',2500000,3000000,24,'vacuum.jpg',5,4.8,1,GETDATE());

-- =====================================
-- ANH SAN PHAM
-- =====================================
INSERT INTO AnhSanPham (idSanPham, hinhAnh) VALUES
(1,'fan1.jpg'),
(1,'fan2.jpg'),
(2,'rice1.jpg'),
(3,'blender1.jpg'),
(4,'kettle1.jpg');

-- =====================================
-- THUOC TINH
-- =====================================
INSERT INTO ThuocTinh (tenThuocTinh) VALUES
(N'Công suất'),(N'Dung tích'),(N'Điện áp'),(N'Chất liệu'),(N'Số cánh');

-- =====================================
-- GIA TRI THUOC TINH
-- =====================================
INSERT INTO GiaTriThuocTinh (idSanPham, idThuocTinh, giaTri) VALUES
(1,5,'5 cánh'),(1,1,'60W'),
(2,2,'1.8L'),(3,1,'700W'),(4,2,'1.5L');

-- =====================================
-- BIEN THE
-- =====================================
INSERT INTO BienTheSanPham (idSanPham, sku, mauSac, dungTich, giaBan, soLuongTon) VALUES
(2,'RICE-12',N'Trắng','1.2L',1100000,20),
(2,'RICE-18',N'Trắng','1.8L',1200000,15),
(3,'BL-RED',N'Đỏ',NULL,900000,10),
(3,'BL-BLACK',N'Đen',NULL,900000,8),
(1,'FAN-WH',N'Trắng',NULL,1500000,12);

-- =====================================
-- GIO HANG
-- =====================================
INSERT INTO GioHang (idTaiKhoan, idSanPham, soLuong) VALUES
(2,1,1),
(2,3,2),
(3,2,1),
(4,4,1),
(5,5,1);

-- =====================================
-- DON HANG
-- =====================================
INSERT INTO DonHang (maDonHang, idTaiKhoan, tongTien, trangThai, diaChi, phuongThucThanhToan, ngayDatHang) VALUES
('DH001',2,1500000,N'HoanThanh',N'Hà Nội','COD',GETDATE()),
('DH002',3,1200000,N'DangXuLy',N'HCM','COD',GETDATE()),
('DH003',4,900000,N'DangGiao',N'Đà Nẵng','COD',GETDATE()),
('DH004',5,350000,N'ChoXacNhan',N'Hải Phòng','COD',GETDATE()),
('DH005',2,2500000,N'HoanThanh',N'Hà Nội','COD',GETDATE());

-- =====================================
-- CHI TIET DON HANG
-- =====================================
INSERT INTO ChiTietDonHang (idDonHang, idSanPham, gia, soLuong) VALUES
(1,1,1500000,1),(2,2,1200000,1),(3,3,900000,1),(4,4,350000,1),(5,5,2500000,1);

-- =====================================
-- DANH GIA
-- =====================================
INSERT INTO DanhGia (idSanPham, idTaiKhoan, soSao, noiDung, ngayDanhGia) VALUES
(1,2,5,N'Quạt tốt',GETDATE()),
(2,3,4,N'Nồi ok',GETDATE()),
(3,4,5,N'Rất mạnh',GETDATE()),
(4,5,4,N'Ổn',GETDATE()),
(5,2,5,N'Rất tốt',GETDATE());

-- =====================================
-- NHA CUNG CAP
-- =====================================
INSERT INTO NhaCungCap (tenNhaCungCap, sdt, email, diaChi) VALUES
(N'Panasonic VN','0901999999','panasonic@gmail.com',N'HCM'),
(N'Philips VN','0902999999','philips@gmail.com',N'HN'),
(N'Sunhouse','0903999999','sunhouse@gmail.com',N'HN'),
(N'Xiaomi','0904999999','xiaomi@gmail.com',N'HCM'),
(N'Electrolux','0905999999','electrolux@gmail.com',N'HN');

-- =====================================
-- PHIEU NHAP
-- =====================================
INSERT INTO PhieuNhap (idNhaCungCap, tongTien, ngayNhap) VALUES
(1,50000000,GETDATE()),
(2,30000000,GETDATE()),
(3,20000000,GETDATE()),
(4,15000000,GETDATE()),
(5,40000000,GETDATE());

-- =====================================
-- CHI TIET PHIEU NHAP
-- =====================================
INSERT INTO ChiTietPhieuNhap (idPhieuNhap, idSanPham, soLuong, giaNhap) VALUES
(1,1,20,1200000),
(2,2,15,1000000),
(3,3,10,700000),
(4,4,25,300000),
(5,5,12,2000000);

-- =====================================
-- VOUCHER
-- =====================================
INSERT INTO Voucher (maVoucher, loaiGiam, giaTri, ngayBatDau, ngayKetThuc, soLuong) VALUES
('SALE10','PhanTram',10,GETDATE(),'2026-12-31',100),
('SALE20','PhanTram',20,GETDATE(),'2026-12-31',50),
('FREESHIP','FreeShip',30000,GETDATE(),'2026-12-31',200),
('WELCOME','SoTien',50000,GETDATE(),'2026-12-31',100),
('NEWUSER','SoTien',70000,GETDATE(),'2026-12-31',50);

-- =====================================
-- TIN TUC
-- =====================================
INSERT INTO TinTuc (tieuDe, slug, noiDung, hinhAnh, ngayDang) VALUES
(N'Mẹo dùng quạt','meo-quat',N'Chi tiết','news1.jpg',GETDATE()),
(N'Chọn nồi cơm','chon-noi',N'Chi tiết','news2.jpg',GETDATE()),
(N'So sánh quạt','so-sanh',N'Chi tiết','news3.jpg',GETDATE()),
(N'Ve sinh máy xay','ve-sinh',N'Chi tiết','news4.jpg',GETDATE()),
(N'Mua máy hút bụi','may-hut',N'Chi tiết','news5.jpg',GETDATE());

-- =====================================
-- LIEN HE
-- =====================================
INSERT INTO LienHe (idTaiKhoan, hoTen, email, sdt, tieuDe, noiDung, trangThai, ngayTao) VALUES
(2, N'Nguyễn Văn A', 'a@gmail.com', '0901111111', N'Hỏi về bảo hành quạt', N'Tôi cần tư vấn chính sách bảo hành cho quạt Panasonic.', N'Moi', GETDATE()),
(NULL, N'Khách vãng lai', 'guest@gmail.com', '0908888888', N'Tư vấn sản phẩm', N'Nhờ shop gợi ý máy hút bụi cho căn hộ 70m2.', N'DaLienHe', GETDATE());

SELECT * FROM ThuongHieu;
SELECT * FROM DanhMuc;
SELECT * FROM TaiKhoan;
SELECT * FROM KhachHang;
SELECT * FROM SanPham;
SELECT * FROM AnhSanPham;
SELECT * FROM ThuocTinh;
SELECT * FROM GiaTriThuocTinh;
SELECT * FROM BienTheSanPham;
SELECT * FROM GioHang;
SELECT * FROM DonHang;
SELECT * FROM ChiTietDonHang;
SELECT * FROM DanhGia;
SELECT * FROM NhaCungCap;
SELECT * FROM PhieuNhap;
SELECT * FROM ChiTietPhieuNhap;
SELECT * FROM Voucher;
SELECT * FROM TinTuc;
SELECT * FROM LienHe;


IF OBJECT_ID('dbo.sp_DangNhap', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DangNhap;
END
GO

CREATE PROCEDURE dbo.sp_DangNhap
    @tenDangNhap NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        id,
        tenDangNhap,
        matKhau,
        tenHienThi,
        email,
        vaiTro,
        trangThai
    FROM dbo.TaiKhoan
    WHERE tenDangNhap = @tenDangNhap;
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        id,
        tenDangNhap,
        matKhau,
        tenHienThi,
        email,
        sdt,
        diaChi,
        vaiTro,
        trangThai
    FROM dbo.TaiKhoan
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_Them;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_Them
    @tenDangNhap NVARCHAR(50),
    @matKhau NVARCHAR(255),
    @tenHienThi NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @sdt NVARCHAR(15) = NULL,
    @diaChi NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TaiKhoan
    (
        tenDangNhap,
        matKhau,
        tenHienThi,
        email,
        sdt,
        diaChi,
        vaiTro,
        trangThai,
        ngayTao
    )
    OUTPUT
        INSERTED.id,
        INSERTED.tenDangNhap,
        INSERTED.tenHienThi,
        INSERTED.email,
        INSERTED.sdt,
        INSERTED.diaChi,
        INSERTED.vaiTro,
        INSERTED.trangThai
    VALUES
    (
        @tenDangNhap,
        @matKhau,
        @tenHienThi,
        @email,
        @sdt,
        @diaChi,
        N'Customer',
        1,
        GETDATE()
    );
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_DoiMatKhau', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_DoiMatKhau;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_DoiMatKhau
    @id INT,
    @matKhauMoi NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TaiKhoan
    SET matKhau = @matKhauMoi
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_XoaMem', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_XoaMem;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_XoaMem
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TaiKhoan
    SET trangThai = 0
    WHERE id = @id
      AND trangThai = 1;
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        tenDangNhap,
        tenHienThi,
        email,
        sdt,
        diaChi,
        vaiTro,
        trangThai
    FROM dbo.TaiKhoan
    ORDER BY id DESC;
END
GO

IF OBJECT_ID('dbo.sp_TaiKhoan_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TaiKhoan_Sua;
END
GO

CREATE PROCEDURE dbo.sp_TaiKhoan_Sua
    @id INT,
    @tenHienThi NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @sdt NVARCHAR(15) = NULL,
    @diaChi NVARCHAR(255) = NULL,
    @vaiTro NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TaiKhoan
    SET
        tenHienThi = ISNULL(@tenHienThi, tenHienThi),
        email = ISNULL(@email, email),
        sdt = ISNULL(@sdt, sdt),
        diaChi = ISNULL(@diaChi, diaChi),
        vaiTro = ISNULL(@vaiTro, vaiTro)
    WHERE id = @id AND trangThai = 1;

    IF @@ROWCOUNT = 0
    BEGIN
        SELECT NULL as id;
        RETURN;
    END

    SELECT
        id,
        tenDangNhap,
        tenHienThi,
        email,
        sdt,
        diaChi,
        vaiTro,
        trangThai
    FROM dbo.TaiKhoan
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_LienHe_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_LienHe_Them;
END
GO

CREATE PROCEDURE dbo.sp_LienHe_Them
    @idTaiKhoan INT = NULL,
    @hoTen NVARCHAR(120),
    @email NVARCHAR(120),
    @sdt NVARCHAR(20) = NULL,
    @tieuDe NVARCHAR(255),
    @noiDung NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.LienHe(idTaiKhoan, hoTen, email, sdt, tieuDe, noiDung, trangThai, ngayTao)
    OUTPUT
        INSERTED.id,
        INSERTED.idTaiKhoan,
        INSERTED.hoTen,
        INSERTED.email,
        INSERTED.sdt,
        INSERTED.tieuDe,
        INSERTED.noiDung,
        INSERTED.trangThai,
        INSERTED.ngayTao
    VALUES
    (
        @idTaiKhoan,
        @hoTen,
        @email,
        @sdt,
        @tieuDe,
        @noiDung,
        N'Moi',
        GETDATE()
    );
END
GO

IF OBJECT_ID('dbo.sp_LienHe_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_LienHe_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_LienHe_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        idTaiKhoan,
        hoTen,
        email,
        sdt,
        tieuDe,
        noiDung,
        trangThai,
        ngayTao
    FROM dbo.LienHe
    ORDER BY ngayTao DESC, id DESC;
END
GO

IF OBJECT_ID('dbo.sp_LienHe_CapNhatTrangThai', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_LienHe_CapNhatTrangThai;
END
GO

CREATE PROCEDURE dbo.sp_LienHe_CapNhatTrangThai
    @id INT,
    @trangThai NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.LienHe
    SET trangThai = @trangThai
    WHERE id = @id;

    SELECT
        id,
        idTaiKhoan,
        hoTen,
        email,
        sdt,
        tieuDe,
        noiDung,
        trangThai,
        ngayTao
    FROM dbo.LienHe
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_Auth_Me', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Auth_Me;
END
GO

CREATE PROCEDURE dbo.sp_Auth_Me
    @idTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        tk.id,
        tk.tenDangNhap,
        tk.tenHienThi,
        tk.email,
        tk.sdt,
        tk.diaChi,
        tk.vaiTro,
        tk.trangThai,
        tk.ngayTao,
        CASE
            WHEN EXISTS (
                SELECT 1
                FROM dbo.NhanVien nv
                WHERE nv.idTaiKhoan = tk.id
                  AND nv.trangThai = 1
            ) THEN CAST(1 AS BIT)
            ELSE CAST(0 AS BIT)
        END AS isEmployee
    FROM dbo.TaiKhoan tk
    WHERE tk.id = @idTaiKhoan
      AND tk.trangThai = 1;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.trangThai = 1
    ORDER BY sp.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.id = @id
      AND sp.trangThai = 1;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_LayTheoSlug', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_LayTheoSlug;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_LayTheoSlug
    @slug NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.slug = @slug
      AND sp.trangThai = 1;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_Them;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_Them
    @maSanPham NVARCHAR(50) = NULL,
    @tenSanPham NVARCHAR(200),
    @slug NVARCHAR(200),
    @idDanhMuc INT = NULL,
    @idThuongHieu INT = NULL,
    @moTa NVARCHAR(MAX) = NULL,
    @giaBan FLOAT,
    @giaGoc FLOAT = NULL,
    @baoHanhThang INT = NULL,
    @hinhAnh NVARCHAR(MAX) = NULL,
    @soLuongBan INT = 0,
    @danhGia FLOAT = 0,
    @trangThai BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.SanPham
    (
        maSanPham,
        tenSanPham,
        slug,
        idDanhMuc,
        idThuongHieu,
        moTa,
        giaBan,
        giaGoc,
        baoHanhThang,
        hinhAnh,
        soLuongBan,
        danhGia,
        trangThai,
        ngayTao
    )
    VALUES
    (
        @maSanPham,
        @tenSanPham,
        @slug,
        @idDanhMuc,
        @idThuongHieu,
        @moTa,
        @giaBan,
        @giaGoc,
        @baoHanhThang,
        @hinhAnh,
        @soLuongBan,
        @danhGia,
        @trangThai,
        GETDATE()
    );

    DECLARE @newId INT = SCOPE_IDENTITY();

    IF @hinhAnh IS NOT NULL AND LTRIM(RTRIM(@hinhAnh)) <> ''
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.AnhSanPham
            WHERE idSanPham = @newId
              AND hinhAnh = @hinhAnh
        )
        BEGIN
            INSERT INTO dbo.AnhSanPham (idSanPham, hinhAnh)
            VALUES (@newId, @hinhAnh);
        END
    END

    SELECT TOP 1
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.id = @newId;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_Sua;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_Sua
    @id INT,
    @maSanPham NVARCHAR(50) = NULL,
    @tenSanPham NVARCHAR(200) = NULL,
    @slug NVARCHAR(200) = NULL,
    @idDanhMuc INT = NULL,
    @idThuongHieu INT = NULL,
    @moTa NVARCHAR(MAX) = NULL,
    @giaBan FLOAT = NULL,
    @giaGoc FLOAT = NULL,
    @baoHanhThang INT = NULL,
    @hinhAnh NVARCHAR(MAX) = NULL,
    @soLuongBan INT = NULL,
    @danhGia FLOAT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.SanPham
    SET
        maSanPham = ISNULL(@maSanPham, maSanPham),
        tenSanPham = ISNULL(@tenSanPham, tenSanPham),
        slug = ISNULL(@slug, slug),
        idDanhMuc = ISNULL(@idDanhMuc, idDanhMuc),
        idThuongHieu = ISNULL(@idThuongHieu, idThuongHieu),
        moTa = ISNULL(@moTa, moTa),
        giaBan = ISNULL(@giaBan, giaBan),
        giaGoc = ISNULL(@giaGoc, giaGoc),
        baoHanhThang = ISNULL(@baoHanhThang, baoHanhThang),
        hinhAnh = ISNULL(@hinhAnh, hinhAnh),
        soLuongBan = ISNULL(@soLuongBan, soLuongBan),
        danhGia = ISNULL(@danhGia, danhGia)
    WHERE id = @id;

    IF @hinhAnh IS NOT NULL AND LTRIM(RTRIM(@hinhAnh)) <> ''
    BEGIN
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.AnhSanPham
            WHERE idSanPham = @id
              AND hinhAnh = @hinhAnh
        )
        BEGIN
            INSERT INTO dbo.AnhSanPham (idSanPham, hinhAnh)
            VALUES (@id, @hinhAnh);
        END
    END

    SELECT TOP 1
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_AnhSanPham_LayTheoSanPham', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_AnhSanPham_LayTheoSanPham;
END
GO

CREATE PROCEDURE dbo.sp_AnhSanPham_LayTheoSanPham
    @idSanPham INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        asp.id,
        asp.idSanPham,
        asp.hinhAnh
    FROM dbo.AnhSanPham asp
    WHERE asp.idSanPham = @idSanPham
      AND asp.hinhAnh IS NOT NULL
      AND LTRIM(RTRIM(asp.hinhAnh)) <> ''
    ORDER BY asp.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_XoaMem', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_XoaMem;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_XoaMem
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.SanPham
    SET trangThai = 0
    WHERE id = @id
      AND trangThai = 1;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_CapNhatTrangThai', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_CapNhatTrangThai;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_CapNhatTrangThai
    @id INT,
    @trangThai BIT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.SanPham
    SET trangThai = @trangThai
    WHERE id = @id;

    SELECT TOP 1
        sp.id,
        sp.maSanPham,
        sp.tenSanPham,
        sp.slug,
        sp.idDanhMuc,
        sp.idThuongHieu,
        sp.moTa,
        sp.giaBan,
        sp.giaGoc,
        sp.baoHanhThang,
        sp.hinhAnh,
        sp.soLuongBan,
        sp.danhGia,
        sp.trangThai,
        sp.ngayTao,
        dm.tenDanhMuc,
        th.tenThuongHieu
    FROM dbo.SanPham sp
    LEFT JOIN dbo.DanhMuc dm ON dm.id = sp.idDanhMuc
    LEFT JOIN dbo.ThuongHieu th ON th.id = sp.idThuongHieu
    WHERE sp.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhaCungCap_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhaCungCap_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_NhaCungCap_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT id, tenNhaCungCap, sdt, email, diaChi
    FROM dbo.NhaCungCap
    ORDER BY id DESC;
END
GO

IF OBJECT_ID('dbo.sp_NhaCungCap_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhaCungCap_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_NhaCungCap_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 id, tenNhaCungCap, sdt, email, diaChi
    FROM dbo.NhaCungCap
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhaCungCap_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhaCungCap_Them;
END
GO

CREATE PROCEDURE dbo.sp_NhaCungCap_Them
    @tenNhaCungCap NVARCHAR(200),
    @sdt NVARCHAR(20) = NULL,
    @email NVARCHAR(100) = NULL,
    @diaChi NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.NhaCungCap (tenNhaCungCap, sdt, email, diaChi)
    VALUES (@tenNhaCungCap, @sdt, @email, @diaChi);

    DECLARE @newId INT = SCOPE_IDENTITY();

    SELECT TOP 1 id, tenNhaCungCap, sdt, email, diaChi
    FROM dbo.NhaCungCap
    WHERE id = @newId;
END
GO

IF OBJECT_ID('dbo.sp_NhaCungCap_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhaCungCap_Sua;
END
GO

CREATE PROCEDURE dbo.sp_NhaCungCap_Sua
    @id INT,
    @tenNhaCungCap NVARCHAR(200) = NULL,
    @sdt NVARCHAR(20) = NULL,
    @email NVARCHAR(100) = NULL,
    @diaChi NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.NhaCungCap
    SET
        tenNhaCungCap = ISNULL(@tenNhaCungCap, tenNhaCungCap),
        sdt = ISNULL(@sdt, sdt),
        email = ISNULL(@email, email),
        diaChi = ISNULL(@diaChi, diaChi)
    WHERE id = @id;

    SELECT TOP 1 id, tenNhaCungCap, sdt, email, diaChi
    FROM dbo.NhaCungCap
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhaCungCap_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhaCungCap_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_NhaCungCap_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.PhieuNhap WHERE idNhaCungCap = @id)
    BEGIN
        RAISERROR(N'Nha cung cap da phat sinh phieu nhap, khong the xoa', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.NhaCungCap
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_TonKho_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TonKho_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_TonKho_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        sp.id AS idSanPham,
        sp.tenSanPham,
        sp.slug,
        ISNULL(SUM(COALESCE(btv.soLuongTon, 0)), 0) AS soLuongTon
    FROM dbo.SanPham sp
    LEFT JOIN dbo.BienTheSanPham btv ON btv.idSanPham = sp.id
    GROUP BY sp.id, sp.tenSanPham, sp.slug
    ORDER BY sp.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_PhieuNhap_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_PhieuNhap_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_PhieuNhap_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        pn.id,
        pn.idNhaCungCap,
        pn.idNhanVienLap,
        pn.tongTien,
        pn.ngayNhap,
        ncc.tenNhaCungCap,
        nv.hoTen AS tenNhanVienLap
    FROM dbo.PhieuNhap pn
    INNER JOIN dbo.NhaCungCap ncc ON ncc.id = pn.idNhaCungCap
    LEFT JOIN dbo.NhanVien nv ON nv.id = pn.idNhanVienLap
    ORDER BY pn.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_PhieuNhap_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_PhieuNhap_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_PhieuNhap_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        pn.id,
        pn.idNhaCungCap,
        pn.idNhanVienLap,
        pn.tongTien,
        pn.ngayNhap,
        ncc.tenNhaCungCap,
        nv.hoTen AS tenNhanVienLap
    FROM dbo.PhieuNhap pn
    INNER JOIN dbo.NhaCungCap ncc ON ncc.id = pn.idNhaCungCap
    LEFT JOIN dbo.NhanVien nv ON nv.id = pn.idNhanVienLap
    WHERE pn.id = @id;

    SELECT
        ctpn.id,
        ctpn.idPhieuNhap,
        ctpn.idSanPham,
        ctpn.soLuong,
        ctpn.giaNhap,
        sp.tenSanPham
    FROM dbo.ChiTietPhieuNhap ctpn
    INNER JOIN dbo.SanPham sp ON sp.id = ctpn.idSanPham
    WHERE ctpn.idPhieuNhap = @id
    ORDER BY ctpn.id ASC;
END
GO

IF OBJECT_ID('dbo.sp_PhieuNhap_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_PhieuNhap_Them;
END
GO

CREATE PROCEDURE dbo.sp_PhieuNhap_Them
    @idNhaCungCap INT,
    @idNhanVienLap INT = NULL,
    @itemsJson NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    DECLARE @items TABLE (
        idSanPham INT,
        soLuong INT,
        giaNhap FLOAT
    );

    INSERT INTO @items (idSanPham, soLuong, giaNhap)
    SELECT idSanPham, soLuong, giaNhap
    FROM OPENJSON(@itemsJson)
    WITH (
        idSanPham INT '$.idSanPham',
        soLuong INT '$.soLuong',
        giaNhap FLOAT '$.giaNhap'
    );

    IF NOT EXISTS (SELECT 1 FROM @items)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR(N'Phieu nhap phai co it nhat mot san pham', 16, 1);
        RETURN;
    END

    INSERT INTO dbo.PhieuNhap (idNhaCungCap, idNhanVienLap, tongTien, ngayNhap)
    VALUES (@idNhaCungCap, @idNhanVienLap, 0, GETDATE());

    DECLARE @newId INT = SCOPE_IDENTITY();

    INSERT INTO dbo.ChiTietPhieuNhap (idPhieuNhap, idSanPham, soLuong, giaNhap)
    SELECT @newId, idSanPham, soLuong, giaNhap
    FROM @items;

    UPDATE dbo.PhieuNhap
    SET tongTien = (
        SELECT SUM(i.soLuong * i.giaNhap)
        FROM @items i
    )
    WHERE id = @newId;

    ;WITH firstVariant AS (
        SELECT
            btv.id,
            btv.idSanPham,
            ROW_NUMBER() OVER (PARTITION BY btv.idSanPham ORDER BY btv.id) AS rn
        FROM dbo.BienTheSanPham btv
    )
    UPDATE btv
    SET btv.soLuongTon = COALESCE(btv.soLuongTon, 0) + agg.soLuongNhap
    FROM dbo.BienTheSanPham btv
    INNER JOIN firstVariant fv ON fv.id = btv.id AND fv.rn = 1
    INNER JOIN (
        SELECT idSanPham, SUM(soLuong) AS soLuongNhap
        FROM @items
        GROUP BY idSanPham
    ) agg ON agg.idSanPham = fv.idSanPham;

    INSERT INTO dbo.BienTheSanPham (idSanPham, sku, mauSac, dungTich, giaBan, soLuongTon)
    SELECT
        agg.idSanPham,
        CONCAT('AUTO-', agg.idSanPham, '-', @newId),
        N'Mac dinh',
        N'Mac dinh',
        sp.giaBan,
        agg.soLuongNhap
    FROM (
        SELECT idSanPham, SUM(soLuong) AS soLuongNhap
        FROM @items
        GROUP BY idSanPham
    ) agg
    INNER JOIN dbo.SanPham sp ON sp.id = agg.idSanPham
    WHERE NOT EXISTS (
        SELECT 1
        FROM dbo.BienTheSanPham btv
        WHERE btv.idSanPham = agg.idSanPham
    );

    COMMIT TRANSACTION;

    EXEC dbo.sp_PhieuNhap_LayTheoId @id = @newId;
END
GO

IF OBJECT_ID('dbo.sp_PhieuNhap_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_PhieuNhap_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_PhieuNhap_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    IF NOT EXISTS (SELECT 1 FROM dbo.PhieuNhap WHERE id = @id)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR(N'Khong tim thay phieu nhap', 16, 1);
        RETURN;
    END

    ;WITH firstVariant AS (
        SELECT
            btv.id,
            btv.idSanPham,
            ROW_NUMBER() OVER (PARTITION BY btv.idSanPham ORDER BY btv.id) AS rn
        FROM dbo.BienTheSanPham btv
    )
    UPDATE btv
    SET btv.soLuongTon = CASE
        WHEN COALESCE(btv.soLuongTon, 0) - agg.soLuongNhap < 0 THEN 0
        ELSE COALESCE(btv.soLuongTon, 0) - agg.soLuongNhap
    END
    FROM dbo.BienTheSanPham btv
    INNER JOIN firstVariant fv ON fv.id = btv.id AND fv.rn = 1
    INNER JOIN (
        SELECT idSanPham, SUM(soLuong) AS soLuongNhap
        FROM dbo.ChiTietPhieuNhap
        WHERE idPhieuNhap = @id
        GROUP BY idSanPham
    ) agg ON agg.idSanPham = fv.idSanPham;

    DELETE FROM dbo.ChiTietPhieuNhap
    WHERE idPhieuNhap = @id;

    DELETE FROM dbo.PhieuNhap
    WHERE id = @id;

    COMMIT TRANSACTION;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_LayTheoTaiKhoan', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_LayTheoTaiKhoan;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_LayTheoTaiKhoan
    @idTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        gh.id,
        gh.idTaiKhoan,
        gh.idSanPham,
        gh.soLuong,
        sp.tenSanPham,
        sp.slug,
        sp.giaBan,
        sp.hinhAnh,
        sp.trangThai
    FROM dbo.GioHang gh
    INNER JOIN dbo.SanPham sp ON sp.id = gh.idSanPham
    WHERE gh.idTaiKhoan = @idTaiKhoan
    ORDER BY gh.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_ThemCapNhat', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_ThemCapNhat;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_ThemCapNhat
    @idTaiKhoan INT,
    @idSanPham INT,
    @soLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @soLuong <= 0
    BEGIN
        RAISERROR(N'soLuong phai lon hon 0', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM dbo.SanPham WHERE id = @idSanPham AND trangThai = 1)
    BEGIN
        RAISERROR(N'San pham khong ton tai hoac da ngung kinh doanh', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM dbo.GioHang WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham)
    BEGIN
        UPDATE dbo.GioHang
        SET soLuong = soLuong + @soLuong
        WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.GioHang (idTaiKhoan, idSanPham, soLuong)
        VALUES (@idTaiKhoan, @idSanPham, @soLuong);
    END

    EXEC dbo.sp_GioHang_LayTheoTaiKhoan @idTaiKhoan = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_CapNhatSoLuong', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_CapNhatSoLuong;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_CapNhatSoLuong
    @idTaiKhoan INT,
    @idSanPham INT,
    @soLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @soLuong < 0
    BEGIN
        RAISERROR(N'soLuong khong duoc am', 16, 1);
        RETURN;
    END

    IF @soLuong = 0
    BEGIN
        DELETE FROM dbo.GioHang
        WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
    END
    ELSE
    BEGIN
        UPDATE dbo.GioHang
        SET soLuong = @soLuong
        WHERE idTaiKhoan = @idTaiKhoan AND idSanPham = @idSanPham;
    END

    EXEC dbo.sp_GioHang_LayTheoTaiKhoan @idTaiKhoan = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_XoaSanPham', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_XoaSanPham;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_XoaSanPham
    @idTaiKhoan INT,
    @idSanPham INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.GioHang
    WHERE idTaiKhoan = @idTaiKhoan
      AND idSanPham = @idSanPham;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_XoaTatCa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_XoaTatCa;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_XoaTatCa
    @idTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.GioHang
    WHERE idTaiKhoan = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_SanPham_CapNhatDiemDanhGia', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_SanPham_CapNhatDiemDanhGia;
END
GO

CREATE PROCEDURE dbo.sp_SanPham_CapNhatDiemDanhGia
    @idSanPham INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @avgScore FLOAT;

    SELECT @avgScore = AVG(CAST(soSao AS FLOAT))
    FROM dbo.DanhGia
    WHERE idSanPham = @idSanPham;

    UPDATE dbo.SanPham
    SET danhGia = ISNULL(@avgScore, 0)
    WHERE id = @idSanPham;
END
GO

IF OBJECT_ID('dbo.sp_DanhGia_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhGia_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_DanhGia_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dg.id,
        dg.idSanPham,
        dg.idTaiKhoan,
        dg.soSao,
        dg.noiDung,
        dg.ngayDanhGia,
        tk.tenDangNhap,
        tk.tenHienThi,
        sp.tenSanPham
    FROM dbo.DanhGia dg
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dg.idTaiKhoan
    INNER JOIN dbo.SanPham sp ON sp.id = dg.idSanPham
    ORDER BY dg.ngayDanhGia DESC, dg.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_DanhGia_LayTheoSanPham', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhGia_LayTheoSanPham;
END
GO

CREATE PROCEDURE dbo.sp_DanhGia_LayTheoSanPham
    @idSanPham INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dg.id,
        dg.idSanPham,
        dg.idTaiKhoan,
        dg.soSao,
        dg.noiDung,
        dg.ngayDanhGia,
        tk.tenDangNhap,
        tk.tenHienThi,
        sp.tenSanPham
    FROM dbo.DanhGia dg
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dg.idTaiKhoan
    INNER JOIN dbo.SanPham sp ON sp.id = dg.idSanPham
    WHERE dg.idSanPham = @idSanPham
    ORDER BY dg.ngayDanhGia DESC, dg.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_DanhGia_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhGia_Them;
END
GO

CREATE PROCEDURE dbo.sp_DanhGia_Them
    @idSanPham INT,
    @idTaiKhoan INT,
    @soSao INT,
    @noiDung NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @soSao < 1 OR @soSao > 5
    BEGIN
        RAISERROR(N'soSao phai trong khoang 1-5', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM dbo.SanPham WHERE id = @idSanPham)
    BEGIN
        RAISERROR(N'Khong tim thay san pham', 16, 1);
        RETURN;
    END

    IF EXISTS (SELECT 1 FROM dbo.DanhGia WHERE idSanPham = @idSanPham AND idTaiKhoan = @idTaiKhoan)
    BEGIN
        UPDATE dbo.DanhGia
        SET soSao = @soSao,
            noiDung = @noiDung,
            ngayDanhGia = GETDATE()
        WHERE idSanPham = @idSanPham AND idTaiKhoan = @idTaiKhoan;
    END
    ELSE
    BEGIN
        INSERT INTO dbo.DanhGia (idSanPham, idTaiKhoan, soSao, noiDung, ngayDanhGia)
        VALUES (@idSanPham, @idTaiKhoan, @soSao, @noiDung, GETDATE());
    END

    EXEC dbo.sp_SanPham_CapNhatDiemDanhGia @idSanPham = @idSanPham;

    SELECT TOP 1
        dg.id,
        dg.idSanPham,
        dg.idTaiKhoan,
        dg.soSao,
        dg.noiDung,
        dg.ngayDanhGia,
        tk.tenDangNhap,
        tk.tenHienThi,
        sp.tenSanPham
    FROM dbo.DanhGia dg
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dg.idTaiKhoan
    INNER JOIN dbo.SanPham sp ON sp.id = dg.idSanPham
    WHERE dg.idSanPham = @idSanPham
      AND dg.idTaiKhoan = @idTaiKhoan
    ORDER BY dg.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_DanhGia_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhGia_Sua;
END
GO

CREATE PROCEDURE dbo.sp_DanhGia_Sua
    @id INT,
    @idTaiKhoan INT,
    @isAdmin BIT = 0,
    @soSao INT = NULL,
    @noiDung NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idSanPham INT;

    SELECT @idSanPham = idSanPham
    FROM dbo.DanhGia
    WHERE id = @id
      AND (@isAdmin = 1 OR idTaiKhoan = @idTaiKhoan);

    IF @idSanPham IS NULL
    BEGIN
        RAISERROR(N'Khong tim thay danh gia hoac khong co quyen cap nhat', 16, 1);
        RETURN;
    END

    IF @soSao IS NOT NULL AND (@soSao < 1 OR @soSao > 5)
    BEGIN
        RAISERROR(N'soSao phai trong khoang 1-5', 16, 1);
        RETURN;
    END

    UPDATE dbo.DanhGia
    SET
        soSao = ISNULL(@soSao, soSao),
        noiDung = ISNULL(@noiDung, noiDung),
        ngayDanhGia = GETDATE()
    WHERE id = @id
      AND (@isAdmin = 1 OR idTaiKhoan = @idTaiKhoan);

    EXEC dbo.sp_SanPham_CapNhatDiemDanhGia @idSanPham = @idSanPham;

    SELECT TOP 1
        dg.id,
        dg.idSanPham,
        dg.idTaiKhoan,
        dg.soSao,
        dg.noiDung,
        dg.ngayDanhGia,
        tk.tenDangNhap,
        tk.tenHienThi,
        sp.tenSanPham
    FROM dbo.DanhGia dg
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dg.idTaiKhoan
    INNER JOIN dbo.SanPham sp ON sp.id = dg.idSanPham
    WHERE dg.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_DanhGia_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhGia_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_DanhGia_Xoa
    @id INT,
    @idTaiKhoan INT,
    @isAdmin BIT = 0
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idSanPham INT;

    SELECT @idSanPham = idSanPham
    FROM dbo.DanhGia
    WHERE id = @id
      AND (@isAdmin = 1 OR idTaiKhoan = @idTaiKhoan);

    IF @idSanPham IS NULL
    BEGIN
        RAISERROR(N'Khong tim thay danh gia hoac khong co quyen xoa', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.DanhGia
    WHERE id = @id
      AND (@isAdmin = 1 OR idTaiKhoan = @idTaiKhoan);

    EXEC dbo.sp_SanPham_CapNhatDiemDanhGia @idSanPham = @idSanPham;
END
GO

IF OBJECT_ID('dbo.sp_BaoCao_TongQuan', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_BaoCao_TongQuan;
END
GO

CREATE PROCEDURE dbo.sp_BaoCao_TongQuan
    @fromDate DATETIME = NULL,
    @toDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS tongDonHang,
        ISNULL(SUM(dh.tongTien), 0) AS tongDoanhThu,
        COUNT(DISTINCT dh.idTaiKhoan) AS tongKhachHang,
        ISNULL(SUM(ctdh.soLuong), 0) AS tongSanPhamBan
    FROM dbo.DonHang dh
    LEFT JOIN dbo.ChiTietDonHang ctdh ON ctdh.idDonHang = dh.id
    WHERE (@fromDate IS NULL OR dh.ngayDatHang >= @fromDate)
      AND (@toDate IS NULL OR dh.ngayDatHang < DATEADD(DAY, 1, @toDate))
      AND ISNULL(dh.trangThai, N'') NOT IN (N'Da huy', N'Huy', N'Canceled', N'Cancelled');
END
GO

IF OBJECT_ID('dbo.sp_BaoCao_DoanhThuTheoNgay', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_BaoCao_DoanhThuTheoNgay;
END
GO

CREATE PROCEDURE dbo.sp_BaoCao_DoanhThuTheoNgay
    @fromDate DATETIME = NULL,
    @toDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        CAST(dh.ngayDatHang AS DATE) AS ngay,
        ISNULL(SUM(dh.tongTien), 0) AS doanhThu,
        COUNT(*) AS soDonHang
    FROM dbo.DonHang dh
    WHERE (@fromDate IS NULL OR dh.ngayDatHang >= @fromDate)
      AND (@toDate IS NULL OR dh.ngayDatHang < DATEADD(DAY, 1, @toDate))
      AND ISNULL(dh.trangThai, N'') NOT IN (N'Da huy', N'Huy', N'Canceled', N'Cancelled')
    GROUP BY CAST(dh.ngayDatHang AS DATE)
    ORDER BY CAST(dh.ngayDatHang AS DATE) DESC;
END
GO

IF OBJECT_ID('dbo.sp_BaoCao_SanPhamBanChay', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_BaoCao_SanPhamBanChay;
END
GO

CREATE PROCEDURE dbo.sp_BaoCao_SanPhamBanChay
    @topN INT = 10,
    @fromDate DATETIME = NULL,
    @toDate DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @topN <= 0
    BEGIN
        SET @topN = 10;
    END

    SELECT TOP (@topN)
        ctdh.idSanPham,
        sp.tenSanPham,
        SUM(ctdh.soLuong) AS soLuongBan,
        SUM(ctdh.soLuong * ctdh.gia) AS doanhThu
    FROM dbo.ChiTietDonHang ctdh
    INNER JOIN dbo.DonHang dh ON dh.id = ctdh.idDonHang
    INNER JOIN dbo.SanPham sp ON sp.id = ctdh.idSanPham
    WHERE (@fromDate IS NULL OR dh.ngayDatHang >= @fromDate)
      AND (@toDate IS NULL OR dh.ngayDatHang < DATEADD(DAY, 1, @toDate))
      AND ISNULL(dh.trangThai, N'') NOT IN (N'Da huy', N'Huy', N'Canceled', N'Cancelled')
    GROUP BY ctdh.idSanPham, sp.tenSanPham
    ORDER BY SUM(ctdh.soLuong) DESC, SUM(ctdh.soLuong * ctdh.gia) DESC;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_LayTheoTaiKhoan', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_LayTheoTaiKhoan;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_LayTheoTaiKhoan
    @idTaiKhoan INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        gh.id,
        gh.idTaiKhoan,
        gh.idSanPham,
        gh.idBienThe,
        gh.soLuong,
        sp.tenSanPham,
        sp.slug,
        bv.mauSac,
        bv.dungTich,
        bv.congSuat,
        COALESCE(bv.giaBan, sp.giaBan) AS giaBan,
        sp.hinhAnh,
        sp.trangThai
    FROM dbo.GioHang gh
    INNER JOIN dbo.SanPham sp ON sp.id = gh.idSanPham
    LEFT JOIN dbo.BienTheSanPham bv ON bv.id = gh.idBienThe
    WHERE gh.idTaiKhoan = @idTaiKhoan
    ORDER BY gh.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_ThemCapNhat', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_ThemCapNhat;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_ThemCapNhat
    @idTaiKhoan INT,
    @idSanPham INT,
    @soLuong INT,
    @idBienThe INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF @soLuong <= 0
    BEGIN
        RAISERROR(N'soLuong phai lon hon 0', 16, 1);
        RETURN;
    END

    IF NOT EXISTS (SELECT 1 FROM dbo.SanPham WHERE id = @idSanPham AND trangThai = 1)
    BEGIN
        RAISERROR(N'San pham khong ton tai hoac da ngung kinh doanh', 16, 1);
        RETURN;
    END

    IF @idBienThe IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM dbo.BienTheSanPham WHERE id = @idBienThe AND idSanPham = @idSanPham)
    BEGIN
        RAISERROR(N'Bien the khong hop le', 16, 1);
        RETURN;
    END

    IF EXISTS (
        SELECT 1
        FROM dbo.GioHang
        WHERE idTaiKhoan = @idTaiKhoan
          AND idSanPham = @idSanPham
          AND ((idBienThe IS NULL AND @idBienThe IS NULL) OR idBienThe = @idBienThe)
    )
    BEGIN
        UPDATE dbo.GioHang
        SET soLuong = soLuong + @soLuong
        WHERE idTaiKhoan = @idTaiKhoan
          AND idSanPham = @idSanPham
          AND ((idBienThe IS NULL AND @idBienThe IS NULL) OR idBienThe = @idBienThe);
    END
    ELSE
    BEGIN
        INSERT INTO dbo.GioHang (idTaiKhoan, idSanPham, idBienThe, soLuong)
        VALUES (@idTaiKhoan, @idSanPham, @idBienThe, @soLuong);
    END

    EXEC dbo.sp_GioHang_LayTheoTaiKhoan @idTaiKhoan = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_CapNhatSoLuong', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_CapNhatSoLuong;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_CapNhatSoLuong
    @idTaiKhoan INT,
    @idGioHang INT,
    @soLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    IF @soLuong < 0
    BEGIN
        RAISERROR(N'soLuong khong duoc am', 16, 1);
        RETURN;
    END

    IF @soLuong = 0
    BEGIN
        DELETE FROM dbo.GioHang
        WHERE idTaiKhoan = @idTaiKhoan AND id = @idGioHang;
    END
    ELSE
    BEGIN
        UPDATE dbo.GioHang
        SET soLuong = @soLuong
        WHERE idTaiKhoan = @idTaiKhoan AND id = @idGioHang;
    END

    EXEC dbo.sp_GioHang_LayTheoTaiKhoan @idTaiKhoan = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_GioHang_XoaSanPham', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_GioHang_XoaSanPham;
END
GO

CREATE PROCEDURE dbo.sp_GioHang_XoaSanPham
    @idTaiKhoan INT,
    @idGioHang INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.GioHang
    WHERE idTaiKhoan = @idTaiKhoan
      AND id = @idGioHang;
END
GO

IF OBJECT_ID('dbo.sp_Voucher_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Voucher_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_Voucher_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        id,
        maVoucher,
        loaiGiam,
        giaTri,
        ngayBatDau,
        ngayKetThuc,
        soLuong
    FROM dbo.Voucher
    ORDER BY id DESC;
END
GO

IF OBJECT_ID('dbo.sp_Voucher_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Voucher_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_Voucher_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        id,
        maVoucher,
        loaiGiam,
        giaTri,
        ngayBatDau,
        ngayKetThuc,
        soLuong
    FROM dbo.Voucher
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_Voucher_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Voucher_Them;
END
GO

CREATE PROCEDURE dbo.sp_Voucher_Them
    @maVoucher NVARCHAR(50),
    @loaiGiam NVARCHAR(50),
    @giaTri FLOAT,
    @ngayBatDau DATETIME = NULL,
    @ngayKetThuc DATETIME,
    @soLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.Voucher (maVoucher, loaiGiam, giaTri, ngayBatDau, ngayKetThuc, soLuong)
    VALUES (@maVoucher, @loaiGiam, @giaTri, ISNULL(@ngayBatDau, GETDATE()), @ngayKetThuc, @soLuong);

    SELECT TOP 1
        id,
        maVoucher,
        loaiGiam,
        giaTri,
        ngayBatDau,
        ngayKetThuc,
        soLuong
    FROM dbo.Voucher
    WHERE id = SCOPE_IDENTITY();
END
GO

IF OBJECT_ID('dbo.sp_Voucher_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Voucher_Sua;
END
GO

CREATE PROCEDURE dbo.sp_Voucher_Sua
    @id INT,
    @maVoucher NVARCHAR(50) = NULL,
    @loaiGiam NVARCHAR(50) = NULL,
    @giaTri FLOAT = NULL,
    @ngayBatDau DATETIME = NULL,
    @ngayKetThuc DATETIME = NULL,
    @soLuong INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.Voucher
    SET
        maVoucher = ISNULL(@maVoucher, maVoucher),
        loaiGiam = ISNULL(@loaiGiam, loaiGiam),
        giaTri = ISNULL(@giaTri, giaTri),
        ngayBatDau = ISNULL(@ngayBatDau, ngayBatDau),
        ngayKetThuc = ISNULL(@ngayKetThuc, ngayKetThuc),
        soLuong = ISNULL(@soLuong, soLuong)
    WHERE id = @id;

    SELECT TOP 1
        id,
        maVoucher,
        loaiGiam,
        giaTri,
        ngayBatDau,
        ngayKetThuc,
        soLuong
    FROM dbo.Voucher
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_Voucher_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_Voucher_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_Voucher_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.Voucher
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhanVien_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhanVien_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_NhanVien_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        nv.id,
        nv.idTaiKhoan,
        nv.maNhanVien,
        nv.hoTen,
        nv.sdt,
        nv.email,
        nv.diaChi,
        nv.chucVu,
        nv.boPhan,
        nv.ngayVaoLam,
        nv.luongCoBan,
        nv.trangThai
    FROM dbo.NhanVien nv
    ORDER BY nv.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_NhanVien_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhanVien_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_NhanVien_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        nv.id,
        nv.idTaiKhoan,
        nv.maNhanVien,
        nv.hoTen,
        nv.sdt,
        nv.email,
        nv.diaChi,
        nv.chucVu,
        nv.boPhan,
        nv.ngayVaoLam,
        nv.luongCoBan,
        nv.trangThai
    FROM dbo.NhanVien nv
    WHERE nv.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhanVien_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhanVien_Them;
END
GO

CREATE PROCEDURE dbo.sp_NhanVien_Them
    @idTaiKhoan INT = NULL,
    @maNhanVien NVARCHAR(50),
    @hoTen NVARCHAR(100),
    @sdt NVARCHAR(20) = NULL,
    @email NVARCHAR(100) = NULL,
    @diaChi NVARCHAR(255) = NULL,
    @chucVu NVARCHAR(100) = NULL,
    @boPhan NVARCHAR(100) = NULL,
    @ngayVaoLam DATE = NULL,
    @luongCoBan FLOAT = NULL,
    @trangThai BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    IF @idTaiKhoan IS NULL
    BEGIN
        DECLARE @tenDangNhap NVARCHAR(50);
        DECLARE @baseTenDangNhap NVARCHAR(50);
        DECLARE @index INT;

        SET @baseTenDangNhap = LOWER(REPLACE(@maNhanVien, ' ', ''));
        SET @tenDangNhap = @baseTenDangNhap;
        SET @index = 1;

        WHILE EXISTS (SELECT 1 FROM dbo.TaiKhoan WHERE tenDangNhap = @tenDangNhap)
        BEGIN
            SET @tenDangNhap = CONCAT(@baseTenDangNhap, @index);
            SET @index = @index + 1;
        END

        INSERT INTO dbo.TaiKhoan (tenDangNhap, matKhau, tenHienThi, email, sdt, diaChi, vaiTro, trangThai)
        VALUES (@tenDangNhap, '123456', @hoTen, @email, @sdt, @diaChi, 'Employee', 1);

        SET @idTaiKhoan = SCOPE_IDENTITY();
    END

    INSERT INTO dbo.NhanVien
    (
        idTaiKhoan,
        maNhanVien,
        hoTen,
        sdt,
        email,
        diaChi,
        chucVu,
        boPhan,
        ngayVaoLam,
        luongCoBan,
        trangThai
    )
    VALUES
    (
        @idTaiKhoan,
        @maNhanVien,
        @hoTen,
        @sdt,
        @email,
        @diaChi,
        @chucVu,
        @boPhan,
        ISNULL(@ngayVaoLam, CAST(GETDATE() AS DATE)),
        @luongCoBan,
        @trangThai
    );

    SELECT TOP 1
        nv.id,
        nv.idTaiKhoan,
        nv.maNhanVien,
        nv.hoTen,
        nv.sdt,
        nv.email,
        nv.diaChi,
        nv.chucVu,
        nv.boPhan,
        nv.ngayVaoLam,
        nv.luongCoBan,
        nv.trangThai
    FROM dbo.NhanVien nv
    WHERE nv.id = SCOPE_IDENTITY();
END
GO

IF OBJECT_ID('dbo.sp_NhanVien_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhanVien_Sua;
END
GO

CREATE PROCEDURE dbo.sp_NhanVien_Sua
    @id INT,
    @maNhanVien NVARCHAR(50) = NULL,
    @hoTen NVARCHAR(100) = NULL,
    @sdt NVARCHAR(20) = NULL,
    @email NVARCHAR(100) = NULL,
    @diaChi NVARCHAR(255) = NULL,
    @chucVu NVARCHAR(100) = NULL,
    @boPhan NVARCHAR(100) = NULL,
    @ngayVaoLam DATE = NULL,
    @luongCoBan FLOAT = NULL,
    @trangThai BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.NhanVien
    SET
        maNhanVien = ISNULL(@maNhanVien, maNhanVien),
        hoTen = ISNULL(@hoTen, hoTen),
        sdt = ISNULL(@sdt, sdt),
        email = ISNULL(@email, email),
        diaChi = ISNULL(@diaChi, diaChi),
        chucVu = ISNULL(@chucVu, chucVu),
        boPhan = ISNULL(@boPhan, boPhan),
        ngayVaoLam = ISNULL(@ngayVaoLam, ngayVaoLam),
        luongCoBan = ISNULL(@luongCoBan, luongCoBan),
        trangThai = ISNULL(@trangThai, trangThai)
    WHERE id = @id;

    SELECT TOP 1
        nv.id,
        nv.idTaiKhoan,
        nv.maNhanVien,
        nv.hoTen,
        nv.sdt,
        nv.email,
        nv.diaChi,
        nv.chucVu,
        nv.boPhan,
        nv.ngayVaoLam,
        nv.luongCoBan,
        nv.trangThai
    FROM dbo.NhanVien nv
    WHERE nv.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_NhanVien_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_NhanVien_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_NhanVien_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.NhanVien
    SET trangThai = 0
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_DonHang_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DonHang_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_DonHang_LayDanhSach
    @idTaiKhoan INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dh.id,
        dh.maDonHang,
        dh.idTaiKhoan,
        dh.idNhanVienXuly,
        dh.tongTien,
        dh.trangThai,
        dh.diaChi,
        dh.phuongThucThanhToan,
        dh.ngayDatHang,
        tk.sdt AS soDienThoai,
        nv.hoTen AS tenNguoiXacNhan,
        ctdh.idSanPham,
        sp.tenSanPham,
        sp.hinhAnh,
        ctdh.gia,
        ctdh.soLuong
    FROM dbo.DonHang dh
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dh.idTaiKhoan
    LEFT JOIN dbo.NhanVien nv ON nv.id = dh.idNhanVienXuly
    LEFT JOIN dbo.ChiTietDonHang ctdh ON ctdh.idDonHang = dh.id
    LEFT JOIN dbo.SanPham sp ON sp.id = ctdh.idSanPham
    WHERE @idTaiKhoan IS NULL OR dh.idTaiKhoan = @idTaiKhoan
    ORDER BY dh.id DESC, ctdh.id ASC;
END
GO

IF OBJECT_ID('dbo.sp_DonHang_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DonHang_Them;
END
GO

CREATE PROCEDURE dbo.sp_DonHang_Them
    @idTaiKhoan INT,
    @diaChi NVARCHAR(MAX),
    @phuongThucThanhToan NVARCHAR(50),
    @tongTien FLOAT,
    @trangThai NVARCHAR(50) = 'pending'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @maDonHang NVARCHAR(50);
    SET @maDonHang = CONCAT('DH', RIGHT(CONCAT('000000', CAST(ABS(CHECKSUM(NEWID())) % 1000000 AS NVARCHAR(10))), 6));

    INSERT INTO dbo.DonHang (maDonHang, idTaiKhoan, tongTien, trangThai, diaChi, phuongThucThanhToan, ngayDatHang)
    VALUES (@maDonHang, @idTaiKhoan, @tongTien, @trangThai, @diaChi, @phuongThucThanhToan, GETDATE());

    SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
END
GO

IF OBJECT_ID('dbo.sp_DonHang_ThemChiTiet', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DonHang_ThemChiTiet;
END
GO

CREATE PROCEDURE dbo.sp_DonHang_ThemChiTiet
    @idDonHang INT,
    @idSanPham INT,
    @gia FLOAT,
    @soLuong INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.ChiTietDonHang (idDonHang, idSanPham, gia, soLuong)
    VALUES (@idDonHang, @idSanPham, @gia, @soLuong);
END
GO

IF OBJECT_ID('dbo.sp_DonHang_CapNhatTrangThai', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DonHang_CapNhatTrangThai;
END
GO

CREATE PROCEDURE dbo.sp_DonHang_CapNhatTrangThai
    @id INT,
    @trangThai NVARCHAR(50),
    @idNhanVienXuly INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.DonHang
    SET
        trangThai = @trangThai,
        idNhanVienXuly = ISNULL(@idNhanVienXuly, idNhanVienXuly)
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_KhachHang_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_KhachHang_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_KhachHang_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        kh.id,
        kh.idTaiKhoan,
        kh.maKhachHang,
        kh.hoTen,
        kh.ngaySinh,
        kh.gioiTinh,
        kh.ghiChu,
        kh.trangThai,
        tk.tenDangNhap,
        tk.email,
        tk.sdt,
        tk.diaChi
    FROM dbo.KhachHang kh
    INNER JOIN dbo.TaiKhoan tk ON tk.id = kh.idTaiKhoan
    ORDER BY kh.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_KhachHang_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_KhachHang_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_KhachHang_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        kh.id,
        kh.idTaiKhoan,
        kh.maKhachHang,
        kh.hoTen,
        kh.ngaySinh,
        kh.gioiTinh,
        kh.ghiChu,
        kh.trangThai,
        tk.tenDangNhap,
        tk.email,
        tk.sdt,
        tk.diaChi
    FROM dbo.KhachHang kh
    INNER JOIN dbo.TaiKhoan tk ON tk.id = kh.idTaiKhoan
    WHERE kh.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_KhachHang_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_KhachHang_Sua;
END
GO

CREATE PROCEDURE dbo.sp_KhachHang_Sua
    @id INT,
    @hoTen NVARCHAR(100) = NULL,
    @ngaySinh DATE = NULL,
    @gioiTinh NVARCHAR(10) = NULL,
    @ghiChu NVARCHAR(255) = NULL,
    @email NVARCHAR(100) = NULL,
    @sdt NVARCHAR(15) = NULL,
    @diaChi NVARCHAR(255) = NULL,
    @trangThai BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idTaiKhoan INT;

    SELECT @idTaiKhoan = idTaiKhoan
    FROM dbo.KhachHang
    WHERE id = @id;

    UPDATE dbo.KhachHang
    SET
        hoTen = ISNULL(@hoTen, hoTen),
        ngaySinh = ISNULL(@ngaySinh, ngaySinh),
        gioiTinh = ISNULL(@gioiTinh, gioiTinh),
        ghiChu = ISNULL(@ghiChu, ghiChu),
        trangThai = ISNULL(@trangThai, trangThai)
    WHERE id = @id;

    UPDATE dbo.TaiKhoan
    SET
        tenHienThi = ISNULL(@hoTen, tenHienThi),
        email = ISNULL(@email, email),
        sdt = ISNULL(@sdt, sdt),
        diaChi = ISNULL(@diaChi, diaChi),
        trangThai = ISNULL(@trangThai, trangThai)
    WHERE id = @idTaiKhoan;

    EXEC dbo.sp_KhachHang_LayTheoId @id = @id;
END
GO

IF OBJECT_ID('dbo.sp_KhachHang_XoaMem', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_KhachHang_XoaMem;
END
GO

CREATE PROCEDURE dbo.sp_KhachHang_XoaMem
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @idTaiKhoan INT;

    SELECT @idTaiKhoan = idTaiKhoan
    FROM dbo.KhachHang
    WHERE id = @id;

    UPDATE dbo.KhachHang
    SET trangThai = 0
    WHERE id = @id;

    UPDATE dbo.TaiKhoan
    SET trangThai = 0
    WHERE id = @idTaiKhoan;
END
GO

IF OBJECT_ID('dbo.sp_TinTuc_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TinTuc_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_TinTuc_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        tt.id,
        tt.idNhanVienDang,
        tt.tieuDe,
        tt.slug,
        tt.noiDung,
        tt.hinhAnh,
        tt.ngayDang,
        nv.hoTen AS tenNhanVienDang
    FROM dbo.TinTuc tt
    LEFT JOIN dbo.NhanVien nv ON nv.id = tt.idNhanVienDang
    ORDER BY tt.ngayDang DESC, tt.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_TinTuc_LayTheoSlug', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TinTuc_LayTheoSlug;
END
GO

CREATE PROCEDURE dbo.sp_TinTuc_LayTheoSlug
    @slug NVARCHAR(300)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        tt.id,
        tt.idNhanVienDang,
        tt.tieuDe,
        tt.slug,
        tt.noiDung,
        tt.hinhAnh,
        tt.ngayDang,
        nv.hoTen AS tenNhanVienDang
    FROM dbo.TinTuc tt
    LEFT JOIN dbo.NhanVien nv ON nv.id = tt.idNhanVienDang
    WHERE tt.slug = @slug;
END
GO

IF OBJECT_ID('dbo.sp_TinTuc_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TinTuc_Them;
END
GO

CREATE PROCEDURE dbo.sp_TinTuc_Them
    @idNhanVienDang INT = NULL,
    @tieuDe NVARCHAR(300),
    @slug NVARCHAR(300),
    @noiDung NVARCHAR(MAX),
    @hinhAnh NVARCHAR(255) = NULL,
    @ngayDang DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.TinTuc (idNhanVienDang, tieuDe, slug, noiDung, hinhAnh, ngayDang)
    VALUES (@idNhanVienDang, @tieuDe, @slug, @noiDung, @hinhAnh, ISNULL(@ngayDang, GETDATE()));

    DECLARE @id INT;
    SET @id = SCOPE_IDENTITY();

    SELECT TOP 1
        tt.id,
        tt.idNhanVienDang,
        tt.tieuDe,
        tt.slug,
        tt.noiDung,
        tt.hinhAnh,
        tt.ngayDang,
        nv.hoTen AS tenNhanVienDang
    FROM dbo.TinTuc tt
    LEFT JOIN dbo.NhanVien nv ON nv.id = tt.idNhanVienDang
    WHERE tt.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_TinTuc_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TinTuc_Sua;
END
GO

CREATE PROCEDURE dbo.sp_TinTuc_Sua
    @id INT,
    @idNhanVienDang INT = NULL,
    @tieuDe NVARCHAR(300) = NULL,
    @slug NVARCHAR(300) = NULL,
    @noiDung NVARCHAR(MAX) = NULL,
    @hinhAnh NVARCHAR(255) = NULL,
    @ngayDang DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.TinTuc
    SET
        idNhanVienDang = ISNULL(@idNhanVienDang, idNhanVienDang),
        tieuDe = ISNULL(@tieuDe, tieuDe),
        slug = ISNULL(@slug, slug),
        noiDung = ISNULL(@noiDung, noiDung),
        hinhAnh = ISNULL(@hinhAnh, hinhAnh),
        ngayDang = ISNULL(@ngayDang, ngayDang)
    WHERE id = @id;

    SELECT TOP 1
        tt.id,
        tt.idNhanVienDang,
        tt.tieuDe,
        tt.slug,
        tt.noiDung,
        tt.hinhAnh,
        tt.ngayDang,
        nv.hoTen AS tenNhanVienDang
    FROM dbo.TinTuc tt
    LEFT JOIN dbo.NhanVien nv ON nv.id = tt.idNhanVienDang
    WHERE tt.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_TinTuc_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_TinTuc_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_TinTuc_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM dbo.TinTuc
    WHERE id = @id;
END
GO

IF OBJECT_ID('dbo.sp_HoaDon_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_HoaDon_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_HoaDon_LayDanhSach
    @idTaiKhoan INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dh.id AS idDonHang,
        dh.maDonHang,
        CONCAT('HD', RIGHT(CONCAT('000000', CAST(dh.id AS NVARCHAR(10))), 6)) AS maHoaDon,
        dh.idTaiKhoan,
        dh.tongTien,
        dh.trangThai,
        dh.diaChi,
        dh.phuongThucThanhToan,
        dh.ngayDatHang,
        tk.sdt AS soDienThoai
    FROM dbo.DonHang dh
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dh.idTaiKhoan
    WHERE @idTaiKhoan IS NULL OR dh.idTaiKhoan = @idTaiKhoan
    ORDER BY dh.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_HoaDon_LayTheoDonHang', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_HoaDon_LayTheoDonHang;
END
GO

CREATE PROCEDURE dbo.sp_HoaDon_LayTheoDonHang
    @idDonHang INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        dh.id AS idDonHang,
        dh.maDonHang,
        CONCAT('HD', RIGHT(CONCAT('000000', CAST(dh.id AS NVARCHAR(10))), 6)) AS maHoaDon,
        dh.idTaiKhoan,
        dh.tongTien,
        dh.trangThai,
        dh.diaChi,
        dh.phuongThucThanhToan,
        dh.ngayDatHang,
        tk.sdt AS soDienThoai
    FROM dbo.DonHang dh
    INNER JOIN dbo.TaiKhoan tk ON tk.id = dh.idTaiKhoan
    WHERE dh.id = @idDonHang;
END
GO

IF OBJECT_ID('dbo.sp_DanhMuc_LayDanhSach', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhMuc_LayDanhSach;
END
GO

CREATE PROCEDURE dbo.sp_DanhMuc_LayDanhSach
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        dm.id,
        dm.tenDanhMuc,
        dm.slug,
        dm.moTa,
        dm.trangThai
    FROM dbo.DanhMuc dm
    ORDER BY dm.id DESC;
END
GO

IF OBJECT_ID('dbo.sp_DanhMuc_LayTheoId', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhMuc_LayTheoId;
END
GO

CREATE PROCEDURE dbo.sp_DanhMuc_LayTheoId
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        dm.id,
        dm.tenDanhMuc,
        dm.slug,
        dm.moTa,
        dm.trangThai
    FROM dbo.DanhMuc dm
    WHERE dm.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_DanhMuc_Them', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhMuc_Them;
END
GO

CREATE PROCEDURE dbo.sp_DanhMuc_Them
    @tenDanhMuc NVARCHAR(200),
    @slug NVARCHAR(255) = NULL,
    @moTa NVARCHAR(MAX) = NULL,
    @trangThai BIT = 1
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.DanhMuc (tenDanhMuc, slug, moTa, trangThai)
    VALUES (@tenDanhMuc, @slug, @moTa, @trangThai);

    DECLARE @newId INT = SCOPE_IDENTITY();

    SELECT TOP 1
        dm.id,
        dm.tenDanhMuc,
        dm.slug,
        dm.moTa,
        dm.trangThai
    FROM dbo.DanhMuc dm
    WHERE dm.id = @newId;
END
GO

IF OBJECT_ID('dbo.sp_DanhMuc_Sua', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhMuc_Sua;
END
GO

CREATE PROCEDURE dbo.sp_DanhMuc_Sua
    @id INT,
    @tenDanhMuc NVARCHAR(200) = NULL,
    @slug NVARCHAR(255) = NULL,
    @moTa NVARCHAR(MAX) = NULL,
    @trangThai BIT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.DanhMuc
    SET
        tenDanhMuc = ISNULL(@tenDanhMuc, tenDanhMuc),
        slug = ISNULL(@slug, slug),
        moTa = ISNULL(@moTa, moTa),
        trangThai = ISNULL(@trangThai, trangThai)
    WHERE id = @id;

    SELECT TOP 1
        dm.id,
        dm.tenDanhMuc,
        dm.slug,
        dm.moTa,
        dm.trangThai
    FROM dbo.DanhMuc dm
    WHERE dm.id = @id;
END
GO

IF OBJECT_ID('dbo.sp_DanhMuc_Xoa', 'P') IS NOT NULL
BEGIN
    DROP PROCEDURE dbo.sp_DanhMuc_Xoa;
END
GO

CREATE PROCEDURE dbo.sp_DanhMuc_Xoa
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM dbo.SanPham WHERE idDanhMuc = @id)
    BEGIN
        RAISERROR(N'Danh muc dang duoc su dung boi san pham, khong the xoa', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.DanhMuc
    WHERE id = @id;
END
GO
