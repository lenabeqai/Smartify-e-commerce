const { sql, dbConfig } = require('../db');



// API to upload and save product image

exports.createProduct = async (req, res) => {
  const { productName, Description, Price,Stock, CategoryID } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  //const productImages = req.files.map(file => file.filename);


  if (!productName || !CategoryID || !Price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const pool = await sql.connect(dbConfig);

  try {
    
    await pool.request()
    .input('Name', sql.VarChar, productName)
    .input('Description', sql.Text, Description)
    .input('CategoryID', sql.Int, CategoryID)
    .input('Price', sql.Float, Price)
    .input('Stock', sql.Int, Stock)

    .input('ImagePath', sql.VarChar, imagePath)
    .query(`
      INSERT INTO Products (Name, Description, Price, Stock, CategoryID, ImagePath)
      VALUES (@Name, @Description, @Price, @Stock, @CategoryID, @ImagePath)
    `);

    res.status(200).json({ message: 'Product uploaded successfully' });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ error: 'Failed to save product' });
  }
};


exports.getAllProducts = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query(`SELECT 
    Products.ProductID,
    Products.Price,
    Products.Stock,
    Products.Description,
    Products.ImagePath,
    Products.Name as productName,
    Categories.Name as categoryName,
    Categories.CategoryID
FROM 
    Products
INNER JOIN 
    Categories
ON 
    Products.CategoryID = Categories.CategoryID;`);

    result.recordset.forEach(element => {

      if (element.ImagePath != null){
      element.ImagePath = "http://localhost:5000"+element.ImagePath
      }
    });

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get Product by ID
exports.getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);

    // Query to get the product by ID
    const result = await pool
      .request()
      .input('ProductId', sql.Int, productId)
      .query('SELECT * FROM Products WHERE ProductID = @ProductId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

      
      //result.recordset[0].ImagePath = "http://localhost:5000"+result.recordset[0].ImagePath
      result.recordset[0].ImagePath = "https://phoneshop-e-commerce-1.onrender.com/"+result.recordset[0].ImagePath
      
      

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.editProduct = async (req, res) => {
    const { id } = req.params; // Product ID from the route parameter
    const { productName, Description, Price, Stock, CategoryID } = req.body; // Updated product details
  
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the product exists
      const product = await pool.request()
        .input('ProductID', sql.Int, id)
        .query('SELECT * FROM Products WHERE ProductID = @ProductID');
  
      if (product.recordset.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      // Update the product
      await pool.request()
        .input('ProductID', sql.Int, id)
        .input('Name', sql.VarChar, productName)
        .input('Description', sql.VarChar, Description)
        .input('Price', sql.Decimal(10, 2), Price)
        .input('Stock', sql.Int, Stock)
        .input('CategoryID', sql.Int, CategoryID)
        .input('ImagePath', sql.VarChar, imagePath)
        .query(`
          UPDATE Products
          SET Name = @Name,
              Description = @Description,
              Price = @Price,
              Stock = @Stock,
              CategoryID = @CategoryID,
              ImagePath = @ImagePath
          WHERE ProductID = @ProductID
        `);
  
      res.json({ message: 'Product updated successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.deleteProduct = async (req, res) => {
    const { id } = req.params; // Product ID from the route parameter
  
    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the product exists
      const product = await pool.request()
        .input('ProductID', sql.Int, id)
        .query('SELECT * FROM Products WHERE ProductID = @ProductID');
  
      if (product.recordset.length === 0) {
        return res.status(404).json({ message: 'Product not found.' });
      }
  
      // Delete the product
      await pool.request()
        .input('ProductID', sql.Int, id)
        .query('DELETE FROM Products WHERE ProductID = @ProductID');
  
      res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
// Get Product by categoryID
exports.getProductBycategoryId = async (req, res) => {

  const categoryId = req.params.id;

 try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
        .input('CategoryID', sql.Int, categoryId)
        
        .query(`SELECT 
    Products.ProductID,
    Products.Price,
    Products.Stock,
    Products.Description,
    Products.ImagePath,
    Products.Name as productName,
    Categories.Name as categoryName,
    Categories.CategoryID
FROM 
    Products
INNER JOIN 
    Categories
ON 
    Products.CategoryID = Categories.CategoryID where Products.CategoryID = @CategoryID`);

    result.recordset.forEach(element => {

      if (element.ImagePath != null){
      element.ImagePath = "http://localhost:5000"+element.ImagePath
      }
    });

        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};