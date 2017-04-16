-- MySQL dump 10.13  Distrib 5.6.24, for Win32 (x86)
--
-- Host: 127.0.0.1    Database: grocerydb
-- ------------------------------------------------------
-- Server version	5.6.26-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `UserName` varchar(30) CHARACTER SET utf8 NOT NULL,
  `PassWord` varchar(30) CHARACTER SET utf8 NOT NULL,
  `UserId` int(11) NOT NULL,
  `BranchId` int(11) NOT NULL,
  `JurisdictionId` int(11) NOT NULL COMMENT 'Quyền hạn truy cập vào dữ liệu hệ thống. Chủ hệ thống, Chủ chi nhánh, Nhân viên',
  `IdentityCard` varchar(30) CHARACTER SET utf8 NOT NULL,
  `TotalSalary` int(11) NOT NULL,
  PRIMARY KEY (`UserName`),
  UNIQUE KEY `UserName_UNIQUE` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='quản trị viên bao gồm chủ sở hữu hệ thống, chủ các cơ sở kinh doanh, nhân viên được giao nhiệm vụ quản lý bán hàng tại cửa hàng.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('root','12345678',1,1,1,'123456789',5000);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `branch` (
  `IdBranch` int(11) NOT NULL AUTO_INCREMENT,
  `NameBranch` text COLLATE utf8_unicode_ci NOT NULL,
  `Address` varchar(500) CHARACTER SET utf8 NOT NULL,
  `Phone` varchar(30) CHARACTER SET utf8 NOT NULL,
  `Email` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `Fax` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`IdBranch`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin chi nhánh';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,'Chi nhánh một','Địa chỉ chi nhánh một','1234567899','chinhanh001@gmail.com',NULL),(2,'Chi nhánh hai','Địa chỉ chi nhánh hai','01234567888','chinhanh2@gmail.com',NULL);
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `IdCategory` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) CHARACTER SET utf8 NOT NULL,
  `Description` text COLLATE utf8_unicode_ci,
  `DateCreate` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `State` int(11) NOT NULL COMMENT 'Có các trạng thái như sau : -1 Hủy bỏ, 0 Thường, 1 Hiển thị, 2 Ghim(Hot)',
  PRIMARY KEY (`IdCategory`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Danh mục các sản phẩm của cửa hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Hàng gia dụng','Hàng hóa thuộc đồ gia dụng','2017/01/16 21:59:00',1),(2,'Hàng điện tử','Hàng hóa điện tử','2017/01/16 21:59:00',1),(3,'Hàng hóa điện lạnh','Hàng hóa điện lạnh','2017/01/16 21:59:00',2);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `IdCustomer` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(30) CHARACTER SET utf8 NOT NULL,
  `PassWord` varchar(30) CHARACTER SET utf8 NOT NULL,
  `ContactName` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `ContactPhone` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `ContactEmail` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `CustomerType` int(11) NOT NULL COMMENT 'Loại khác hàng : Hiện tại xác định có 3 loại chính đó là Vãng lai(Luôn tồn tại duy nhất một người), Cá nhân, Doanh nghiệp',
  `DateCreate` varchar(30) CHARACTER SET utf8 DEFAULT NULL COMMENT 'Ngày đăng ký đăng nhập thành viên.',
  PRIMARY KEY (`IdCustomer`),
  UNIQUE KEY `UserName_UNIQUE` (`UserName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin cơ bản của khác hàng(có thể là cá nhân, có thể là doanh nghiệp). Sau này có phát triển trên website client họ có thể đăng nhập và order sản phẩm tại đó.  Thường thì mua hàng sẽ tự động add vào khách vãng lai. Còn nếu là cá nhân doanh nghiệp thì cung cấp cho họ thông tin nếu họ cần';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'user001','12345678','Khách hàng 001','01234567899','user001@gmail.com',NULL,1,'2017/01/16 21:59:00'),(2,'user002','01233456789','Khách hàng 002','01234567899','user002@gmail.com',NULL,2,'2017/01/16 21:59:00'),(3,'user003','012345467899','Khách hàng 003','01234678666','user003@gmail.com',NULL,3,'2017/01/16 21:59:00');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `depot`
--

DROP TABLE IF EXISTS `depot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `depot` (
  `BranchId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `NewNumber` int(11) DEFAULT NULL COMMENT 'Số lượng sản phẩm mới nhập tại chi nhánh',
  `NewPrice` int(11) DEFAULT NULL COMMENT 'Giá gốc lúc nhập sản phẩm tại chi nhánh đó',
  `OldNumber` int(11) DEFAULT NULL COMMENT 'Số lượng sản phẩm củ tồn kho trong đợt nhập trước(Ưu tiên thanh toán số này trước).',
  `OldPrice` int(11) DEFAULT NULL COMMENT 'Giá gốc khi nhập sản phẩm tại thời điểm đó.',
  `DateUpdate` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`BranchId`,`ProductId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Kho chứa gồm : Chi nhánh, sản phẩm, số lượng hiện tại, giá thành hiện tại(gốc), số lượng tồn kho, giá củ(gốc), ngày cập nhật';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `depot`
--

LOCK TABLES `depot` WRITE;
/*!40000 ALTER TABLE `depot` DISABLE KEYS */;
INSERT INTO `depot` VALUES (1,1,100,5000,10,5000,'2017/01/16 21:59:00'),(1,2,100,10000,0,10000,'2017/01/16 21:59:00'),(1,3,150,15000,5,12000,'2017/01/16 21:59:00');
/*!40000 ALTER TABLE `depot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detailexportwarehouse`
--

DROP TABLE IF EXISTS `detailexportwarehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detailexportwarehouse` (
  `ExportwarehouseId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Price` int(11) NOT NULL COMMENT 'Giá bán hiện tại của sản phẩm',
  `Number` int(11) NOT NULL,
  `Cost` int(11) NOT NULL COMMENT 'Giá gốc sản phẩm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Chi tiết xuất hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detailexportwarehouse`
--

LOCK TABLES `detailexportwarehouse` WRITE;
/*!40000 ALTER TABLE `detailexportwarehouse` DISABLE KEYS */;
/*!40000 ALTER TABLE `detailexportwarehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detailwarehousing`
--

DROP TABLE IF EXISTS `detailwarehousing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detailwarehousing` (
  `WarehousingId` int(11) NOT NULL,
  `ProductId` int(11) NOT NULL,
  `Price` int(11) NOT NULL,
  `Number` int(11) NOT NULL,
  `Tax` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin chi tiết nhập kho hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detailwarehousing`
--

LOCK TABLES `detailwarehousing` WRITE;
/*!40000 ALTER TABLE `detailwarehousing` DISABLE KEYS */;
/*!40000 ALTER TABLE `detailwarehousing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exportwarehouse`
--

DROP TABLE IF EXISTS `exportwarehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exportwarehouse` (
  `IdExportwarehouse` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerId` int(11) NOT NULL,
  `BranchId` int(11) NOT NULL,
  `AdminId` varchar(30) CHARACTER SET utf8 NOT NULL,
  `TotalPrice` int(11) NOT NULL COMMENT 'Tổng chi phí',
  `Tax` float NOT NULL COMMENT 'Thuế',
  `DateCreate` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `StateOrder` int(11) DEFAULT NULL COMMENT 'Trạng thái đơn hàng gồm  -1 : Hủy bỏ, 0 Đã thanh toán, 1 Thanh toán một phần, 2 Vận chuyển, 3 Đặt hàng.',
  `Note` text COLLATE utf8_unicode_ci COMMENT 'Ghi chú : có thể là số tiền đặt cọc trước, vv',
  PRIMARY KEY (`IdExportwarehouse`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin xuất kho';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exportwarehouse`
--

LOCK TABLES `exportwarehouse` WRITE;
/*!40000 ALTER TABLE `exportwarehouse` DISABLE KEYS */;
/*!40000 ALTER TABLE `exportwarehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jurisdiction`
--

DROP TABLE IF EXISTS `jurisdiction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jurisdiction` (
  `IdJurisdiction` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(200) CHARACTER SET utf8 NOT NULL,
  `Description` text COLLATE utf8_unicode_ci COMMENT 'Mô tả về vị trí nhằm hiểu rõ hơn vị trí đó.',
  PRIMARY KEY (`IdJurisdiction`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Quyền hạn của thành viên quản trị';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jurisdiction`
--

LOCK TABLES `jurisdiction` WRITE;
/*!40000 ALTER TABLE `jurisdiction` DISABLE KEYS */;
INSERT INTO `jurisdiction` VALUES (1,'Root','Quản trị viên cao cấp của hệ thống'),(2,'Trưởng chi nhánh','Trưởng của một chi nhánh tạp hóa'),(3,'Thủ kho chi nhánh','Thủ kho thực hiện nhập xuất kho cho chi nhánh');
/*!40000 ALTER TABLE `jurisdiction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `IdProduct` int(11) NOT NULL AUTO_INCREMENT,
  `CategoryId` int(11) NOT NULL,
  `Name` varchar(500) CHARACTER SET utf8 NOT NULL,
  `Price` int(11) NOT NULL,
  `DateUpdate` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`IdProduct`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin cơ bản của một sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'Sản phẩm 001',5000,'2017/01/16 21:59:00'),(2,1,'Sản phẩm 002',10000,'2017/01/16 21:59:00'),(3,1,'Sản phẩm 003',15000,'2017/01/16 21:59:00');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `IdSupplier` int(11) NOT NULL AUTO_INCREMENT,
  `ContactName` varchar(200) CHARACTER SET utf8 NOT NULL COMMENT 'Tên người liên hệ',
  `ContactPhone` varchar(30) CHARACTER SET utf8 NOT NULL,
  `ContactEmail` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`IdSupplier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin nhà cung cấp các sản phẩm cho các cửa hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `IdUser` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(500) CHARACTER SET utf8 NOT NULL,
  `Address` varchar(500) CHARACTER SET utf8 DEFAULT NULL,
  `Phone` varchar(20) CHARACTER SET utf8 DEFAULT NULL,
  `Email` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin cơ bản về một người dùng.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Hồ Viết Nhân','447 Hải Phòng','01234567899','admin001@gmail.com'),(2,'Võ Văn Hai','23 Nguyễn Khuyến','01234567888','user001@gmail.com'),(3,'Ngô Phương Tiến','47 Lê Duẫn','0123456657899','user002@gmail.com');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehousing`
--

DROP TABLE IF EXISTS `warehousing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehousing` (
  `IdWarehousing` int(11) NOT NULL,
  `SupplierId` int(11) NOT NULL COMMENT 'Id nhà cung cấp',
  `BranchId` int(11) NOT NULL COMMENT 'Id chi nhánh',
  `DateCreate` varchar(30) CHARACTER SET utf8 NOT NULL,
  `TotalCost` int(11) DEFAULT NULL COMMENT 'Tổng chi phí nhập',
  `Tax` float DEFAULT NULL COMMENT 'Thuế(%) phải đóng khi nhập lô hàng này.',
  `Note` text COLLATE utf8_unicode_ci COMMENT 'Ghi chú',
  PRIMARY KEY (`IdWarehousing`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Thông tin nhập kho';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehousing`
--

LOCK TABLES `warehousing` WRITE;
/*!40000 ALTER TABLE `warehousing` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehousing` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-04-16 22:25:19
