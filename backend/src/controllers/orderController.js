const Order = require('../models/Order');

// Obtener todas las órdenes
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

// Obtener órdenes por ID de usuario
exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.getByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las órdenes del usuario' });
  }
};

// Obtener una orden por ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener orden:', error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

// Crear una nueva orden
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validar datos mínimos requeridos
    if (!orderData.userId || !orderData.items || !orderData.totalPrice || !orderData.shippingDetails) {
      return res.status(400).json({ error: 'Faltan datos requeridos para crear la orden' });
    }
    
    // Asegurar que el estado inicial sea 'pendiente'
    orderData.status = 'pendiente';
    
    // Añadir fecha de creación si no existe
    if (!orderData.createdAt) {
      orderData.createdAt = new Date();
    }
    
    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// Actualizar una orden
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = req.body;
    
    const updatedOrder = await Order.update(orderId, orderData);
    
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
};

// Actualizar el estado de una orden
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'El estado es requerido' });
    }
    
    const updatedOrder = await Order.updateStatus(orderId, status);
    
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error al actualizar estado de la orden:', error);
    res.status(500).json({ error: 'Error al actualizar el estado de la orden' });
  }
};

// Eliminar una orden
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const result = await Order.delete(orderId);
    
    if (!result) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    
    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
};