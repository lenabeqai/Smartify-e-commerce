const { sql, dbConfig } = require('../db');

exports.createOrder = async (req, res) => {
    const { UserID,OrderStatus, orderItems } = req.body;

    if (!UserID || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const TotalAmount = orderItems.reduce((total, item) => total + item.Price * item.Quantity, 0);


    try {
        
        
    const pool = await sql.connect(dbConfig);
    // Begin transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

        const orderResult = await transaction.request()
            .input('UserID', sql.Int, UserID)
            .input('TotalAmount', sql.Decimal,TotalAmount)
            .input('OrderStatus', sql.VarChar,OrderStatus)

            .query(`INSERT INTO Orders (UserID,OrderDate,TotalAmount, OrderStatus) OUTPUT INSERTED.OrderID VALUES (@UserID,GETDATE(),@TotalAmount,@OrderStatus)`);

            if (!orderResult.recordset) {
                 throw new Error("Failed to create order. No ID returned.");
}

            const OrderID = orderResult.recordset[0].OrderID;

            // Insert order orderItems
            for (const item of orderItems) {
              await transaction.request()
                .input("OrderID", sql.Int, OrderID)
                .input("ProductID", sql.Int, item.ProductID)
                .input("Quantity", sql.Int, item.Quantity)
                .input("Price", sql.Float, item.Price)
                .query(`
                  INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
                  VALUES (@OrderID, @ProductID, @Quantity, @Price)
                `);
            }

              // Commit transaction
      await transaction.commit();

        res.status(201).json({ message: 'Order created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllOrders = async (req, res) => {

    try {
      // Connect to the database
      const pool = await sql.connect(dbConfig);
  
      // Query to get orders with their order orderItems
      const result = await pool.request().query(`
        SELECT 
          o.OrderID AS OrderID,
          o.UserID,
          u.username AS userName,
          o.OrderDate,
          o.TotalAmount,
          o.OrderStatus,
          oi.OrderItemID AS OrderItemID,
          oi.ProductID,
          p.Name as productName,
          oi.Quantity,
          oi.Price
        FROM Orders o
        LEFT JOIN Users u ON o.UserID = u.UserID
        LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
        LEFT JOIN Products p ON oi.ProductID = p.ProductID
        ORDER BY o.OrderDate DESC
      `);

          // Initialize accumulator array for orders
    const orders = [];
    
      result.recordset.forEach(row => {
        // Check if the order already exists in the accumulator
        let order = orders.find(o => o.OrderID === row.OrderID);
  
        if (!order) {
            order = {
              OrderID: row.OrderID,
              OrderStatus:row.OrderStatus,
              UserID: row.UserID,
              userName: row.userName,
              OrderDate: row.OrderDate,
              TotalAmount: row.TotalAmount,
              orderItems: [], // Initialize an empty array for order orderItems
            };
    
            // Add the new order object to the accumulator
            orders.push(order);
          }

        const orderItem = row.OrderItemID
        ? {
          OrderItemID: row.OrderItemID,
          ProductID: row.ProductID,
          productName:row.productName,
          Quantity: row.Quantity,
          Price: row.Price,
        }: null;
  
            // Push orderItem if it exists
            if (orderItem) {
              order.orderItems.push(orderItem);
            }
      });
  
      // Send response
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, error: "Failed to fetch orders." });
    }
  };
   
  // Update Order API
exports.updateOrder = async (req, res) => {
  const OrderID = req.params.id;
  const { UserID, OrderStatus, orderItems } = req.body;

  const TotalAmount = orderItems.reduce((total, item) => total + item.Price * item.Quantity, 0);


  try {
    // Begin transaction
    const pool = await sql.connect(dbConfig);
    // Begin transaction
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();

      // Update the Orders table
      const updateOrderQuery = `
        UPDATE Orders
        SET UserID = @UserID, TotalAmount = @TotalAmount, OrderDate = GETDATE(), OrderStatus = @OrderStatus
        WHERE OrderID = @OrderID
      `;
      await transaction.request()
        .input('OrderID', OrderID)
        .input('UserID', UserID)
        .input('TotalAmount', TotalAmount)
        .input('OrderStatus', OrderStatus)
        .query(updateOrderQuery);

      // Delete existing order orderItems for this order
      const deleteOrderorderItemsQuery = `DELETE FROM OrderItems WHERE OrderID = @OrderID`;
      await transaction.request().input('OrderID', OrderID).query(deleteOrderorderItemsQuery);

      // Insert updated order orderItems
      const insertOrderItemQuery = `
        INSERT INTO OrderItems (OrderID, ProductID, Quantity, Price)
        VALUES (@OrderID, @ProductID, @Quantity, @Price)
      `;
      for (const item of orderItems) {
        await transaction.request()
          .input('OrderID', OrderID)
          .input('ProductID', item.ProductID)
          .input('Quantity', item.Quantity)
          .input('Price', item.Price)
          .query(insertOrderItemQuery);
      }

      // Commit transaction
      await transaction.commit();

      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    } finally {
      transaction.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Delete Order API
exports.deleteOrder = async (req, res) => {
  const OrderID = req.params.id;

  try {
    // Begin transaction
    const pool = await sql.connect(dbConfig);
    // Begin transaction
    const transaction = new sql.Transaction(pool);
    try {
      await transaction.begin();

      // Delete from OrderItems table
      const deleteOrderItemsQuery = `DELETE FROM OrderItems WHERE OrderID = @OrderID`;
      await transaction.request().input('OrderID', OrderID).query(deleteOrderItemsQuery);

      // Delete from Orders table
      const deleteOrderQuery = `DELETE FROM Orders WHERE OrderID = @OrderID`;
      const result = await transaction.request().input('OrderID', OrderID).query(deleteOrderQuery);

      // Commit transaction
      await transaction.commit();

      // Check if the order was successfully deleted
      if (result.rowsAffected[0] > 0) {
        res.status(200).json({ message: 'Order deleted successfully' });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting order:', error);
      res.status(500).json({ error: 'Failed to delete order' });
    } finally {
      transaction.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.getOrderById = async (req, res) => {
  const OrderID = req.params.id;

  try {
    const connection = await sql.connect(dbConfig);

    // Query to fetch order details
    const orderQuery = `
      SELECT 
        o.OrderID, 
        o.UserID, 
        u.username AS userName,
        o.OrderDate, 
        o.TotalAmount, 
        o.OrderStatus,
        oi.OrderItemID, 
        oi.ProductID, 
        p.Name as productName,
        oi.Quantity, 
        oi.Price
      FROM Orders o
      LEFT JOIN Users u ON o.UserID = u.UserID
      LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
      LEFT JOIN Products p ON oi.ProductID = p.ProductID
      WHERE o.OrderID = @OrderID
    `;

    const result = await connection
      .request()
      .input('OrderID', OrderID)
      .query(orderQuery);

    connection.release();

    if (result.recordset.length > 0) {
      // Organize data
      const order = {
        OrderID: result.recordset[0].OrderID,
        UserID: result.recordset[0].UserID,
        userName:result.recordset[0].userName,
        OrderDate: result.recordset[0].OrderDate,
        TotalAmount: result.recordset[0].TotalAmount,
        OrderStatus:result.recordset[0].OrderStatus,
        items: result.recordset.map((row) => ({
          OrderItemID: row.OrderItemID,
          ProductID: row.ProductID,
          productName:row.productName,
          Quantity: row.Quantity,
          Price: row.Price,
        })),
      };

      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};