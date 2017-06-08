# khai báo sử dụng cơ sở dữ liệu grocerydb
use `grocerydb`;

delimiter $$
# Nếu tồn tại procedure thì xóa nó đi
drop procedure if exists `ImportWareHouse` $$
# Tạo mới procedure
create procedure `ImportWareHouse` (
in _SanPham varchar(500),
in _SoLuong int,
in _GiaNhap int,
in _DanhMuc varchar(200),
in _ChiNhanh varchar(200),
in _NhaCungCap varchar(200),
out _Result int,
out _Message nvarchar(4000)
)
begin
	# Các biến môi trường sử dụng
    declare _IdDanhMuc int default -1;
    declare _IdSanPham int default -1;
    declare _IdNhaCungCap int default -1;
    declare _IdChiNhanh int default -1;
    declare _IdKhoHang int default -1;
    # Bắt sự kiện phát sinh lỗi
    declare exit handler for sqlexception
    begin
		# Xử lý nếu có lỗi xảy ra
        set _Result = -1;
        # Lấy thông tin lỗi : @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO
        GET DIAGNOSTICS CONDITION 1 _Message = MESSAGE_TEXT;
        # quay lại thời điểm tạo transaction
        rollback;
    end;
    # Tạo transaction mới
    start transaction;
    # Thực hiện các câu lênh có thể xảy ra lỗi
    # Kiểm tra xem chi nhánh có tồn tại hay không, nếu không thông báo lỗi và kết thúc
    select IdBranch into _IdChiNhanh from `branch` where NameBranch like _ChiNhanh COLLATE utf8_unicode_ci;
    if(_IdChiNhanh > 0) then
		# Kiểm tra xem danh mục có tồn tại không nếu không thì thêm mới
		select IdCategory into _IdDanhMuc from `category` where Name like _DanhMuc COLLATE utf8_unicode_ci;
		if(_IdDanhMuc < 1) then
			insert into `category`(Name, DateCreate, State) value(_DanhMuc, localtime, 0);
			set _IdDanhMuc = last_insert_id();
		end if;
		# Kiểm tra sản phẩm đã tồn tại chưa nếu chưa thì thêm mới
		select IdProduct into _IdSanPham from `product` where Name like _SanPham COLLATE utf8_unicode_ci;
		if (_IdSanPham < 1) then
			insert into `product`(CategoryId, Name, Price, DateUpdate) values(_IdDanhMuc, _SanPham, _GiaNhap, localtime);
			set _IdSanPham = last_insert_id();
		end if;
		# Kiểm tra nhà cung cấp đã tồn tại chưa nếu chưa thì thêm mới
		select IdSupplier into _IdNhaCungCap from `supplier` where ContactName like _NhaCungCap COLLATE utf8_unicode_ci;
		if (_IdNhaCungCap < 1) then
			insert into `supplier`(ContactName, ContactPhone) values(_NhaCungCap, '01234567899');
			set _IdNhaCungCap = last_insert_id();
		end if;
		# Kiểm tra và cập nhật kho
		if exists (select * from `depot` where BranchId=_IdChiNhanh and ProductId=_IdSanPham limit 1) then
			update `depot` SET NewNumber = NewNumber + _SoLuong, NewPrice = _GiaNhap, DateUpdate = localtime WHERE BranchId = _IdChiNhanh AND ProductId = _IdSanPham;
		else
			insert into `depot`(BranchId, ProductId, NewNumber, NewPrice, DateUpdate) values(_IdChiNhanh, _IdSanPham, _SoLuong, _GiaNhap, localtime);
		end if;
        # Cập nhật thông tin nhập kho
        select IdWarehousing into _IdKhoHang from `warehousing` where SupplierId = _IdNhaCungCap and BranchId = _IdChiNhanh and Date(DateCreate) = CURDATE(); 
        if (_IdKhoHang < 1) then
			insert into `warehousing`(SupplierId, BranchId, DateCreate, TotalCost) values(_IdNhaCungCap, _IdChiNhanh, localtime, _SoLuong * _GiaNhap);
			set _IdKhoHang = last_insert_id();
		else
            update `warehousing` set TotalCost = TotalCost + _SoLuong * _GiaNhap where IdWarehousing = _IdKhoHang;
		end if;
        # Cập nhật chi tiết nhập hàng
        insert into `detailwarehousing`(WarehousingId, ProductId, Price, Number) values(_IdKhoHang, _IdSanPham, _GiaNhap, _SoLuong);
		# commit thay đổi
        # Trả về kết quả lỗi
        set _Result = 0;
        # Ném lỗi ra
        set _Message = 'Cập nhật dữ liệu thành công';
		commit;
	else
		# Trả về kết quả lỗi
        set _Result = -1;
        # Ném lỗi ra
        set _Message = 'Chi nhánh không tồn tại';
    end if;
end; $$

delimiter ;
