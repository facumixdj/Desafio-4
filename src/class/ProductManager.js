import { promises as fs } from "fs";

const path = "./src/products.json";

export default class ProductManager {
    constructor(path) {
        this.path = path;
        this.initProductId();
    }

    async initProductId() {
        const data = JSON.parse(await fs.readFile(path, "utf-8"));
        if (data.length > 0) {
            const lastProduct = data[data.length - 1];
            this.productId = lastProduct.id + 1;
        } else {
            this.productId = 1;
        }
    }

    async addProduct(product) {
        //valido que los campos no esten vacios
        if (
            !product.title ||
            !product.description ||
            !product.size ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock === ""
        ) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        const prods = JSON.parse(await fs.readFile(path, "utf-8"))

        const foundProduct = prods.find((prod) => prod.id === product.id)

        if (foundProduct) {
            console.log("El producto ya existe");
        } else {
            const productJson = JSON.stringify(product)
            const parsearProduct = JSON.parse(productJson)
            if (parsearProduct.id === null || parsearProduct.id === undefined) {
                parsearProduct.id = this.productId++
            }
            parsearProduct.status = true
            prods.push(parsearProduct);
            await fs.writeFile(path, JSON.stringify(prods))
        }
    }

    async getProducts() {
        const data = JSON.parse(await fs.readFile(path, "utf-8"));
        return data;
    }

    async getProductById(productId) {
        const data = JSON.parse(await fs.readFile(path, "utf-8"));
        const foundProduct = data.find((product) => product.id === productId);

        if (!foundProduct) {
            console.log("Error: Product Not Found");
            return null;
        }

        console.log(foundProduct);
        return foundProduct;
    }

    async updateProduct(productId, updatedFields) {
        const prods = JSON.parse(await fs.readFile(path, "utf-8"));
        const indice = prods.findIndex((prod) => prod.id === productId);

        if (indice !== -1) {
            const updatedProduct = { ...prods[indice], ...updatedFields };
            prods[indice] = updatedProduct;
            await fs.writeFile(path, JSON.stringify(prods));
            return updatedProduct;
        } else {
            console.log("Producto no encontrado");
            return null;
        }
    }

    async deleteProduct(productId) {
        const data = JSON.parse(await fs.readFile(path, "utf-8"));
        const filteredProducts = data.filter((product) => product.id !== productId);

        if (data.length === filteredProducts.length) {
            console.log("Error: Product Not Found");
            return null;
        }

        await fs.writeFile(path, JSON.stringify(filteredProducts));
        return filteredProducts;
    }
}