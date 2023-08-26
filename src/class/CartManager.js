import { promises as fs } from "fs";
const carritoPath = "./src/cart.json";
export default class CartManager {
    constructor() {
        this.initcarritoId();
    }
    async initcarritoId() {
        const carts = await this.getCartsFromFile();
        if (carts.length === 0) {
            this.cartCounter = 1;
        } else {
            const lastCart = carts[carts.length - 1];
            this.cartCounter = lastCart.id + 1;
        }
    }
    async createCart(products = []) {
        const cart = {
            id: this.initcarritoId,
            products: products,
        };
        await this.guardarCarrito(cart);
        this.cartCounter++;
        return cart;
    }
    async getCartById(carritoId) {
        const carts = await this.getCartsFromFile();
        return carts.find((cart) => parseInt(cart.id) === parseInt(carritoId));
    }
    async addProductToCart(carritoId, productId, quantity = 1) {
        const carts = await this.getCartsFromFile();
        const cartIndex = carts.findIndex(
            (cart) => parseInt(cart.id) === parseInt(carritoId)
        );
        if (cartIndex !== -1) {
            const productExists = carts[cartIndex].products.find(
                (item) => parseInt(item.id) === parseInt(productId)
            );
            if (productExists) {
                productExists.quantity += quantity;
            } else {
                carts[cartIndex].products.push({
                    id: productId,
                    quantity: quantity,
                });
            }
            await this.guardarCarritos(carts);
        }
    }
    async getCartsFromFile() {
        try {
            const data = await fs.readFile(carritoPath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
    async guardarCarrito(cart) {
        const carts = await this.getCartsFromFile();
        cart.id = this.cartCounter;
        this.cartCounter++;
        carts.push(cart);
        await this.guardarCarritos(carts);
    }
    async guardarCarritos(carts) {
        const data = JSON.stringify(carts, null, 2);
        await fs.writeFile(carritoPath, data);
    }
}