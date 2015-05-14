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
  `password` VARCHAR(100) NULL DEFAULT NULL,
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
  `upc` BIGINT(12) NULL DEFAULT NULL,
  `rating` INTEGER(3) NULL DEFAULT NULL,
  `review_text` VARCHAR(500) NULL DEFAULT NULL,
  `review_title` VARCHAR(400) NULL DEFAULT NULL,
  PRIMARY KEY (`review_id`)
);

-- ---
-- Table 'following'
-- 
-- ---

DROP TABLE IF EXISTS `followers`;
    
CREATE TABLE `followers` (
  `user_id` INTEGER(10) NULL AUTO_INCREMENT DEFAULT NULL,
  `follower_id` INTEGER(10) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `follower_id`)
);

-- ---
-- Table 'watchers'
-- 
-- ---

DROP TABLE IF EXISTS `watchers`;
    
CREATE TABLE `watchers` (
  `user_id` INTEGER(10) NULL AUTO_INCREMENT DEFAULT NULL,
  `product_id` BIGINT(12) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`, `product_id`)
);

-- ---
-- Table 'product'
-- 
-- ---

DROP TABLE IF EXISTS `products`;
    
CREATE TABLE `products` (
  `product_id` BIGINT(12) NULL AUTO_INCREMENT DEFAULT NULL,
  `upc` BIGINT(12) NULL DEFAULT NULL,
  `price` INTEGER(5) NULL DEFAULT NULL,
  `review_count` INTEGER(4) NULL DEFAULT 0,
  PRIMARY KEY (`product_id`, `upc`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `reviews` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `followers` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `followers` ADD FOREIGN KEY (follower_id) REFERENCES `users` (`user_id`);
ALTER TABLE `watchers` ADD FOREIGN KEY (user_id) REFERENCES `users` (`user_id`);
ALTER TABLE `watchers` ADD FOREIGN KEY (product_id) REFERENCES `products` (`product_id`);

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