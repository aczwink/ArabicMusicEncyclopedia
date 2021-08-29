-- MySQL dump 10.19  Distrib 10.3.30-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: amedb
-- ------------------------------------------------------
-- Server version	10.3.30-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ajnas`
--

DROP TABLE IF EXISTS `ajnas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ajnas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `basePitch` char(3) NOT NULL,
  `intervals` text NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `articles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maqamat`
--

DROP TABLE IF EXISTS `maqamat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maqamat` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `rootJinsId` int(10) unsigned NOT NULL,
  `dominant` tinyint(3) unsigned NOT NULL,
  `basePitchOverride` char(3) DEFAULT NULL,
  `additionalIntervals` text NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `maqamat_rootJinsId` (`rootJinsId`),
  CONSTRAINT `maqamat_rootJinsId` FOREIGN KEY (`rootJinsId`) REFERENCES `ajnas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maqamat_forms`
--

DROP TABLE IF EXISTS `maqamat_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maqamat_forms` (
  `maqamId` int(10) unsigned NOT NULL,
  `branchingJinsId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`maqamId`,`branchingJinsId`),
  KEY `maqamat_forms_branchingJinsId` (`branchingJinsId`),
  CONSTRAINT `maqamat_forms_branchingJinsId` FOREIGN KEY (`branchingJinsId`) REFERENCES `ajnas` (`id`),
  CONSTRAINT `maqamat_forms_maqamId` FOREIGN KEY (`maqamId`) REFERENCES `maqamat` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces`
--

DROP TABLE IF EXISTS `musical_pieces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `formId` int(10) unsigned NOT NULL,
  `composerId` int(10) unsigned NOT NULL,
  `releaseDate` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `musical_pieces_composerId` (`composerId`),
  KEY `musical_pieces_formId` (`formId`),
  CONSTRAINT `musical_pieces_composerId` FOREIGN KEY (`composerId`) REFERENCES `persons` (`id`),
  CONSTRAINT `musical_pieces_formId` FOREIGN KEY (`formId`) REFERENCES `musical_pieces_forms` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces_forms`
--

DROP TABLE IF EXISTS `musical_pieces_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces_forms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `hasLyrics` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces_languages`
--

DROP TABLE IF EXISTS `musical_pieces_languages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces_languages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces_lyrics`
--

DROP TABLE IF EXISTS `musical_pieces_lyrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces_lyrics` (
  `pieceId` int(10) unsigned NOT NULL,
  `lyricistId` int(10) unsigned NOT NULL,
  `singerId` int(10) unsigned NOT NULL,
  `languageId` int(10) unsigned NOT NULL,
  `lyrics` text NOT NULL,
  PRIMARY KEY (`pieceId`),
  KEY `musical_pieces_lyrics_lyricistId` (`lyricistId`),
  KEY `musical_pieces_lyrics_singerId` (`singerId`),
  KEY `musical_pieces_lyrics_languageId` (`languageId`),
  CONSTRAINT `musical_pieces_lyrics_languageId` FOREIGN KEY (`languageId`) REFERENCES `musical_pieces_languages` (`id`),
  CONSTRAINT `musical_pieces_lyrics_lyricistId` FOREIGN KEY (`lyricistId`) REFERENCES `persons` (`id`),
  CONSTRAINT `musical_pieces_lyrics_pieceId` FOREIGN KEY (`pieceId`) REFERENCES `musical_pieces` (`id`),
  CONSTRAINT `musical_pieces_lyrics_singerId` FOREIGN KEY (`singerId`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces_maqamat`
--

DROP TABLE IF EXISTS `musical_pieces_maqamat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces_maqamat` (
  `pieceId` int(10) unsigned NOT NULL,
  `maqamId` int(10) unsigned NOT NULL,
  `explanation` text NOT NULL,
  KEY `musical_pieces_maqamat_pieceId` (`pieceId`),
  KEY `musical_pieces_maqamat_maqamId` (`maqamId`),
  CONSTRAINT `musical_pieces_maqamat_maqamId` FOREIGN KEY (`maqamId`) REFERENCES `maqamat` (`id`),
  CONSTRAINT `musical_pieces_maqamat_pieceId` FOREIGN KEY (`pieceId`) REFERENCES `musical_pieces` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `musical_pieces_rhythms`
--

DROP TABLE IF EXISTS `musical_pieces_rhythms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `musical_pieces_rhythms` (
  `pieceId` int(10) unsigned NOT NULL,
  `rhythmId` int(10) unsigned NOT NULL,
  `explanation` text NOT NULL,
  KEY `musical_pieces_rhythms_pieceId` (`pieceId`),
  KEY `musical_pieces_rhythms_rhythmId` (`rhythmId`),
  CONSTRAINT `musical_pieces_rhythms_pieceId` FOREIGN KEY (`pieceId`) REFERENCES `musical_pieces` (`id`),
  CONSTRAINT `musical_pieces_rhythms_rhythmId` FOREIGN KEY (`rhythmId`) REFERENCES `rhythms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `type` tinyint(3) unsigned NOT NULL,
  `lifeTime` text NOT NULL,
  `origin` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `persons_images`
--

DROP TABLE IF EXISTS `persons_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons_images` (
  `personId` int(10) unsigned NOT NULL,
  `data` mediumblob NOT NULL,
  PRIMARY KEY (`personId`),
  CONSTRAINT `persons_images_personId` FOREIGN KEY (`personId`) REFERENCES `persons` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rhythms`
--

DROP TABLE IF EXISTS `rhythms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rhythms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `timeSigNum` tinyint(3) unsigned NOT NULL,
  `timeSigDen` tinyint(3) unsigned NOT NULL,
  `popularity` text NOT NULL,
  `category` text NOT NULL,
  `usageImage` text NOT NULL,
  `usageText` text NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-08-29 22:39:45
