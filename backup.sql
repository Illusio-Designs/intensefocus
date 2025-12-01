-- MySQL dump 10.13  Distrib 8.0.44, for macos15 (arm64)
--
-- Host: localhost    Database: stallion
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `record_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674','update','users','c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674','{\"email\": null, \"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"user_id\": \"c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"created_at\": \"2025-11-27T08:42:13.000Z\", \"last_login\": null, \"updated_at\": \"2025-11-27T08:50:34.000Z\", \"profile_image\": null}','{\"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"updated_at\": \"2025-11-27T08:56:44.150Z\"}','::ffff:127.0.0.1','2025-11-27 08:56:44'),(2,'c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674','delete','users','c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674','{\"email\": null, \"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"user_id\": \"c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"created_at\": \"2025-11-27T08:42:13.000Z\", \"last_login\": null, \"updated_at\": \"2025-11-27T08:50:34.000Z\", \"profile_image\": null}',NULL,'::ffff:127.0.0.1','2025-11-27 08:57:36'),(3,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','users','ea37d621-03ff-44f8-b140-e8840f5e123d','{\"email\": null, \"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"user_id\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"created_at\": \"2025-11-27T12:00:14.000Z\", \"last_login\": null, \"updated_at\": \"2025-11-27T12:00:34.520Z\", \"profile_image\": \"https://placehold.co/600x400\"}','{\"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"updated_at\": \"2025-11-27T12:00:34.525Z\", \"profile_image\": \"https://placehold.co/600x400\"}','::ffff:127.0.0.1','2025-11-27 12:00:34'),(4,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','users','ea37d621-03ff-44f8-b140-e8840f5e123d','{\"email\": \"hsdhameliya88@gmail.com\", \"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"user_id\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"created_at\": \"2025-11-27T12:00:14.000Z\", \"last_login\": null, \"updated_at\": \"2025-11-27T12:03:13.731Z\", \"profile_image\": \"https://placehold.co/600x400\"}','{\"phone\": \"+917600032916\", \"role_id\": \"4416afe6-12c3-4f58-b513-1d19d61f42bc\", \"full_name\": \"Hardik Dhameliya\", \"is_active\": true, \"updated_at\": \"2025-11-27T12:03:13.737Z\", \"profile_image\": \"https://placehold.co/600x400\"}','::ffff:127.0.0.1','2025-11-27 12:03:13'),(5,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','countries','fc7439a5-73f7-4029-a3e3-4e09446e9125','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:05:09'),(6,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','countries','9c500648-c76c-40ac-980a-fa3d0a4e279c',NULL,'{\"id\": \"9c500648-c76c-40ac-980a-fa3d0a4e279c\", \"code\": \"AU\", \"name\": \"Australia\", \"currency\": \"AUD\", \"is_active\": true, \"created_at\": \"2025-11-29T06:05:21.070Z\", \"phone_code\": \"+61\", \"updated_at\": \"2025-11-29T06:05:21.070Z\"}','::ffff:127.0.0.1','2025-11-29 06:05:21'),(7,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','countries','9c500648-c76c-40ac-980a-fa3d0a4e279c','[1]','{\"code\": \"AU\", \"name\": \"Australia\", \"currency\": \"AUD\", \"phone_code\": \"+61\"}','::ffff:127.0.0.1','2025-11-29 06:06:08'),(8,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','countries','9c500648-c76c-40ac-980a-fa3d0a4e279c','[1]','{\"code\": \"AU\", \"name\": \"Australia\", \"currency\": \"AUD\", \"phone_code\": \"+61\"}','::ffff:127.0.0.1','2025-11-29 06:06:27'),(9,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','states','3772821a-1e40-41d1-8204-035aaa47660b',NULL,'{\"id\": \"3772821a-1e40-41d1-8204-035aaa47660b\", \"code\": \"TX\", \"name\": \"Texus\", \"is_active\": true, \"country_id\": \"40e6df22-292f-469f-9052-ad43bcb81589\", \"created_at\": \"2025-11-29T06:11:45.418Z\", \"updated_at\": \"2025-11-29T06:11:45.419Z\"}','::ffff:127.0.0.1','2025-11-29 06:11:45'),(10,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','states','3772821a-1e40-41d1-8204-035aaa47660b','[1]','{\"code\": \"TXS\", \"name\": \"Texus\", \"country_id\": \"40e6df22-292f-469f-9052-ad43bcb81589\"}','::ffff:127.0.0.1','2025-11-29 06:12:56'),(11,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','states','3772821a-1e40-41d1-8204-035aaa47660b','[1]','{\"code\": \"TXS\", \"name\": \"Texus\", \"country_id\": \"40e6df22-292f-469f-9052-ad43bcb81589\"}','::ffff:127.0.0.1','2025-11-29 06:13:04'),(12,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','states','3772821a-1e40-41d1-8204-035aaa47660b','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:14:02'),(13,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','cities','54bc9922-8bb6-492f-a241-2f983deca2d0',NULL,'{\"id\": \"54bc9922-8bb6-492f-a241-2f983deca2d0\", \"name\": \"Surat\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"updated_at\": \"2025-11-29T06:18:00.678Z\"}','::ffff:127.0.0.1','2025-11-29 06:18:00'),(14,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','cities','54bc9922-8bb6-492f-a241-2f983deca2d0','[1]','{\"name\": \"Ahemdabad\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\"}','::ffff:127.0.0.1','2025-11-29 06:19:13'),(15,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','cities','54bc9922-8bb6-492f-a241-2f983deca2d0','[1]','{\"name\": \"Ahemdabad\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\"}','::ffff:127.0.0.1','2025-11-29 06:19:21'),(16,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','cities','54bc9922-8bb6-492f-a241-2f983deca2d0','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:19:35'),(17,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','cities','97660d4e-6c3e-436e-a6f1-9b8133bddbc8',NULL,'{\"id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"name\": \"Surat\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"updated_at\": \"2025-11-29T06:19:57.418Z\"}','::ffff:127.0.0.1','2025-11-29 06:19:57'),(18,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','zones','aade85fb-b9bc-4c6d-87f0-e3ebeceaabd7',NULL,'{\"id\": \"aade85fb-b9bc-4c6d-87f0-e3ebeceaabd7\", \"name\": \"Katargam\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"zone_code\": \"KASUR\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:27:48.787Z\", \"updated_at\": \"2025-11-29T06:27:48.788Z\", \"description\": \"Katargam Zone\"}','::ffff:127.0.0.1','2025-11-29 06:27:48'),(19,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','zones','aade85fb-b9bc-4c6d-87f0-e3ebeceaabd7','[1]','{\"name\": \"Katargam\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"zone_code\": \"KASU\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"description\": \"Katargam North Zone\"}','::ffff:127.0.0.1','2025-11-29 06:28:21'),(20,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','zones','aade85fb-b9bc-4c6d-87f0-e3ebeceaabd7','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:28:51'),(21,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','zones','28c263a3-e392-4e57-a424-e4ab89e4a3ce',NULL,'{\"id\": \"28c263a3-e392-4e57-a424-e4ab89e4a3ce\", \"name\": \"Katargam\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"zone_code\": \"KASUR\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:29:06.418Z\", \"updated_at\": \"2025-11-29T06:29:06.418Z\", \"description\": \"Katargam Zone\"}','::ffff:127.0.0.1','2025-11-29 06:29:06'),(22,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','parties','f39f10d0-08eb-4635-8cc1-9839bb722565',NULL,'{\"pan\": \"\", \"email\": \"hsdhameliya88@gmail.com\", \"gstin\": \"\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"pincode\": \"395004\", \"zone_id\": \"28c263a3-e392-4e57-a424-e4ab89e4a3ce\", \"party_id\": \"f39f10d0-08eb-4635-8cc1-9839bb722565\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:31:24.566Z\", \"created_by\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"party_name\": \"Hardik\", \"trade_name\": \"ABC Enterprise\", \"updated_at\": \"2025-11-29T06:31:24.566Z\", \"contact_person\": \"Harsh\"}','::ffff:127.0.0.1','2025-11-29 06:31:24'),(23,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','parties','f39f10d0-08eb-4635-8cc1-9839bb722565','[1]','{\"pan\": \"FSQOF9827R\", \"email\": \"hsdhameliya88@gmail.com\", \"gstin\": \"FSQOF9827RZRUTI\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"pincode\": \"395004\", \"zone_id\": \"28c263a3-e392-4e57-a424-e4ab89e4a3ce\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"party_name\": \"Hardik\", \"trade_name\": \"ABC Enterprise\", \"contact_person\": \"Harsh\"}','::ffff:127.0.0.1','2025-11-29 06:33:53'),(24,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','parties','f39f10d0-08eb-4635-8cc1-9839bb722565','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:34:07'),(25,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','distributors','7a5a646f-f352-4125-b54e-7c1c87157492',NULL,'{\"pan\": \"\", \"email\": \"hsdhameliya88@gmail.com\", \"gstin\": \"\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"pincode\": \"395004\", \"zone_id\": \"28c263a3-e392-4e57-a424-e4ab89e4a3ce\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"territory\": \"Katargam\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:38:03.363Z\", \"created_by\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"trade_name\": \"ABC Enterprise\", \"updated_at\": \"2025-11-29T06:38:03.364Z\", \"contact_person\": \"Harsh\", \"distributor_id\": \"7a5a646f-f352-4125-b54e-7c1c87157492\", \"commission_rate\": 10.5, \"distributor_name\": \"Hardik\"}','::ffff:127.0.0.1','2025-11-29 06:38:03'),(26,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','distributors','7a5a646f-f352-4125-b54e-7c1c87157492','[1]','{\"pan\": \"FSQOF9827R\", \"email\": \"hsdhameliya88@gmail.com\", \"gstin\": \"FSQOF9827RZRUTI\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"pincode\": \"395004\", \"zone_id\": \"28c263a3-e392-4e57-a424-e4ab89e4a3ce\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"is_active\": true, \"territory\": \"Katargam\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"trade_name\": \"ABC Enterprise\", \"contact_person\": \"Harsh\", \"commission_rate\": 10.5, \"distributor_name\": \"Hardik\"}','::ffff:127.0.0.1','2025-11-29 06:39:48'),(27,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','distributors','7a5a646f-f352-4125-b54e-7c1c87157492','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:40:08'),(28,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','salesmen','e2ad7b66-67b5-4ed1-aa56-02519f976d1c',NULL,'{\"email\": \"hsdhameliya88@gmail.com\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"user_id\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"full_name\": \"Harsh Maheshwari\", \"is_active\": true, \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:47:22.643Z\", \"created_by\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"updated_at\": \"2025-11-29T06:47:22.644Z\", \"salesman_id\": \"e2ad7b66-67b5-4ed1-aa56-02519f976d1c\", \"joining_date\": \"2025-11-29T06:44:57.018Z\", \"employee_code\": \"EMP001\", \"alternate_phone\": \"\", \"zone_preference\": \"Katargam\", \"reporting_manager\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\"}','::ffff:127.0.0.1','2025-11-29 06:47:22'),(29,'ea37d621-03ff-44f8-b140-e8840f5e123d','update','salesmen','e2ad7b66-67b5-4ed1-aa56-02519f976d1c','[1]','{\"email\": \"hsdhameliya88@gmail.com\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"user_id\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"full_name\": \"Harsh Maheshwari\", \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"joining_date\": \"2025-11-29T06:44:57.018Z\", \"employee_code\": \"EMP002\", \"alternate_phone\": \"\", \"zone_preference\": \"Katargam\", \"reporting_manager\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\"}','::ffff:127.0.0.1','2025-11-29 06:48:38'),(30,'ea37d621-03ff-44f8-b140-e8840f5e123d','create','salesmen','c9ce9211-1612-4d03-ae86-25a860d7ad2a',NULL,'{\"email\": \"hsdhameliya88@gmail.com\", \"phone\": \"+917600032916\", \"address\": \"Katargam,Surat, Gujarat\", \"city_id\": \"97660d4e-6c3e-436e-a6f1-9b8133bddbc8\", \"user_id\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"state_id\": \"fd41c6b2-c849-4c2c-9295-8bc4dce8fce1\", \"full_name\": \"Harsh Maheshwari\", \"is_active\": true, \"country_id\": \"e7629de1-7836-44f3-b3af-0b427d12f8b2\", \"created_at\": \"2025-11-29T06:49:38.014Z\", \"created_by\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\", \"updated_at\": \"2025-11-29T06:49:38.015Z\", \"salesman_id\": \"c9ce9211-1612-4d03-ae86-25a860d7ad2a\", \"joining_date\": \"2025-11-29T06:44:57.018Z\", \"employee_code\": \"EMP001\", \"alternate_phone\": \"\", \"zone_preference\": \"Katargam\", \"reporting_manager\": \"ea37d621-03ff-44f8-b140-e8840f5e123d\"}','::ffff:127.0.0.1','2025-11-29 06:49:38'),(31,'ea37d621-03ff-44f8-b140-e8840f5e123d','delete','salesmen','c9ce9211-1612-4d03-ae86-25a860d7ad2a','1',NULL,'::ffff:127.0.0.1','2025-11-29 06:50:00');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(211) NOT NULL,
  `state_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_name_state_unique` (`name`,`state_id`),
  KEY `state_id` (`state_id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES ('97660d4e-6c3e-436e-a6f1-9b8133bddbc8','Surat','fd41c6b2-c849-4c2c-9295-8bc4dce8fce1',1,'2025-11-29 06:19:57');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `countries` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `currency` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES ('1d322206-deb8-42ad-a067-4a646dc2c4df','France','FR','+33','EUR',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('2358deb4-96fa-42ac-9966-3cb63b88f9a2','Canada','CA','+1','CAD',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('40e6df22-292f-469f-9052-ad43bcb81589','United States','US','+1','USD',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('5e194bf5-d60d-4244-91dd-9abe43ef01ef','Germany','DE','+49','EUR',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('6c86bb5b-d66d-4d81-ae10-e48c2cb83c64','United Kingdom','GB','+44','GBP',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('9c500648-c76c-40ac-980a-fa3d0a4e279c','Australia','AU','+61','AUD',1,'2025-11-29 06:05:21','2025-11-29 06:06:27'),('a1e94088-f880-4872-a478-e0896fb84f51','Japan','JP','+81','JPY',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('c1d8cb59-17dd-48a4-be01-b6625c6f4bfa','Brazil','BR','+55','BRL',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('dd276f3e-0e42-4446-95ea-fe49c6176775','China','CN','+86','CNY',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('e7629de1-7836-44f3-b3af-0b427d12f8b2','India','IN','+91','INR',1,'2025-11-28 07:22:02','2025-11-28 07:22:02');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distributors`
--

DROP TABLE IF EXISTS `distributors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distributors` (
  `distributor_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `distributor_name` varchar(255) NOT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `country_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `state_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `pan` varchar(10) DEFAULT NULL,
  `territory` varchar(100) DEFAULT NULL,
  `commission_rate` decimal(5,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`distributor_id`),
  KEY `country_id` (`country_id`),
  KEY `state_id` (`state_id`),
  KEY `city_id` (`city_id`),
  KEY `zone_id` (`zone_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `distributors_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  CONSTRAINT `distributors_ibfk_2` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`),
  CONSTRAINT `distributors_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `distributors_ibfk_4` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`),
  CONSTRAINT `distributors_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distributors`
--

LOCK TABLES `distributors` WRITE;
/*!40000 ALTER TABLE `distributors` DISABLE KEYS */;
/*!40000 ALTER TABLE `distributors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parties`
--

DROP TABLE IF EXISTS `parties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parties` (
  `party_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `party_name` varchar(255) NOT NULL,
  `trade_name` varchar(255) DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `country_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `state_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `pan` varchar(10) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`party_id`),
  KEY `country_id` (`country_id`),
  KEY `state_id` (`state_id`),
  KEY `city_id` (`city_id`),
  KEY `zone_id` (`zone_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `parties_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  CONSTRAINT `parties_ibfk_2` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`),
  CONSTRAINT `parties_ibfk_3` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `parties_ibfk_4` FOREIGN KEY (`zone_id`) REFERENCES `zones` (`id`),
  CONSTRAINT `parties_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parties`
--

LOCK TABLES `parties` WRITE;
/*!40000 ALTER TABLE `parties` DISABLE KEYS */;
/*!40000 ALTER TABLE `parties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime NOT NULL,
  `is_office_role` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('0ecedfed-1fdd-43bb-b142-cfcabcc866b2','party','Party','2025-11-27 08:36:24',0),('27bead0e-1eeb-482a-86ce-4e7f092e0926','reports_manager','Manages reports','2025-11-27 08:36:24',1),('414bc4f1-16a1-4fa1-a8c0-08d1965a31ab','expense_manager','Manages company expenses','2025-11-27 08:36:24',1),('4416afe6-12c3-4f58-b513-1d19d61f42bc','tray_manager','Manages tray inventory','2025-11-27 08:36:24',1),('6372e30d-2e7a-4f0c-afb8-0793f4393a89','distributor','Distributor','2025-11-27 08:36:24',0),('7b911c83-7dd8-413b-95d9-fdd4a15c6279','distributor_manager','Manages distributors','2025-11-27 08:36:24',1),('8faf6326-51e1-4c75-9ad9-969fe554f9f8','salesman','Field salesman mapped to zones','2025-11-27 08:36:24',0),('98ec1675-98d7-4a75-8a15-c081ba249f27','product_manager','Manages product catalog','2025-11-27 08:36:24',1),('9d230dc8-e39d-4c56-b994-316c3e7310db','party_manager','Manages parties','2025-11-27 08:36:24',1),('a34f2971-c332-4fd7-89f2-af25b0ac80b1','sales_manager','Manages sales operations and team','2025-11-27 08:36:24',1),('dae1a7e2-ac77-4f3b-9585-a08b397981e2','order_manager','Manages customer orders','2025-11-27 08:36:24',1),('e91b12b3-bc8a-4d3c-b1b3-044565d3c8e2','admin','Super admin','2025-11-27 08:36:24',1);
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salesmen`
--

DROP TABLE IF EXISTS `salesmen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesmen` (
  `salesman_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `employee_code` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `reporting_manager` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `address` text,
  `country_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `state_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `zone_preference` text,
  `joining_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`salesman_id`),
  UNIQUE KEY `employee_code` (`employee_code`),
  KEY `user_id` (`user_id`),
  KEY `reporting_manager` (`reporting_manager`),
  KEY `country_id` (`country_id`),
  KEY `state_id` (`state_id`),
  KEY `city_id` (`city_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `salesmen_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `salesmen_ibfk_2` FOREIGN KEY (`reporting_manager`) REFERENCES `users` (`user_id`),
  CONSTRAINT `salesmen_ibfk_3` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  CONSTRAINT `salesmen_ibfk_4` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`),
  CONSTRAINT `salesmen_ibfk_5` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `salesmen_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesmen`
--

LOCK TABLES `salesmen` WRITE;
/*!40000 ALTER TABLE `salesmen` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesmen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `country_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES ('05daa91f-c26e-449a-8a74-158746bc7e35','Arunachal Pradesh','AR','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('0984d6f1-be82-4047-9ea3-628dad0a84fa','Meghalaya','ML','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('0e303200-93b9-45e3-af7a-d1efdf4c2c18','Maharashtra','MH','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('0e7076c3-b823-4f98-9cf2-38ac654d84c9','Assam','AS','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('0eb42bc7-79de-4de6-92a9-b9fecbd42018','Telangana','TS','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('0ff1a2f5-8d16-40b5-ae7d-1df6cb64cae6','Manipur','MN','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('27cc25aa-355b-497b-a05e-e1aadcecfbce','Chhattisgarh','CG','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('324a9df6-e696-4a34-b09f-0302a8b1cf3f','Punjab','PB','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('3c6a8000-378d-4ae1-ac34-54465e862437','West Bengal','WB','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('3cf9613d-291b-41f6-96ec-d14ad072c8d4','Rajasthan','RJ','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('4b22dfb0-dc3c-4d05-8fac-893a2cafd17f','Haryana','HR','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('4c8c49c8-8c8a-4c04-a637-5bbd3060c3c2','Uttar Pradesh','UP','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('4daee37b-0ef6-43f6-b064-7af076264576','Andhra Pradesh','AP','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('567594ec-4e5f-44dd-bf61-a815fd716808','Goa','GA','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('7b7a50ca-6046-4eed-9831-17822e2eb960','Uttarakhand','UK','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('7db16d33-c68d-419b-8099-7d145fcc79f1','Sikkim','SK','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('9104e3b1-305a-457e-9695-624734e1e530','Tripura','TR','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('93fea4a9-6c36-468f-adbc-13e159291af2','Himachal Pradesh','HP','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('94602065-a98a-47a6-9135-1518a60bf1cd','Tamil Nadu','TN','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('9dd7a848-4a6b-43ee-b320-934c786aa3ab','Jharkhand','JH','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('a67f8546-e863-4191-b9a0-bfcc6f5cdb6b','Nagaland','NL','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('ae5916de-3654-465c-bbab-6873c4a208f4','Mizoram','MZ','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('b643d93b-9899-4582-861b-109ae719b301','Bihar','BR','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('bc6121d1-b0eb-4020-8fb7-cdca8661ea51','Madhya Pradesh','MP','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('e4cccf6e-56e9-4856-a751-2df750249b5b','Odisha','OD','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('e5a63aef-45de-4b8c-a830-f9c090e29d32','Kerala','KL','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('f91f8dcb-cd04-4dd5-9d0a-30e8ee520ef0','Karnataka','KA','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02'),('fd41c6b2-c849-4c2c-9295-8bc4dce8fce1','Gujarat','GJ','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'2025-11-28 07:22:02','2025-11-28 07:22:02');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `user_role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `assigned_at` datetime NOT NULL,
  `assigned_by` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`user_role_id`),
  UNIQUE KEY `user_roles_user_id_role_id` (`user_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES ('38052cdc-51b7-48b5-aca0-a48a5413ebde','8772a009-80cc-4ec1-8191-07466f725373','4b6f98a3-96e3-4b1a-b3dc-f5462e42b88f','2025-11-26 13:31:06',NULL),('548a68a1-fdaa-42e9-b8c5-b44cb41b1c35','ea37d621-03ff-44f8-b140-e8840f5e123d','a34f2971-c332-4fd7-89f2-af25b0ac80b1','2025-11-27 12:00:14',NULL),('b5304883-d224-4bf5-a3af-3a89395a448e','c5e0fe8e-dbb6-4a60-a3a5-bf1e74615674','a34f2971-c332-4fd7-89f2-af25b0ac80b1','2025-11-27 08:42:13',NULL);
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('8772a009-80cc-4ec1-8191-07466f725373','illusiodesigns@gmail.com','7600046416','Superadmin',NULL,1,'2025-11-26 13:31:06','2025-11-26 13:31:06',NULL,'e91b12b3-bc8a-4d3c-b1b3-044565d3c8e2'),('ea37d621-03ff-44f8-b140-e8840f5e123d','hsdhameliya88@gmail.com','+917600032916','Hardik Dhameliya','pexels-italo-melo-881954-2379004-1764310036075.jpg',1,'2025-11-27 12:00:14','2025-11-28 06:07:16',NULL,'4416afe6-12c3-4f58-b513-1d19d61f42bc');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zones`
--

DROP TABLE IF EXISTS `zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zones` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `city_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `state_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `country_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `zone_code` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `zones_name_state_unique` (`name`,`state_id`),
  UNIQUE KEY `zone_code` (`zone_code`),
  KEY `city_id` (`city_id`),
  KEY `state_id` (`state_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `zones_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  CONSTRAINT `zones_ibfk_2` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`),
  CONSTRAINT `zones_ibfk_3` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zones`
--

LOCK TABLES `zones` WRITE;
/*!40000 ALTER TABLE `zones` DISABLE KEYS */;
INSERT INTO `zones` VALUES ('28c263a3-e392-4e57-a424-e4ab89e4a3ce','Katargam','Katargam Zone','97660d4e-6c3e-436e-a6f1-9b8133bddbc8','fd41c6b2-c849-4c2c-9295-8bc4dce8fce1','e7629de1-7836-44f3-b3af-0b427d12f8b2',1,'KASUR','2025-11-29 06:29:06','2025-11-29 06:29:06');
/*!40000 ALTER TABLE `zones` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-29 17:12:37
