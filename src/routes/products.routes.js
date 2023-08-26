import { Router } from "express";
import ProductManager from "../class/ProductManager.js"
const productsRouter = Router();
const pManager = new ProductManager();
productsRouter.get("/", async (req, res) => {
    const { price, stock, limit } = req.query;
    const allProducts = await pManager.getProducts();
    let filtroVariosProductos = allProducts;
    if (price) {
        filtroVariosProductos = filtroVariosProductos.filter(
            (prod) => parseFloat(prod.price) === parseFloat(price)
        );
    }
    if (stock) {
        filtroVariosProductos = filtroVariosProductos.filter(
            (prod) => parseFloat(prod.stock) === parseInt(stock)
        );
    }
    if (limit && !isNaN(limit) && parseInt(limit) > 0) {
        const limiteProductos = filtroVariosProductos.slice(0, parseInt(limit));
        res.send(limiteProductos);
    } else {
        res.send(filtroVariosProductos);
    }
});
productsRouter.get("/:id", async (req, res) => {
    console.log(req.params.id);
    const allProducts = await pManager.getProducts();
    const filtroProducts = allProducts.find(
        (prod) => prod.id === parseInt(req.params.id)
    );
    if (filtroProducts) {
        res.status(200).send(filtroProducts);
    } else {
        res.status(400).send("Producto no existe en Stock");
    }
});
productsRouter.post("/", async (req, res) => {
    const producto = await pManager.addProduct(req.body);
    if (producto) {
        res.status(200).send("Producto agregado");
    } else {
        res.status(400).send("El codigo del producto ya existe");
    }
});
productsRouter.put("/:id", async (req, res) => {
    const productoId = parseInt(req.params.id);
    const actualizarCampos = req.body;
    const actualizarProducto = await pManager.updateProduct(
        productoId,
        actualizarCampos
    );
    if (actualizarProducto) {
        res.status(200).send(actualizarProducto);
    } else {
        res.status(400).send("Producto no encontrado");
    }
});
productsRouter.delete("/:id", async (req, res) => {
    const productoId = parseInt(req.params.id);
    const borrarProducto = await pManager.deleteProduct(productoId);
    if (borrarProducto) {
        res.status(200).send("Producto eliminado");
    } else {
        res.status(400).send("Producto no encontrado");
    }
});
export default productsRouter;