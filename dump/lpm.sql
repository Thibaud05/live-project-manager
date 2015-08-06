-- phpMyAdmin SQL Dump
-- version 4.1.4
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 06 Août 2015 à 08:47
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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Contenu de la table `release`
--

INSERT INTO `release` (`id`, `id_type`, `name`, `day`) VALUES
(1, 1, 'QA', '2015-08-12'),
(2, 2, 'QA', '2015-08-18'),
(3, 1, 'PRD', '2015-08-14');

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
  `date_creation` date NOT NULL,
  `date_finish` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=33 ;

--
-- Contenu de la table `task`
--

INSERT INTO `task` (`id`, `name`, `id_user_add`, `id_user_responsible`, `id_user_accountable`, `id_status`, `id_type`, `id_cat`, `id_subcat`, `priority`, `version`, `comments`, `comments_valid`, `date_creation`, `date_finish`) VALUES
(2, '', 0, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-03'),
(3, '', 0, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-04'),
(5, 'test03', 0, 2, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-12'),
(6, '', 0, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-05'),
(8, '', 0, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-06'),
(9, 'test08', 0, 3, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '0000-00-00'),
(10, 'test09', 0, 2, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '0000-00-00'),
(12, '', 0, 2, 0, 0, 1, 0, 0, 0, '', '', '', '0000-00-00', '2015-08-11'),
(13, 'Bug IE retour gauche', 0, 2, 0, 0, 1, 0, 0, 0, '', 'Sur les ecrans PDF market et factory', '', '0000-00-00', '2015-08-04'),
(14, 'test13', 0, 1, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '0000-00-00'),
(15, 'test14', 0, 2, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-14'),
(16, '', 0, 4, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-07'),
(18, '', 0, 3, 0, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-03'),
(22, 'Waterfall', 0, 2, 0, 0, 1, 0, 0, 0, '', 'Vérifier que le prix est calculé sur les trois derniers mois.<br><br>Pour le waterfall factory le prix utilisé doit être celui de la region de la factory.', '', '0000-00-00', '2015-08-05'),
(20, 'Bug première ligne', 0, 2, 0, 0, 1, 0, 0, 0, '', 'Sur project details, quand un cellule est modifiée la grille est recharger et le focus est perdu.', '', '0000-00-00', '2015-08-03'),
(21, 'toto', 0, 2, 0, 0, 1, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-13'),
(24, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-04'),
(23, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-05'),
(25, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-06'),
(26, '', 1, 3, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-07'),
(27, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-03'),
(28, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-04'),
(29, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-05'),
(30, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-06'),
(31, '', 1, 5, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-07'),
(32, '', 1, 1, 1, 0, 5, 0, 0, 0, '', 'text', '', '0000-00-00', '2015-08-10');

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
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Contenu de la table `task_file`
--

INSERT INTO `task_file` (`id`, `id_task`, `title`, `type`) VALUES
(4, 5, 'testFile.jpg', 'image/jpeg');

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
  `firstname` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(90) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id`, `id_group`, `email`, `password`, `firstname`, `lastname`) VALUES
(1, 1, 'admin@lpm.com', '0000', 'Thibaud', 'Granier'),
(2, 0, 'fleury@segeco.fr', '0000', 'fleury', ''),
(3, 0, '', '', 'kevin', ''),
(4, 0, '', '', 'patrice', ''),
(5, 0, '', '', 'nayed', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
