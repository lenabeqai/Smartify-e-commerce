const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function initializeDatabase() {
  try {
    console.log('Connecting to SQL Server...');
    const pool = await sql.connect(dbConfig);

    const dbName = 'EcommerceDB_New';
    console.log(`Creating database '${dbName}'...`);
    await pool.request().query(`IF DB_ID('${dbName}') IS NULL CREATE DATABASE ${dbName}`);
    console.log(`Database '${dbName}' created or already exists.`);

    const poolWithDB = await sql.connect({ ...dbConfig, database: dbName });

    console.log('Creating tables...');
    await poolWithDB.request().query(`
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Users' AND xtype = 'U')
        BEGIN
            CREATE TABLE Users (
                UserID INT IDENTITY(1,1) PRIMARY KEY,
                Username NVARCHAR(100) NOT NULL,
                Email NVARCHAR(100) UNIQUE NOT NULL,
                PasswordHash NVARCHAR(255) NOT NULL,
                Role NVARCHAR(20) DEFAULT 'customer'
            );
        END;
      
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Categories' AND xtype = 'U')
        BEGIN
            CREATE TABLE Categories (
                CategoryID INT IDENTITY(1,1) PRIMARY KEY,
                Name NVARCHAR(100) NOT NULL
            );
        END;
      
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Products' AND xtype = 'U')
        BEGIN
            CREATE TABLE Products (
                ProductID INT IDENTITY(1,1) PRIMARY KEY,
                Name NVARCHAR(255) NOT NULL,
                Description NVARCHAR(MAX),
                Price DECIMAL(10, 2) NOT NULL,
                Stock INT DEFAULT 0,
                ImagePath NVARCHAR(255) Null,
                CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID)
            );
        END;
      
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'Orders' AND xtype = 'U')
        BEGIN
            CREATE TABLE Orders (
                OrderID INT IDENTITY(1,1) PRIMARY KEY,
                UserID INT FOREIGN KEY REFERENCES Users(UserID),
                TotalAmount DECIMAL(10, 2) NOT NULL,
                OrderDate DATETIME DEFAULT GETDATE(),
                OrderStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending'
            );
        END;
      
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name = 'OrderItems' AND xtype = 'U')
        BEGIN
            CREATE TABLE OrderItems (
                OrderItemID INT IDENTITY(1,1) PRIMARY KEY,
                OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
                ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
                Quantity INT NOT NULL,
                Price DECIMAL(10, 2) NOT NULL
            );
        END;
      `);
      

    console.log('Tables created succeslysful.');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    sql.close();
  }
}

module.exports = { initializeDatabase, sql, dbConfig };
