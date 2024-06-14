class ShoppingCart {
    constructor() {
        this.loadCart();
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    addToCart(product) {
        const productIndex = this.cart.findIndex(item => item.id === product.id);
        if (productIndex > -1) {
            this.cart[productIndex].quantity += product.quantity;
        } else {
            this.cart.push(product);
        }
        this.saveCart();
    }

    getCart() {
        return this.cart;
    }
}

const cartInstance = new ShoppingCart();
export default cartInstance;