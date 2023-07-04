//1 - Importacion de modulos: se importa el modulo 'fs' el cual me permite leer, escribir, crear y eliminar directorios a futuro.
const fs = require('fs'); // se asigna la funcion require ya que esta condiciona al resto del codigo a ejecutar de manera obligatoria el resto de la constante. 


//2 - Declaracion de 'Product Manager'

class ProductManager { //se declara la funcion ProductManager la cual contendra los metodos y funciones para administrar los productos.
  constructor(path) { //se le da el parametro 'path' con la ruta donde queremos almacenar los productos.
    this.path = path;
  }


  //3 - Metodos (addProduct, getProducts, getProductsByID, updateProduct, deleteProduct y saveProducts ):

  //addProduct (Agregar producto)

  addProduct(product) { //este metodo recibe un objeto 'product' como parametro que contiene los datos del nuevo producto a agregar.
    const products = this.getProducts(); //se crea la lista actual de productos llamando a otro metodo, getProducts().
    const newProduct = { //se crea un nuevo objeto que contendra las indicaciones a proporcionar.
      id: products.length + 1, // +1 = autoincrementable
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      code: product.code,
      stock: product.stock
    };
    products.push(newProduct); //asignadas las propiedades de cada indicacion, se agrega el nuevo producto AL FINAL de la lista de productos.
    this.saveProducts(products); //se guarda la lista en el meotodo saveProducts
    return newProduct; //devuelve el producto agregado
  }



  //getProducts (Encontrar producto)

  getProducts() { //este metodo lee el archivo designado en el constructor de arriba para obtener la lista de productos.
    try { //se utiliza el bloque try porque en caso de que ocurra algún error durante la lectura del archivo (por ejemplo, si el archivo no existe o no se tiene permiso para leerlo), se lanzará una excepción.
      const data = fs.readFileSync(this.path, 'utf-8'); // se utiliza fs.readFileSync para que lea el archivo de forma SINCRONICA!
      return JSON.parse(data); //este contenido leido se convierte en un objeto JS llamado 'JSON.parse
    } catch (error) { //en el caso de haber un error...
      return []; //... se devuelve un arreglo vacio.
    }
  }

  //getProductsById (Encontrar producto por ID)

  getProductById(id) { //este metodo recibe un parametro ID que representa la ID que buscará.
    const products = this.getProducts(); //obtenemos la lista de productos (arreglo) generada arriba
    return products.find((product) => product.id === id); // utilizamos el metodo .find para buscar el producto cuyo ID sea identico al especificado. 
    
  }

  //updateProduct (Actualizar Producto)

  updateProduct(id, updatedFields) { //recibimos 2 parametros: el del id a actualizar y 'updatedFields', un objeto que contiene los nuevos campos actualizados.
    const products = this.getProducts(); //obtenemos la lista de productos (arreglo)
    const index = products.findIndex((product) => product.id === id); //utilizamos el metodo findIndex para encontrar el indice del producto que coincida con la ID especifica
    if (index !== -1) { //Si se encuentra el producto, se crea un nuevo objeto 'updatedProduct' que combina el producto existente con los campos actualizados.
      const updatedProduct = { ...products[index], ...updatedFields, id }; 
      products[index] = updatedProduct; //se reemplaza el producto existente en la lista con el producto actualizado.
      this.saveProducts(products); //se guarda esta nueva lista de productos llamando al metodo saveProducts().
      return updatedProduct; //nos retorna el objeto actualizado
    }
    return null; // y en el caso de no encontrarlo devolvera 'null'.
  }

//deleteProduct (Eliminar Producto)

  deleteProduct(id) {
    const products = this.getProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) {
      const deletedProduct = products[index];
      products.splice(index, 1);
      this.saveProducts(products);
      return deletedProduct;
    }
    return null; //En el caso de no encontrarlo regresara 'null'.
  }
  


  //saveProducts (Guardar producto/s)

  saveProducts(products) { //recibimos la lista de productos del constructor.
    const data = JSON.stringify(products, null, 2); //convierte la lista de productos en una cadena JSON utilizando JSON.stringify() 
    fs.writeFileSync(this.path, data); //Utiliza fs.writeFileSync() para escribir la cadena JSON (products.json) en el archivo de forma síncrona.
  }

}



//---------------------------------//




// 4- Probemos el codigo!

const path = './products.json'; // Ruta del archivo donde se guardarán los productos
const productManager = new ProductManager(path); //Se crea una instancia de ProductManager pasando la ruta del archivo como argumento.



// Agregar un producto
const newProduct = { //Se define un nuevo objeto newProduct con los datos de un nuevo producto a agregar.
  title: 'Camiseta',
  description: 'Una camiseta de algodón',
  price: 19.99,
  thumbnail: 'ruta/imagen.jpg',
  code: 'CAM001',
  stock: 10
};

const addedProduct = productManager.addProduct(newProduct); //Se llama al método addProduct() de productManager pasando el objeto newProduct como argumento para agregar el producto.
console.log('Producto agregado:', addedProduct); //arroja a la consola el arreglo como 'Producto Agregado'.



// Obtener todos los productos
const allProducts = productManager.getProducts(); //Se llama al método getProducts() de productManager para obtener todos los productos.
console.log('Todos los productos:', allProducts); //arroja a la consola el arreglo como 'Todos los productos'.



// Obtener un producto por ID
const productId = 1; //Se define el ID de un producto existente en la variable productId.
const productById = productManager.getProductById(productId); //Se llama al método getProductById() de productManager pasando productId como argumento para obtener un producto específico.
console.log('Producto por ID:', productById); //arroja a la consola el arreglo como 'Producto por ID'.



// Actualizar un producto
const productIdToUpdate = 1; // Se define el ID de un producto existente en la variable productIdToUpdate.
const updatedFields = { //Se define un objeto updatedFields...
  title: 'Camiseta Modificada', //... con los campos actualizados del producto.
  price: 24.99 //... con los campos actualizados del producto.
};

const updatedProduct = productManager.updateProduct(productIdToUpdate, updatedFields); //Se llama al método updateProduct() de productManager pasando productIdToUpdate y updatedFields como argumentos para actualizar el producto.
console.log('Producto actualizado:', updatedProduct); //Se arroja a la consola como 'Producto actualizado'

module.exports = {
  ProductManager
};