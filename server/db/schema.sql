DROP DATABASE if exists pebble;

CREATE DATABASE pebble;

USE pebble;
-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'users'
-- 
-- ---

DROP TABLE IF EXISTS `users`;
    
CREATE TABLE `users` (
  `user_id` INTEGER(10) NULL AUTO_INCREMENT DEFAULT NULL,
  `username` VARCHAR(10) NULL DEFAULT NULL,
  `password` VARCHAR(10) NULL DEFAULT NULL,
  `email` VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);

-- ---
-- Table 'reviews'
-- 
-- ---

DROP TABLE IF EXISTS `reviews`;
    
CREATE TABLE `reviews` (
  `review_id` INTEGER(12) NULL AUTO_INCREMENT DEFAULT NULL,
  `user_id` INTEGER(10) NULL DEFAULT NULL,
  `upc` INTEGER(12) NULL DEFAULT NULL,
  `rating` INTEGER(3) NULL DEFAULT NULL,
  `review_text` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`review_id`)
);

-- ---
-- Table 'following'
-- 
-- ---

DROP TABLE IF EXISTS `following`;
    
CREATE TABLE `following` (
  `user_id` INTEGER(10) NULL AUTO_INCREMENT DEFAULT NULL,
  `follower_id` INTEGER(10) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `follower_id`)
);

-- ---
-- Table 'watching'
-- 
-- ---

DROP TABLE IF EXISTS `watching`;
    
CREATE TABLE `watching` (
  `user_id` INTEGER(10) NULL AUTO_INCREMENT DEFAULT NULL,
  `upc` INTEGER(12) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `upc`)
);

-- ---
-- Table 'product'
-- 
-- ---

DROP TABLE IF EXISTS `product`;
    
CREATE TABLE `product` (
  `upc` INTEGER(12) NULL AUTO_INCREMENT DEFAULT NULL,
  `price` INTEGER(5) NULL DEFAULT NULL,
  `review_ count` INTEGER(4) NULL DEFAULT NULL,
  PRIMARY KEY (`upc`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `reviews` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `following` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `following` ADD FOREIGN KEY (follower_id) REFERENCES `users` (`user_id`);
ALTER TABLE `watching` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `watching` ADD FOREIGN KEY (upc) REFERENCES `product` (`upc`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `users` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `reviews` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `following` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `watching` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `product` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `users` (`user_id`,`username`,`password`,`email`) VALUES
-- ('','','','');
-- INSERT INTO `reviews` (`review_id`,`user_id`,`upc`,`rating`,`review_text`) VALUES
-- ('','','','','');
-- INSERT INTO `following` (`user_id`,`follower_id`) VALUES
-- ('','');
-- INSERT INTO `watching` (`user_id`,`upc`) VALUES
-- ('','');
-- INSERT INTO `product` (`upc`,`price`,`review_ count`) VALUES
-- ('','','');