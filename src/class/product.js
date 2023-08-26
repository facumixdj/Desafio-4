export default class Product{
    constructor(title, description, size, price, code, stock, thumbnail) {
        this.title = title
        this.description = description
        this.size = size //talle
        this.price = price
        this.code = code
        this.stock = stock
        this.thumbnail = thumbnail
        this.status = true
        this.id = Product.incrementarId()
    }
    static incrementarId() {
        if (this.idIncrement) {
            this.idIncrement++
        } else {
            this.idIncrement = 1
        }
        return this.idIncrement
    }
}
