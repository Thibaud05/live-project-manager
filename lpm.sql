-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Ven 18 Novembre 2016 à 07:18
-- Version du serveur :  5.6.15-log
-- Version de PHP :  5.5.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `lpm`
--

-- --------------------------------------------------------

--
-- Structure de la table `cat`
--

CREATE TABLE IF NOT EXISTS `cat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Contenu de la table `cat`
--

INSERT INTO `cat` (`id`, `name`) VALUES
(1, 'conv'),
(2, 'web');

-- --------------------------------------------------------

--
-- Structure de la table `group`
--

CREATE TABLE IF NOT EXISTS `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Contenu de la table `group`
--

INSERT INTO `group` (`id`, `name`) VALUES
(1, 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `img` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `desc` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Contenu de la table `project`
--

INSERT INTO `project` (`id`, `title`, `img`, `desc`) VALUES
(1, 'Koolog IBP', '', ''),
(2, 'WIF', '', ''),
(3, 'LPM', '', '');

-- --------------------------------------------------------

--
-- Structure de la table `project_user`
--

CREATE TABLE IF NOT EXISTS `project_user` (
  `id_user` int(11) NOT NULL,
  `id_project` int(11) NOT NULL,
  PRIMARY KEY (`id_user`,`id_project`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Contenu de la table `project_user`
--

INSERT INTO `project_user` (`id_user`, `id_project`) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 1),
(4, 1),
(5, 2);

-- --------------------------------------------------------

--
-- Structure de la table `release`
--

CREATE TABLE IF NOT EXISTS `release` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `typeId` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `day` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=70 ;

--
-- Contenu de la table `release`
--

INSERT INTO `release` (`id`, `typeId`, `name`, `day`) VALUES
(1, 1, 'QA', '2016-02-16'),
(2, 2, 'DEV', '2015-08-18'),
(3, 1, 'PRD', '2016-02-23'),
(4, 2, 'QA', '2015-08-12'),
(5, 3, 'QA', '2015-08-13'),
(6, 3, 'PRD', '2015-08-20'),
(48, 17, 'PRD', '2016-03-03'),
(47, 17, 'QA', '2016-03-01'),
(46, 17, 'DEV', '2016-02-29'),
(45, 17, 'α', '2016-02-26'),
(49, 18, 'AAA', '2016-06-13'),
(62, 28, 'α', '2016-08-02'),
(63, 28, 'DEV', '2016-08-08'),
(64, 28, 'QA', '2016-08-12'),
(65, 28, 'PRD', '2016-08-19'),
(66, 29, 'α', '2016-07-11'),
(67, 29, 'DEV', '2016-07-15'),
(68, 29, 'QA', '2016-07-22'),
(69, 29, 'PRD', '2016-07-28');

-- --------------------------------------------------------

--
-- Structure de la table `status`
--

CREATE TABLE IF NOT EXISTS `status` (
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=13 ;

--
-- Contenu de la table `status`
--

INSERT INTO `status` (`name`, `id`) VALUES
('Todo', 1),
('On track', 2),
('Done', 3),
('To plan', 4),
('Validated', 5),
('QA', 6),
('PRD', 7),
('More', 8),
('Local', 9),
('On Hold', 10),
('ToBeFix', 11),
('ShowStopper', 12);

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `creationUserId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `accountableUserId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `typeId` int(11) NOT NULL,
  `catId` int(11) NOT NULL,
  `subcatId` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `version` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `comments_valid` text COLLATE utf8_unicode_ci NOT NULL,
  `creationDate` datetime NOT NULL,
  `updateDate` datetime NOT NULL,
  `day` date NOT NULL,
  `valid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=222 ;

--
-- Contenu de la table `task`
--

INSERT INTO `task` (`id`, `title`, `creationUserId`, `userId`, `accountableUserId`, `statusId`, `typeId`, `catId`, `subcatId`, `priority`, `version`, `description`, `comments_valid`, `creationDate`, `updateDate`, `day`, `valid`) VALUES
(2, '', 1, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(3, '', 1, 5, 0, 0, 5, 0, 0, 0, '', 'text', '', '2015-10-14 07:32:55', '0000-00-00 00:00:00', '0000-00-00', 0),
(5, 'Pre-filling FKAC (DB)', 1, 5, 0, 0, 1, 0, 0, 0, '', '- Création de la table "md_FKAC"<br>- Chargement des données dans la base de données', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-26', 0),
(8, '', 1, 2, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(10, 'Email alerts', 1, 1, 0, 0, 1, 0, 0, 1, '', 'text', '', '0000-00-00 00:00:00', '2016-01-20 13:04:47', '2016-01-14', 0),
(12, 'Project Forecasting', 1, 3, 0, 0, 1, 0, 0, 0, '', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-24', 0),
(13, 'Intégration données  NAM legacy', 1, 5, 0, 0, 1, 0, 0, 0, '', '<a href="file:///Z:/13.%20PILOTAGE%20PAR%20OFFRE/2.%20OFFRE%20PERF%20INDUS/1.%20BI%20SOLUTIONS/SPECIFIQUES%20CLIENTS/PHILIPS%20Koolog%20IBP/5-Development/4-Portal%20specifications/27%20-%20NAM%20legacy/Integration%20masterdata%20NAM%20Legacy.pptx">Spec</a>', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-24', 0),
(14, 'Project Forecasting', 1, 3, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-25', 0),
(15, 'Pre-filling FKAC (screen)', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Création de l', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-27', 0),
(16, '', 1, 1, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(18, '', 1, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(20, 'Intégration données  NAM legacy', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Sur project details, quand un cellule est modifiée la grille est recharger et le focus est perdu.', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-25', 0),
(21, 'Pre-filling FKAC (exe)', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Utilisation des données par défaut lors de la création de projet<br>', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-28', 0),
(106, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-11-05 13:14:47', '0000-00-00 00:00:00', '2015-10-27', 0),
(24, '', 1, 1, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '2016-01-26 07:29:46', '2016-01-15', 0),
(25, '', 1, 2, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(26, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '2015-10-14 07:32:56', '0000-00-00 00:00:00', '2015-10-21', 0),
(30, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(31, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(59, 'Emails alerts', 1, 2, 0, 0, 1, 0, 0, 0, '', 'text', '', '2015-11-16 12:33:22', '2016-01-26 07:29:46', '2016-01-27', 1),
(127, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-10-13 15:19:16', '0000-00-00 00:00:00', '2015-10-15', 0),
(124, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-10-19 13:02:29', '0000-00-00 00:00:00', '2015-10-12', 0),
(137, 'testfds ', 1, 1, 1, 0, 1, 0, 0, 0, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-16 13:49:12', '2015-12-21 13:02:49', '2015-11-19', 1),
(140, 'Emails alerts', 1, 1, 0, 0, 1, 0, 0, 0, '', 'text', '', '2015-11-09 06:54:22', '2016-01-20 13:04:47', '2016-01-14', 0),
(135, 'Waterfall 8', 1, 2, 1, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory', '', '2015-11-04 12:14:53', '2016-02-24 14:37:09', '2016-02-22', 0),
(143, 'test ''gf', 1, 1, 0, 0, 1, 0, 0, 1, '', 'test ''', '', '2015-11-09 07:54:22', '0000-00-00 00:00:00', '2016-01-14', 0),
(149, 'testfds ', 1, 5, 1, 0, 1, 0, 0, 0, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-19 09:04:54', '2015-12-21 13:42:20', '0000-00-00', 1),
(150, 'testfds ', 1, 1, 1, 0, 1, 0, 0, 2, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-19 09:31:22', '2015-12-21 13:02:49', '2015-11-19', 0),
(210, 'New task', 1, 3, 3, 0, 18, 0, 0, 1, '', '', '', '2016-07-19 05:31:57', '2016-07-21 11:22:39', '2016-07-18', 0),
(155, 'Waterfall 7', 1, 2, 1, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory', '', '2016-01-27 02:46:56', '2016-02-26 11:05:20', '2016-02-24', 0),
(175, 'New task', 1, 4, 1, 0, 5, 0, 0, 0, '', '', '', '2016-02-01 17:32:16', '2016-10-11 14:06:42', '0000-00-00', 0),
(176, 'New task', 1, 2, 2, 0, 1, 0, 0, 0, '', '', '', '2016-02-01 11:32:16', '2016-06-01 15:03:31', '2016-06-01', 0),
(177, 'task 3', 4, 2, 2, 0, 1, 0, 0, 0, '', 'fghgf', '', '2016-02-15 06:38:30', '2016-03-22 13:43:07', '2016-03-29', 1),
(178, 'New task', 1, 2, 2, 0, 1, 0, 0, 0, '', 'fff', '', '2016-02-15 10:38:30', '2016-04-15 08:40:39', '2016-02-26', 0),
(179, 'New task', 1, 1, 1, 0, 5, 0, 0, 0, '', '', '', '2016-02-16 18:42:34', '2016-02-16 18:42:34', '2016-02-01', 0),
(211, 'New task', 1, 3, 3, 0, 18, 0, 0, 0, '', '', '', '2016-07-21 11:22:13', '2016-07-21 11:22:39', '2016-07-18', 0),
(209, 'New task3', 1, 5, 5, 0, 18, 0, 0, 0, '', 'task 1', '', '2016-06-13 08:00:47', '2016-06-13 08:00:55', '2016-06-16', 0),
(200, '', 1, 5, 1, 0, 1, 0, 0, 38, '', '', '', '2016-02-29 12:16:46', '2016-02-29 13:07:52', '2016-03-01', 0),
(201, 'New task2', 1, 5, 5, 0, 18, 0, 0, 0, '', 'task 1', '', '2016-06-13 05:41:44', '2016-06-13 08:00:55', '2016-06-15', 0),
(202, 'New task', 1, 5, 5, 0, 18, 0, 0, 0, '', 'task 1', '', '2016-06-13 07:42:02', '2016-06-13 07:42:47', '2016-06-13', 0),
(196, 'task 2', 1, 3, 3, 0, 1, 0, 0, 0, '', 'hgfhgf', '', '2016-02-29 09:16:03', '2016-03-22 13:46:39', '0000-00-00', 0),
(197, 'task 12', 4, 2, 2, 0, 1, 0, 0, 0, '', 'fff', '', '2016-02-29 04:16:05', '2016-04-13 08:50:59', '2016-03-30', 0),
(198, 'New task', 1, 1, 1, 0, 1, 0, 0, 0, '', 'hgfhgf', '', '2016-02-29 10:16:06', '2016-10-11 14:06:42', '2016-10-19', 0),
(199, 'New task', 4, 5, 5, 0, 18, 0, 0, 0, '', 'task 1', '', '2016-02-29 05:16:08', '2016-06-13 08:00:25', '2016-06-14', 0),
(216, 'test', 1, 1, 1, 0, 18, 0, 0, 0, '', 'super ', '', '2016-07-25 03:03:17', '2016-09-26 14:48:11', '2016-09-29', 0),
(220, 'New task', 1, 1, 1, 0, 18, 0, 0, 0, '', 'fdsf', '', '2016-09-26 08:56:54', '2016-09-26 14:46:21', '2016-09-30', 0),
(215, 'New task', 1, 1, 1, 0, 17, 0, 0, 0, '', '', '', '2016-07-25 07:03:04', '2016-07-25 09:29:01', '2016-07-28', 0),
(221, 'New ta', 1, 1, 1, 0, 18, 0, 0, 0, '', '', '', '2016-09-26 07:04:03', '2016-10-03 11:19:19', '2016-09-27', 0),
(219, 'New task', 1, 1, 1, 0, 18, 0, 0, 2, '', '', '', '2016-07-25 09:29:53', '2016-07-25 09:29:53', '2016-07-25', 0);

-- --------------------------------------------------------

--
-- Structure de la table `task_file`
--

CREATE TABLE IF NOT EXISTS `task_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskId` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=28 ;

--
-- Contenu de la table `task_file`
--

INSERT INTO `task_file` (`id`, `taskId`, `title`, `type`) VALUES
(26, 178, 'mrpetit.jpg', 'image/jpeg'),
(25, 135, 'r90cwi.png', 'image/png'),
(24, 155, 'monsoeur.jpg', 'image/jpeg'),
(23, 155, 'monsoeur.jpg', 'image/jpeg'),
(22, 155, 'r90cwi.png', 'image/png'),
(21, 155, 'Programme-informatique-binaire.jpg', 'image/jpeg'),
(27, 178, 'mrpetit.jpg', 'image/jpeg');

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE IF NOT EXISTS `type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_project` int(11) NOT NULL,
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=30 ;

--
-- Contenu de la table `type`
--

INSERT INTO `type` (`id`, `id_project`, `name`, `color`) VALUES
(1, 1, 'L1', 'indigo'),
(2, 1, 'L2', 'blue'),
(3, 1, 'L3', 'cyan'),
(4, 1, 'L4', 'teal'),
(5, 1, 'Abs', 'pink'),
(17, 1, 't15', 'teal'),
(18, 2, 'v4', 'green'),
(28, 1, '2.0', 'red'),
(21, 0, '1.9', 'red'),
(29, 1, '2.1', 'blue');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_group` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `firstName` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `lastName` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `lastconnexion` date NOT NULL,
  `autoconnexion` varchar(250) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `id_group`, `email`, `password`, `firstName`, `lastName`, `lastconnexion`, `autoconnexion`) VALUES
(1, 1, 'admin@lpm.com', 'aaaa', 'Thibaud', 'Granier', '0000-00-00', '56d54788649962c042e8d92210b40ae4'),
(2, 1, 'fleury@segeco.fr', '1234', 'Fleury', '', '0000-00-00', '0'),
(3, 0, '', '', 'Kevin', '', '0000-00-00', '0'),
(4, 0, '', '', 'Patrice', '', '0000-00-00', '0'),
(5, 0, '', '', 'Nayed', '', '0000-00-00', '0');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
