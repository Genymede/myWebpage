-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: user
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `userID` int DEFAULT NULL,
  `details` varchar(500) DEFAULT NULL,
  `detail_time` timestamp NULL DEFAULT NULL,
  `place_detail` varchar(500) DEFAULT NULL,
  `status` enum('Found','Returned','Lost') NOT NULL DEFAULT 'Found',
  KEY `userID` (`userID`),
  CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (4,NULL,NULL,NULL,'Found'),(3,NULL,NULL,NULL,'Found'),(1,NULL,NULL,NULL,'Found'),(5,NULL,NULL,NULL,'Found'),(2,NULL,NULL,NULL,'Found'),(3,'Now I Am Become Death, the Destroyer of Worlds.','2000-11-29 17:00:00',NULL,'Found'),(1,'5f4dcc3b5aa765d61d8327deb882cf99','2015-12-12 08:56:20',NULL,'Found'),(2,'9fb16387931c738a68440fc0c1735efe','2000-12-12 07:45:15',NULL,'Found'),(3,'Stella is mine','2024-11-29 05:56:59',NULL,'Found'),(3,'I need mother','2010-11-29 12:40:12',NULL,'Found'),(2,'f9e51ce4e6afe40373b439d2a79baf68','1999-01-01 09:30:11',NULL,'Found');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Jirawat',NULL,NULL,NULL,NULL,'5f4dcc3b5aa765d61d8327deb882cf99',NULL,NULL,NULL,NULL,NULL,NULL),(2,'Stella',NULL,NULL,NULL,NULL,'9fb16387931c738a68440fc0c1735efe',NULL,NULL,NULL,NULL,NULL,NULL),(3,'Edward',NULL,NULL,NULL,NULL,'f9e51ce4e6afe40373b439d2a79baf68',NULL,NULL,NULL,NULL,NULL,NULL),(4,'Bellie Winter Norman',NULL,NULL,NULL,NULL,'41b9b72eec237818c6feaa61bf288435',NULL,NULL,NULL,NULL,NULL,NULL),(5,'Linda',NULL,NULL,NULL,NULL,'79787f22b158b0e4256f64c12c0939fb',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-28 16:23:36
