-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2026-03-25 20:31:23
-- 服务器版本： 5.7.44-log
-- PHP Version: 7.2.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `xxxxxxxxxx`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `token`) VALUES
(2, 'admin', '123456', '634173546395134800');

-- --------------------------------------------------------

--
-- 表的结构 `bet`
--

CREATE TABLE IF NOT EXISTS `bet` (
  `id` int(255) NOT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `amount` double(255,2) DEFAULT NULL,
  `guess` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `resultid` varchar(255) DEFAULT NULL,
  `result` double(255,2) DEFAULT NULL,
  `isreturn` int(11) DEFAULT '0',
  `amountreturn` double(255,2) DEFAULT '0.00',
  `messageid` varchar(255) DEFAULT NULL,
  `firstname` varchar(255) DEFAULT NULL,
  `inviter_telegramid` varchar(255) DEFAULT NULL,
  `peilv` double(10,2) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=17437 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `fengpan`
--

CREATE TABLE IF NOT EXISTS `fengpan` (
  `id` int(11) NOT NULL,
  `resultid` varchar(255) DEFAULT NULL,
  `closeTime` varchar(255) DEFAULT NULL,
  `openTime` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=67 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `groupadmin`
--

CREATE TABLE IF NOT EXISTS `groupadmin` (
  `id` int(11) NOT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `groupadmin`
--

INSERT INTO `groupadmin` (`id`, `telegramid`, `time`) VALUES
(39, '00000000', NULL);

-- --------------------------------------------------------

--
-- 表的结构 `jiangli`
--

CREATE TABLE IF NOT EXISTS `jiangli` (
  `id` int(111) NOT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `amount` double(10,2) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `mingyan`
--

CREATE TABLE IF NOT EXISTS `mingyan` (
  `id` int(11) NOT NULL,
  `content` varchar(1000) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- 转存表中的数据 `mingyan`
--

INSERT INTO `mingyan` (`id`, `content`) VALUES
(1, '救救我啊奥特曼，哪怕你只能撑三分钟…'),
(2, '无言独上西楼，月如钩。寂寞梧桐深院锁清秋。'),
(3, '此情无计可消除，才下眉头，却上心头。'),
(4, '忘羡一曲远，曲终人不散。'),
(5, '不要想，去感受。'),
(6, '三十功名尘与土，八千里路云和月。'),
(7, '人生如逆旅，我亦是行人。'),
(8, '参差荇菜，左右流之。窈窕淑女，寤寐求之。'),
(9, '危楼高百尺，手可摘星辰。 '),
(10, '哪怕是打断你的手脚，也要把你带回去。'),
(11, '绚烂如繁樱，瞬息绽放后凋落。 花以香为证，曾美至惊心动魄。'),
(12, '踏长风破万里浪 '),
(13, '人们总是希望付出最少的，获得最好的。'),
(14, '暗恋不会窥见天光，青梅抵不过天降，永远没有旧情复燃破镜重圆。 '),
(15, '我的唯一抉择，成为我宇宙的真理！'),
(16, '对我而言，只是短短的五百年。对他而言，却是数之不尽的轮回！'),
(17, '孤独不是一种脾性，而是一种无奈。'),
(18, 'Discover, Create and Use. '),
(19, '你们认为没有路，是因为没有学会不择手段。 '),
(20, '不管明天会发生什么，请牢记住今天。  '),
(21, '旅行的意义在于找到自己，而非浏览他人。'),
(22, '活的不快乐，本质上源于自己的无能。 '),
(23, '髣髴兮若轻云之蔽月，飘飖兮若流风之回雪。'),
(24, '我们在年少时并不知道，有些乐章一旦开始，唱的就是曲终人散。 '),
(25, '不用羡慕，你也是太阳。'),
(26, '不管明天会发生什么，请牢记住今天。 '),
(27, '我身上早已烙下沉默燃烧后遗留下来的哀愁。'),
(28, '我的手机明明没有坏掉，可是她为什么没给我打电话呢？'),
(29, '不要用其他人当作走向死亡怀抱的借口！'),
(30, '我妄想能改变命运，可终究不离此痛。'),
(31, '不管你说再多的慌，只有自己的内心，是无法欺骗的啊。'),
(32, '甲之蜜糖，乙之砒霜。'),
(33, '我所理解的生活就是和喜欢的一切在一起。'),
(34, '弱小和无知不是生存的障碍，傲慢才是。'),
(35, '一草一千秋，一花一世界。 '),
(36, '人啊...想要保护重要东西的时候，就真的能变得很坚强。'),
(37, 'MAKE OUR DREAMS ALIVE  '),
(38, '月落乌啼霜满天，江枫渔火对愁眠。'),
(39, '叶え！私たちの夢ー。'),
(40, '“做到最牛”就是我所订下的每日标准，不管到哪儿都是。'),
(41, '温柔正确的人总是难以生存，因为这世界既不温柔，也不正确。'),
(42, '不幸的人最怕别人说他们的幸福。 '),
(43, '真実はいつもひとつ！ '),
(44, 'さあ、始めようか。(那么，游戏开始吧。)  '),
(45, '与绝望~和睦相处。'),
(46, '犹豫就会败北，果断就会白给。'),
(47, '宇宙是蚂蚁的梦。 '),
(48, '赤锋矛，不朽盾，斩尽仙王灭九天！'),
(49, '粉色蓝宝石的宝石语是「献给弱者的正义」。');

-- --------------------------------------------------------

--
-- 表的结构 `pay`
--

CREATE TABLE IF NOT EXISTS `pay` (
  `id` int(255) NOT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `amount` double(255,3) DEFAULT NULL,
  `topup_address` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `way` varchar(255) DEFAULT NULL,
  `applytime` varchar(255) DEFAULT NULL,
  `applytimestamp` varchar(255) DEFAULT NULL,
  `changetime` varchar(255) DEFAULT NULL,
  `replyMessageid` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `isfuyingli` int(11) DEFAULT '0',
  `username` varchar(1000) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=770 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `result`
--

CREATE TABLE IF NOT EXISTS `result` (
  `i` int(11) NOT NULL,
  `id` varchar(255) NOT NULL,
  `one` int(11) NOT NULL,
  `two` int(11) NOT NULL,
  `three` int(11) NOT NULL,
  `big` int(11) DEFAULT NULL,
  `small` int(11) DEFAULT NULL,
  `odd` int(11) DEFAULT NULL,
  `even` int(11) DEFAULT NULL,
  `baozi` int(11) DEFAULT NULL,
  `shunzi` int(11) DEFAULT NULL,
  `duizi` int(11) DEFAULT NULL,
  `longhu` varchar(255) DEFAULT NULL,
  `result_time` varchar(255) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=109889 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `trcwallet`
--

CREATE TABLE IF NOT EXISTS `trcwallet` (
  `id` int(11) NOT NULL,
  `privateKey` varchar(255) DEFAULT NULL,
  `publicKey` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `balance` double(10,10) DEFAULT NULL,
  `createtime` varchar(255) DEFAULT NULL,
  `telegramid` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `name` varchar(1000) DEFAULT NULL,
  `nickname` varchar(1000) DEFAULT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `balance` double(255,2) DEFAULT '0.00',
  `yongjinbalance` double(10,2) NOT NULL DEFAULT '0.00',
  `register_time` varchar(255) DEFAULT NULL,
  `trx_address` varchar(255) DEFAULT '未绑定提现地址',
  `privatetype` varchar(255) DEFAULT NULL,
  `inviter_telegramid` varchar(255) DEFAULT NULL,
  `lasthuishui` varchar(255) DEFAULT NULL,
  `huishui` double(10,2) DEFAULT '0.00',
  `liushui` double(10,2) NOT NULL DEFAULT '0.00',
  `chongzhiamount` double(10,2) NOT NULL DEFAULT '0.00',
  `fanshui` double(10,2) NOT NULL DEFAULT '0.00',
  `zwfanshui` double(10,2) NOT NULL DEFAULT '0.00'
) ENGINE=MyISAM AUTO_INCREMENT=2351 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 表的结构 `withdrawal`
--

CREATE TABLE IF NOT EXISTS `withdrawal` (
  `id` int(11) NOT NULL,
  `telegramid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `amount` double(255,2) DEFAULT NULL,
  `state` int(11) DEFAULT NULL,
  `way` varchar(255) DEFAULT NULL,
  `applytime` varchar(255) DEFAULT NULL,
  `changetime` varchar(255) DEFAULT NULL,
  `replyMessageid` varchar(255) DEFAULT NULL,
  `sxf` double(255,2) DEFAULT NULL,
  `hashid` varchar(255) DEFAULT NULL,
  `trx_address` varchar(255) DEFAULT NULL
) ENGINE=MyISAM AUTO_INCREMENT=208 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `bet`
--
ALTER TABLE `bet`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `fengpan`
--
ALTER TABLE `fengpan`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `groupadmin`
--
ALTER TABLE `groupadmin`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `jiangli`
--
ALTER TABLE `jiangli`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `mingyan`
--
ALTER TABLE `mingyan`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `pay`
--
ALTER TABLE `pay`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `result`
--
ALTER TABLE `result`
  ADD PRIMARY KEY (`i`) USING BTREE;

--
-- Indexes for table `trcwallet`
--
ALTER TABLE `trcwallet`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `withdrawal`
--
ALTER TABLE `withdrawal`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `bet`
--
ALTER TABLE `bet`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17437;
--
-- AUTO_INCREMENT for table `fengpan`
--
ALTER TABLE `fengpan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=67;
--
-- AUTO_INCREMENT for table `groupadmin`
--
ALTER TABLE `groupadmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `jiangli`
--
ALTER TABLE `jiangli`
  MODIFY `id` int(111) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `mingyan`
--
ALTER TABLE `mingyan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `pay`
--
ALTER TABLE `pay`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=770;
--
-- AUTO_INCREMENT for table `result`
--
ALTER TABLE `result`
  MODIFY `i` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=109889;
--
-- AUTO_INCREMENT for table `trcwallet`
--
ALTER TABLE `trcwallet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2351;
--
-- AUTO_INCREMENT for table `withdrawal`
--
ALTER TABLE `withdrawal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=208;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
