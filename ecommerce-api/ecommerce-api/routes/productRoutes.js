const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const auth = require('../middleware/auth');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage });

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.put('/:id', upload.single("image"),productController.editProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/create',upload.single("image"),productController.createProduct);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getProductBycategoryId);

module.exports = router;
