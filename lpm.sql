-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Ven 15 Janvier 2016 à 11:12
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
-- Structure de la table `release`
--

CREATE TABLE IF NOT EXISTS `release` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_type` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `day` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Contenu de la table `release`
--

INSERT INTO `release` (`id`, `id_type`, `name`, `day`) VALUES
(1, 1, 'QA', '2015-11-12'),
(2, 2, 'DEV', '2015-08-18'),
(3, 1, 'PRD', '2015-11-13'),
(4, 2, 'QA', '2015-08-12'),
(5, 3, 'QA', '2015-08-13'),
(6, 3, 'PRD', '2015-08-20');

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
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `id_user_add` int(11) NOT NULL,
  `id_user_responsible` int(11) NOT NULL,
  `id_user_accountable` int(11) NOT NULL,
  `id_status` int(11) NOT NULL,
  `id_type` int(11) NOT NULL,
  `id_cat` int(11) NOT NULL,
  `id_subcat` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `version` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `comments` text COLLATE utf8_unicode_ci NOT NULL,
  `comments_valid` text COLLATE utf8_unicode_ci NOT NULL,
  `date_creation` datetime NOT NULL,
  `date_update` datetime NOT NULL,
  `date_finish` date NOT NULL,
  `valid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=151 ;

--
-- Contenu de la table `task`
--

INSERT INTO `task` (`id`, `name`, `id_user_add`, `id_user_responsible`, `id_user_accountable`, `id_status`, `id_type`, `id_cat`, `id_subcat`, `priority`, `version`, `comments`, `comments_valid`, `date_creation`, `date_update`, `date_finish`, `valid`) VALUES
(2, '', 1, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(3, '', 1, 5, 0, 0, 5, 0, 0, 0, '', 'text', '', '2015-10-14 07:32:55', '0000-00-00 00:00:00', '0000-00-00', 0),
(5, 'Pre-filling FKAC (DB)', 1, 5, 0, 0, 1, 0, 0, 0, '', '- Création de la table "md_FKAC"<br>- Chargement des données dans la base de données', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-26', 0),
(8, '', 1, 2, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(10, 'Email alerts', 2, 3, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2016-01-14', 0),
(12, 'Project Forecasting', 1, 3, 0, 0, 1, 0, 0, 0, '', '', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-24', 0),
(13, 'Intégration données  NAM legacy', 1, 5, 0, 0, 1, 0, 0, 0, '', '<a href="file:///Z:/13.%20PILOTAGE%20PAR%20OFFRE/2.%20OFFRE%20PERF%20INDUS/1.%20BI%20SOLUTIONS/SPECIFIQUES%20CLIENTS/PHILIPS%20Koolog%20IBP/5-Development/4-Portal%20specifications/27%20-%20NAM%20legacy/Integration%20masterdata%20NAM%20Legacy.pptx">Spec</a>', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-24', 0),
(14, 'Project Forecasting', 1, 3, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-25', 0),
(15, 'Pre-filling FKAC (screen)', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Création de l', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-27', 0),
(16, '', 1, 1, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(18, '', 1, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(20, 'Intégration données  NAM legacy', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Sur project details, quand un cellule est modifiée la grille est recharger et le focus est perdu.', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-25', 0),
(21, 'Pre-filling FKAC (exe)', 1, 5, 0, 0, 1, 0, 0, 0, '', 'Utilisation des données par défaut lors de la création de projet<br>', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-08-28', 0),
(106, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-11-05 13:14:47', '0000-00-00 00:00:00', '2015-10-27', 0),
(24, '', 1, 1, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2016-01-15', 0),
(25, '', 1, 2, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(26, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '2015-10-14 07:32:56', '0000-00-00 00:00:00', '2015-10-21', 0),
(30, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-03', 0),
(31, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2015-09-04', 0),
(59, 'Emails alerts', 1, 1, 0, 0, 1, 0, 0, 1, '', 'text', '', '2015-11-16 13:33:22', '2015-12-21 13:02:49', '2016-01-15', 1),
(127, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-10-13 15:19:16', '0000-00-00 00:00:00', '2015-10-15', 0),
(124, 'Waterfall', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-10-19 13:02:29', '0000-00-00 00:00:00', '2015-10-12', 0),
(137, 'testfds ', 1, 1, 1, 0, 1, 0, 0, 0, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-16 13:49:12', '2015-12-21 13:02:49', '2015-11-19', 1),
(140, 'Emails alerts', 1, 1, 0, 0, 1, 0, 0, 0, '', 'text', '', '2015-11-09 07:54:22', '0000-00-00 00:00:00', '2016-01-14', 0),
(135, 'Waterfall 2', 1, 3, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '2015-11-05 13:14:53', '0000-00-00 00:00:00', '2015-10-27', 0),
(143, 'test ''gf', 1, 1, 0, 0, 1, 0, 0, 1, '', 'test ''', '', '2015-11-09 07:54:22', '0000-00-00 00:00:00', '2016-01-14', 0),
(149, 'testfds ', 1, 5, 1, 0, 1, 0, 0, 0, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-19 09:04:54', '2015-12-21 13:42:20', '0000-00-00', 1),
(150, 'testfds ', 1, 1, 1, 0, 1, 0, 0, 2, '', 'gfd<br>fdsf ff<br>ffsfdsfds<br>', '', '2015-11-19 09:31:22', '2015-12-21 13:02:49', '2015-11-19', 0);

-- --------------------------------------------------------

--
-- Structure de la table `task_file`
--

CREATE TABLE IF NOT EXISTS `task_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_task` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=31 ;

--
-- Contenu de la table `task_file`
--

INSERT INTO `task_file` (`id`, `id_task`, `title`, `type`) VALUES
(29, 21, 'testFile.jpg', 'image/jpeg'),
(30, 59, 'Sans-titre-4.png', 'image/png');

-- --------------------------------------------------------

--
-- Structure de la table `type`
--

CREATE TABLE IF NOT EXISTS `type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Contenu de la table `type`
--

INSERT INTO `type` (`id`, `name`, `color`) VALUES
(1, 'L1', 'indigo'),
(2, 'L2', 'blue'),
(3, 'L3', 'cyan'),
(4, 'L4', 'teal'),
(5, 'Abs', 'pink');

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
(2, 0, 'fleury@segeco.fr', '1234', 'fleury', '', '0000-00-00', '0'),
(3, 0, '', '', 'kevin', '', '0000-00-00', '0'),
(4, 0, '', '', 'patrice', '', '0000-00-00', '0'),
(5, 0, '', '', 'nayed', '', '0000-00-00', '0');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
