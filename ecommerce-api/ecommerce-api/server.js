const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const { sql, dbConfig } = require('./db');
const path = require('path');


dotenv.config();

const { initializeDatabase } = require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')

const allowedOrigins = ['http://localhost:4200', 'http://localhost:58443'];

const app = express();
app.use(express.json());
app.use(cors({
    origin: function(origin, callback){
    // allow requests with no origin (like Postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
    credentials: true // If cookies or credentials are required
  }));

  app.use(bodyParser.json());


initializeDatabase();



// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// API to upload and save product image
/*app.post('/api/products/upload', upload.single('image'), async (req, res) => {
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
});
*/



// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
