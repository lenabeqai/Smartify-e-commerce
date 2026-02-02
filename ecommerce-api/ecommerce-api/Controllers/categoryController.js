const { sql, dbConfig } = require('../db');

exports.createCategory = async (req, res) => {
    const { Name } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Name', sql.VarChar, Name)
            .query(`INSERT INTO Categories (Name) VALUES (@Name)`);
        res.status(201).json({ message: 'Category created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Categories');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.editCategory = async (req, res) => {
    const { id } = req.params; // category ID from the route parameter
    const { Name } = req.body; // Updated category details
  
    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the category exists
      const category = await pool.request()
        .input('CategoryID', sql.Int, id)
        .query('SELECT * FROM Categories WHERE CategoryID = @CategoryID');
  
      if (category.recordset.length === 0) {
        return res.status(404).json({ message: 'category not found.' });
      }
  
      // Update the category
      await pool.request()
        .input('CategoryID', sql.Int, id)
        .input('Name', sql.VarChar, Name)
        .query(`
          UPDATE Categories
          SET Name = @Name
             WHERE  CategoryID = @CategoryID
        `);
  
      res.json({ message: 'category updated successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  exports.deleteCategory = async (req, res) => {
    const { id } = req.params; // category ID from the route parameter
  
    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the category exists
      const category = await pool.request()
        .input('categoryID', sql.Int, id)
        .query('SELECT * FROM Categories WHERE categoryID = @categoryID');
  
      if (category.recordset.length === 0) {
        return res.status(404).json({ message: 'category not found.' });
      }
  
      // Delete the Category
      await pool.request()
        .input('categoryID', sql.Int, id)
        .query('DELETE FROM Categories WHERE categoryID = @categoryID');
  
      res.json({ message: 'Category deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  
