-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.35 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.5.0.6677
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for g65102
DROP DATABASE IF EXISTS `g65102`;
CREATE DATABASE IF NOT EXISTS `g65102` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `g65102`;

-- Dumping structure for table g65102.credit
DROP TABLE IF EXISTS `credit`;
CREATE TABLE IF NOT EXISTS `credit` (
  `userID` int DEFAULT NULL,
  `reviewerID` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `reviewerName` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `userID` (`userID`),
  CONSTRAINT `credit_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table g65102.credit: ~0 rows (approximately)

-- Dumping structure for table g65102.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userImage` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `studentID` varchar(9) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `faculty` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `major` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phonenumber` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `facebook` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `x` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avgScore` float DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table g65102.users: ~6 rows (approximately)
INSERT INTO `users` (`userID`, `userImage`, `username`, `email`, `studentID`, `firstname`, `lastname`, `password`, `faculty`, `major`, `phonenumber`, `facebook`, `instagram`, `x`, `avgScore`) VALUES
	(1, 'userProfile/prof2.jpg', 'Kaworu', 'jirawatkdm@gmail.com', '65021420', 'Jirawat', 'Janjobtam', '5f4dcc3b5aa765d61d8327deb882cf99', 'ICT', 'CPE', '0959792523', 'Jirawat Janjobtam', 'Lindx_Mckelmxn', 'CaCo3', 5),
	(2, 'userProfile/prof2.jpg', 'Stella', '', '', 'Stella', 'Raneil', '9fb16387931c738a68440fc0c1735efe', '', '', '', '', '', '', NULL),
	(3, 'userProfile/prof2.jpg', 'Edward', '', '', 'Edward', 'Saturn', 'f9e51ce4e6afe40373b439d2a79baf68', '', '', '', '', '', '', 1),
	(4, 'userProfile/prof2.jpg', 'Bellie Winter Norman', '', '1100', 'Bellie', 'Norman', '41b9b72eec237818c6feaa61bf288435', '', '', '', '', '', '', 0),
	(5, 'userProfile/prof2.jpg', 'Linda', '', '', 'Lida', 'Mckelman', '79787f22b158b0e4256f64c12c0939fb', '', '', '', '', '', '', NULL),
	(8, 'userProfile/prof2.jpg', 'WunderShip', 'jirawatkdm@gmail.com', '65021420', 'Clara', 'Magdalos', 'e10adc3949ba59abbe56e057f20f883e', 'ICT', 'CPE', '0959792523', '', '', '', 2),
	(9, 'img/prof2.jpg', 'A', 'a@hotmail.com', '65021111', 'A', 'B', '81dc9bdb52d04dc20036dbd8313ed055', 'ICT', 'CPE', '1234567897', '', '', '', NULL);

-- Dumping structure for table g65102.user_act
DROP TABLE IF EXISTS `user_act`;
CREATE TABLE IF NOT EXISTS `user_act` (
  `userID` int DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `action` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `actiontime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table g65102.user_act: ~0 rows (approximately)
INSERT INTO `user_act` (`userID`, `username`, `action`, `actiontime`) VALUES
	(9, 'A', 'Login', '2024-01-11 12:40:23'),
	(1, 'Kaworu', 'Login', '2024-01-11 16:04:48'),
	(9, 'A', 'Login', '2024-01-11 16:20:36'),
	(9, 'A', 'Logout', '2024-01-11 16:25:25'),
	(9, 'A', 'Login', '2024-01-11 16:26:00'),
	(9, 'A', 'Login', '2024-01-11 16:47:54'),
	(9, 'A', 'Add post', '2024-01-11 16:53:58');

-- Dumping structure for table g65102.user_info
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE IF NOT EXISTS `user_info` (
  `dataID` int NOT NULL AUTO_INCREMENT,
  `userID` int NOT NULL,
  `details` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `detail_time` timestamp NULL DEFAULT NULL,
  `place_detail` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Found','Returned','Lost') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Found',
  `image` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`dataID`),
  KEY `userID` (`userID`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table g65102.user_info: ~0 rows (approximately)
INSERT INTO `user_info` (`dataID`, `userID`, `details`, `detail_time`, `place_detail`, `status`, `image`) VALUES
	(1, 9, 'ปั๊มน้ำ', '2024-02-08 09:53:54', NULL, 'Found', 'img\\A8ab77b4be2b6b93f425b45147103a4e5.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
