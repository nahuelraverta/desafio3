// Importamos el módulo 'express' que instalamos previamente
const express = require('express');
// Importamos la clase ProductManager desde el archivo 'ProductManager.js'
const { ProductManager } = require('./ProductManager');

// Creamos una instancia de la aplicación Express
const app = express();
// Definimos el puerto en el que se ejecutará nuestro servidor
const port = 8080;

// Creamos una instancia de la clase ProductManager, pasando como argumento la ruta del archivo de productos
const productManager = new ProductManager('./products.json');

// Definimos un endpoint para la ruta '/products'
app.get('/products', async (req, res) => {
  try {
    // Obtenemos el valor del parámetro de consulta 'limit'
    const limit = req.query.limit;
    // Obtenemos la lista de productos utilizando el método 'getProducts' del objeto 'productManager'
    const products = await productManager.getProducts();
    if (limit) {
      // Si se especifica un límite, respondemos con los primeros 'limit' productos
      res.json(products.slice(0, limit));
    } else {
      // Si no se especifica un límite, respondemos con todos los productos
      res.json(products);
    }
  } catch (error) {
    // Si ocurre un error, respondemos con un código de estado 500 y un mensaje de error
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Definimos un endpoint para la ruta '/products/:pid'
app.get('/products/:pid', async (req, res) => {
  try {
    // Obtenemos el valor del parámetro de ruta 'pid' que representa el ID del producto
    const productId = parseInt(req.params.pid);
    // Obtenemos el producto correspondiente al ID utilizando el método 'getProductById' del objeto 'productManager'
    const product = await productManager.getProductById(productId);
    if (product) {
      // Si se encuentra el producto, lo enviamos como respuesta
      res.json(product);
    } else {
      // Si no se encuentra el producto, respondemos con un código de estado 404 y un mensaje de error
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    // Si ocurre un error, respondemos con un código de estado 500 y un mensaje de error
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Iniciamos el servidor y lo configuramos para escuchar en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor activo en el puerto ${port}`);
});
