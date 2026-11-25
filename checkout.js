
const orderItems = JSON.parse(
    localStorage.getItem("nova-checkout") || "[]"
);

const productContainer =
    document.getElementById("checkout-products");

const totalElement =
    document.getElementById("checkout-total");

function formatPrice(price) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
    }).format(price);
}

function displayOrder() {

    if (orderItems.length === 0) {
        productContainer.innerHTML =
            "<p>Your cart is empty. <a href='index.html'>Return to store</a></p>";

        totalElement.textContent = formatPrice(0);
        document.querySelector(".place-order-button").disabled = true;
        return;
    }

    let total = 0;

    productContainer.innerHTML = orderItems.map(item => {

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        return `
            <div class="checkout-product">

                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h3>${item.name}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <strong>${formatPrice(itemTotal)}</strong>
                </div>

            </div>
        `;

    }).join("");

    totalElement.textContent = formatPrice(total);
}

document.getElementById("delivery-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    if (!this.reportValidity()) return;

    alert(
        "Thank you for shopping with Nova Store! " +
        "This is a demo order. No payment has been collected."
    );

    localStorage.removeItem("nova-cart");
    localStorage.removeItem("nova-checkout");

    window.location.href = "index.html";

});

displayOrder();
