-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.36 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for user
CREATE DATABASE IF NOT EXISTS `user` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `user`;

-- Dumping structure for table user.dataimage
CREATE TABLE IF NOT EXISTS `dataimage` (
  `imageID` int NOT NULL AUTO_INCREMENT,
  `dataID` int DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`imageID`),
  KEY `dataID` (`dataID`),
  CONSTRAINT `dataimage_ibfk_1` FOREIGN KEY (`dataID`) REFERENCES `user_info` (`dataID`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table user.dataimage: ~12 rows (approximately)
INSERT INTO `dataimage` (`imageID`, `dataID`, `image`) VALUES
	(1, 1, 'img/porf1.png'),
	(2, 2, 'img/prof2.jpg'),
	(3, 3, NULL),
	(4, 4, NULL),
	(5, 5, NULL),
	(6, 6, NULL),
	(7, 10, 'img/ramiel.gif'),
	(9, 18, NULL),
	(10, 20, NULL),
	(11, 21, NULL),
	(12, 22, NULL),
	(13, 23, NULL);

-- Dumping structure for table user.users
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userImage` varchar(200) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `studentID` varchar(9) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `major` varchar(100) DEFAULT NULL,
  `phonenumber` varchar(10) DEFAULT NULL,
  `facebook` varchar(100) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `x` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table user.users: ~8 rows (approximately)
INSERT INTO `users` (`userID`, `userImage`, `username`, `email`, `studentID`, `firstname`, `lastname`, `password`, `faculty`, `major`, `phonenumber`, `facebook`, `instagram`, `x`) VALUES
	(1, NULL, 'Jirawat', NULL, NULL, NULL, NULL, '5f4dcc3b5aa765d61d8327deb882cf99', NULL, NULL, NULL, NULL, NULL, NULL),
	(2, NULL, 'Stella', NULL, NULL, NULL, NULL, '9fb16387931c738a68440fc0c1735efe', NULL, NULL, NULL, NULL, NULL, NULL),
	(3, NULL, 'Edward', NULL, NULL, NULL, NULL, 'f9e51ce4e6afe40373b439d2a79baf68', NULL, NULL, NULL, NULL, NULL, NULL),
	(4, NULL, 'Bellie Winter Norman', NULL, NULL, NULL, NULL, '41b9b72eec237818c6feaa61bf288435', NULL, NULL, NULL, NULL, NULL, NULL),
	(5, NULL, 'Linda', NULL, NULL, NULL, NULL, '79787f22b158b0e4256f64c12c0939fb', NULL, NULL, NULL, NULL, NULL, NULL),
	(8, NULL, 'AAA Wunder', 'jirawatkdm@gmail.com', '65021420', 'Jirawat', 'Janjobtam', 'e10adc3949ba59abbe56e057f20f883e', 'ICT', 'CPE', '0652295267', '', '', ''),
	(17, 'userProfile\\DDD8be3b953a0ee3474975ed1a2197a21e1.jpg', 'DDD', 'jirawatkdm@gmail.com', '6412100', 'kcc', 'nnn', 'bdd166af3a63f7be696dd17a218a6ffb', 'ICT', 'CPE', '0959792523', '', '', ''),
	(22, 'userProfile\\Alex072e5ec8e025e007a6ad7dc079c251cb.jpg', 'Alex', 'jirawatkdm@gmail.com', '65021420', 'Alexandrea', 'Ampere', 'e022516b41f20607ff76f00c7f594692', 'ICT', 'CPE', '5461600000', '', '', '');

-- Dumping structure for table user.user_info
CREATE TABLE IF NOT EXISTS `user_info` (
  `dataID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `details` varchar(500) DEFAULT NULL,
  `detail_time` timestamp NULL DEFAULT NULL,
  `place_detail` varchar(500) DEFAULT NULL,
  `status` enum('Found','Returned','Lost') NOT NULL DEFAULT 'Found',
  `image` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`dataID`),
  KEY `userID` (`userID`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table user.user_info: ~14 rows (approximately)
INSERT INTO `user_info` (`dataID`, `userID`, `details`, `detail_time`, `place_detail`, `status`, `image`) VALUES
	(1, 3, 'Now I Am Become Death, the Destroyer of Worlds.', '2000-11-29 17:00:00', NULL, 'Found', 'img/porf1.png'),
	(2, 1, 'My name is Jirawat', '2015-12-12 08:56:20', NULL, 'Found', 'img/prof2.jpg'),
	(3, 2, '9fb16387931c738a68440fc0c1735efe', '2000-12-12 07:45:15', NULL, 'Found', NULL),
	(4, 3, 'Stella is mine', '2024-11-29 05:56:59', NULL, 'Found', NULL),
	(5, 3, 'I need mother', '2010-11-29 12:40:12', NULL, 'Found', NULL),
	(6, 2, 'f9e51ce4e6afe40373b439d2a79baf68', '1999-01-01 09:30:11', NULL, 'Found', NULL),
	(10, 4, 'Really cold :\'( 00000', '2024-01-28 15:02:10', NULL, 'Found', 'img/ramiel.gif'),
	(18, 8, 'ต้นขาาาาาา', '2024-01-29 16:32:42', NULL, 'Found', 'img\\AAAWunder6fc7db86345d5b84922b79b18e779f58.jpg'),
	(20, 17, 'Hehe', '2024-02-02 10:50:28', NULL, 'Found', NULL),
	(21, 17, 'kkkk', '2024-02-02 10:51:26', NULL, 'Found', NULL),
	(22, 1, 'Helloooooo', '2024-02-02 14:43:40', NULL, 'Found', NULL),
	(23, 1, 'Bangggg', '2024-02-03 06:04:08', NULL, 'Found', NULL),
	(25, 8, 'io', '2024-02-05 03:35:30', NULL, 'Found', 'img\\AAAWunder1c6920d4ab67089c409cd1b91aa25d1e.jpg'),
	(26, 8, 'คว*', '2024-02-05 03:38:56', NULL, 'Lost', 'static\\img\\AAAWunder2efbb6a0d5f31cd71d4c53ba11e83e83.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
