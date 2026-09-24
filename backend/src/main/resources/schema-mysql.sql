-- ========================================================
-- Enterprise Employee & Asset Management System
-- Relational MySQL Schema Definition
-- ========================================================

CREATE DATABASE IF NOT EXISTS `enterprise_asset_mgmt`
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `enterprise_asset_mgmt`;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `description` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Users Table (Authentication & System Roles)
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'HR', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    `active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Employees Table
CREATE TABLE IF NOT EXISTS `employees` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employee_id` VARCHAR(30) NOT NULL UNIQUE,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `department_id` BIGINT NOT NULL,
    `designation` VARCHAR(100) NOT NULL,
    `joining_date` DATE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_employees_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 4. Assets Table
CREATE TABLE IF NOT EXISTS `assets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `asset_tag` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `type` ENUM('LAPTOP', 'DESKTOP', 'MONITOR', 'KEYBOARD', 'MOUSE', 'MOBILE', 'TABLET', 'PRINTER', 'OTHER') NOT NULL,
    `serial_number` VARCHAR(100) NOT NULL UNIQUE,
    `purchase_date` DATE NOT NULL,
    `status` ENUM('AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED') NOT NULL DEFAULT 'AVAILABLE',
    `assigned_employee_id` BIGINT DEFAULT NULL,
    `description` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_assets_employee` FOREIGN KEY (`assigned_employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Asset Assignments Table (Audit & Assignment Lifecycle)
CREATE TABLE IF NOT EXISTS `asset_assignments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `asset_id` BIGINT NOT NULL,
    `employee_id` BIGINT NOT NULL,
    `assigned_date` DATE NOT NULL,
    `returned_date` DATE DEFAULT NULL,
    `status` ENUM('ACTIVE', 'RETURNED') NOT NULL DEFAULT 'ACTIVE',
    `notes` VARCHAR(500),
    `assigned_by_user_id` BIGINT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_assignments_asset` FOREIGN KEY (`asset_id`) REFERENCES `assets` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_assignments_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_assignments_user` FOREIGN KEY (`assigned_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Performance Indexes
CREATE INDEX `idx_emp_department` ON `employees` (`department_id`);
CREATE INDEX `idx_emp_status` ON `employees` (`status`);
CREATE INDEX `idx_asset_status` ON `assets` (`status`);
CREATE INDEX `idx_asset_type` ON `assets` (`type`);
CREATE INDEX `idx_assignments_status` ON `asset_assignments` (`status`);
