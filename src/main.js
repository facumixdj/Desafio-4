import express from "express";
import productosRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/cart.routes.js";
import { __dirname } from "./path.js";
import path from "path";
import multer from "multer";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import ProductManager from "./class/ProductManager.js";

const PORT = 8080;

const app = express();
const serverExpress = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
//Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine()); 
app.set("view engine", "handlebars"); 
app.set("views", path.resolve(__dirname, "./views"));
app.use("/static", express.static(path.join(__dirname, "/public")));
// Socket.io
const io = new Server(serverExpress);
io.on("connection", (socket) => {
  console.log("Servidor Socket.io Conectado");
  socket.on("nuevoProductoRealTime", (product) => {
    productManager
      .addProduct(product)
      .then((newProduct) => {
        io.emit("productoAgregadoRealTime", newProduct);
      })
      .catch((error) => {
        console.error("Error al agregar el producto en tiempo real:", error);
      });
  });
  socket.on("solicitarProductos", async () => {
    try {
      const products = await productManager.getProducts();
      socket.emit("productosMostrados", products);
    } catch (error) {
      console.error("Error al obtener la lista de productos:", error);
    }
  });
});
//Rutas
app.use("/api/products", productosRouter);
app.use("/api/carts", cartsRouter);
const productsPath = "./src/productos.json";
const productManager = new ProductManager(productsPath);
// Ruta para la vista home.handlebars
app.get("/static", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", {
    css: "style.css",
    title: "Home",
    js: "script.js",
    products: products, // Pasa los productos a la vista
  });
});

app.get("/static/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "form.css",
    js: "realTimeProducts.js",
    title: "Productos",
  });
});

