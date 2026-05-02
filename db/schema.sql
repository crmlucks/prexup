-- PrexUp MariaDB Schema
-- Multi-tenant Real Estate CRM

CREATE DATABASE IF NOT EXISTS prexup_crm;
USE prexup_crm;

-- Tenants Table
CREATE TABLE tenants (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    logo_url TEXT,
    config JSON,
    status ENUM('active', 'suspended', 'trial') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'agent', 'manager') DEFAULT 'agent',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE(email, tenant_id)
);

-- Leads Table
CREATE TABLE leads (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    assigned_to CHAR(36),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    source VARCHAR(100) DEFAULT 'WhatsApp',
    status ENUM('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost') DEFAULT 'new',
    budget DECIMAL(15, 2),
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

-- Properties Table
CREATE TABLE properties (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    location VARCHAR(255),
    type ENUM('house', 'apartment', 'land', 'commercial', 'villa') DEFAULT 'house',
    rooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    area VARCHAR(50),
    status ENUM('available', 'reserved', 'sold', 'rented') DEFAULT 'available',
    images JSON,
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Deals Table (Pipeline)
CREATE TABLE deals (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    lead_id CHAR(36) NOT NULL,
    property_id CHAR(36),
    title VARCHAR(255),
    value DECIMAL(15, 2),
    stage VARCHAR(50),
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    expected_close_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Messages Table (WhatsApp Integration)
CREATE TABLE messages (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    lead_id CHAR(36) NOT NULL,
    direction ENUM('inbound', 'outbound') NOT NULL,
    content TEXT,
    type ENUM('text', 'image', 'video', 'document', 'audio') DEFAULT 'text',
    provider ENUM('meta', 'evolution') DEFAULT 'meta',
    provider_msg_id VARCHAR(255),
    status ENUM('sent', 'delivered', 'read', 'failed') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- Finance Table
CREATE TABLE finance (
    id CHAR(36) PRIMARY KEY,
    tenant_id CHAR(36) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100),
    description TEXT,
    transaction_date DATE,
    deal_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (deal_id) REFERENCES deals(id) ON DELETE SET NULL
);
