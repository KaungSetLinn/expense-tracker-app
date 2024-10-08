CREATE TABLE `expense_category` (
  `category_id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` text NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `expense` (
  `expense_id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `category_id` int(11) NOT NULL,
  `expense_note` text DEFAULT NULL,
  `expense_date` date DEFAULT NULL,
  PRIMARY KEY (`expense_id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `expense_category` (`category_id`),
  CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `users` (
  `user_id` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE VIEW expense_summary AS
SELECT e.expense_id, e.amount, e.expense_note, e.receipt, e.expense_date, e.user_id, u.email, ec.category_id, ec.category_name 
FROM expense e JOIN users u ON e.user_id = u.user_id JOIN expense_category ec ON e.category_id = ec.category_id; 