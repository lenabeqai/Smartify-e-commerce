const { sql, dbConfig } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


exports.getAllUsers = async (req, res) => {
  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().query('SELECT * FROM Users');
      res.json(result.recordset);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
};


exports.registerUser = async (req, res) => {
    const { Username, Email, Password, Role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(Password, salt);

        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('Username', sql.VarChar, Username)
            .input('Email', sql.VarChar, Email)
            .input('PasswordHash', sql.VarChar, PasswordHash)
            .input('Role', sql.VarChar, Role)
            .query(`INSERT INTO Users (Username, Email, PasswordHash, Role) VALUES (@Username, @Email, @PasswordHash, @Role)`);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('Email', sql.VarChar, Email)
            .query(`SELECT * FROM Users WHERE Email = @Email`);
        
        const user = result.recordset[0];
        if (!user) return res.status(400).json({ message: 'Invalid email or password.' });

  
        const validPassword = await bcrypt.compare(Password, user.PasswordHash);
        if (!validPassword) return res.status(400).json({ message: 'Invalid email or password.' });

        if(user.isActive == 0) return res.status(400).json({ message: 'Your account is InActive.' });

        
        const token = jwt.sign({ UserID: user.UserID, Role: user.Role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token ,user});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.editUser = async (req, res) => {
    const { id } = req.params; // User ID from the route parameter
    const { Username, Email, Password, Role, isActive } = req.body; // Updated user details
  
    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the user exists
      const user = await pool.request()
        .input('UserID', sql.Int, id)
        .query('SELECT * FROM Users WHERE UserID = @UserID');
  
      if (user.recordset.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // If password is being updated, hash it
      let hashedPassword = null;
      if (Password) {
       // const bcrypt = require('bcrypt');
        hashedPassword = await bcrypt.hash(Password, 10);
      }
  
      // Update the user
      await pool.request()
        .input('UserID', sql.Int, id)
        .input('Username', sql.VarChar, Username)
        .input('Email', sql.VarChar, Email)
        .input('PasswordHash', sql.VarChar, hashedPassword || user.recordset[0].PasswordHash)
        .input('Role', sql.VarChar, Role || user.recordset[0].Role)
        .input('isActive', sql.Bit, isActive)
        .query(`
          UPDATE Users
          SET Username = @Username,
              Email = @Email,
              PasswordHash = @PasswordHash,
              Role = @Role,
              isActive = @isActive

          WHERE UserID = @UserID
        `);
  
      res.json({ message: 'User updated successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.deleteUser = async (req, res) => {
    const { id } = req.params; // User ID from the route parameter
  
    try {
      const pool = await sql.connect(dbConfig);
  
      // Check if the user exists
      const user = await pool.request()
        .input('UserID', sql.Int, id)
        .query('SELECT * FROM Users WHERE UserID = @UserID');
  
      if (user.recordset.length === 0) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Delete the user
      await pool.request()
        .input('UserID', sql.Int, id)
        .query('DELETE FROM Users WHERE UserID = @UserID');
  
      res.json({ message: 'User deleted successfully.' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  