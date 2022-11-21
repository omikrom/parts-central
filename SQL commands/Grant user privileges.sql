CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'P4ssw0rd##';
GRANT ALL PRIVILEGES ON user TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON parts TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON parts_of_bikes TO 'app_user'@'localhost';
GRANT ALL PRIVILEGES ON display_bikes TO 'app_user'@'localhost';
