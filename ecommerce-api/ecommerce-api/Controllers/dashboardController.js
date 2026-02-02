const { sql, dbConfig } = require('../db');


exports.dashboard = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        //const result = await pool.request().query('SELECT * FROM Categories');
        //res.json(result.recordset);

            const productsResult = await pool.request().query('SELECT COUNT(*) AS totalProducts FROM Products');
            const categoriesResult = await pool.request().query('SELECT COUNT(*) AS totalCategories FROM Categories');
            const ordersResult = await pool.request().query('SELECT COUNT(*) AS totalOrders FROM Orders');
            const usersResult = await pool.request().query('SELECT COUNT(*) AS totalUsers FROM Users');
        
            const totalProducts = productsResult.recordset[0].totalProducts;
            const totalCategories = categoriesResult.recordset[0].totalCategories;
            const totalOrders = ordersResult.recordset[0].totalOrders;
            const totalUsers = usersResult.recordset[0].totalUsers;

            res.json({
              totalProducts,
              totalCategories,
              totalOrders,
              totalUsers,
            });
          } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({ error: 'Failed to fetch dashboard stats' });
          }
    
};


