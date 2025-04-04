const socket = io();

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    event.preventDefault();

    const productId = btn.dataset.productId;
    const cartId = btn.dataset.cartId;

    try {
      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "POST",
      });

      if (res.ok) {
        const updatedCart = await res.json();
        socket.emit("cart-updated", updatedCart);
        updateCartSidebar(updatedCart); //
      } else {
        console.error("❌ Error al agregar producto");
      }
    } catch (err) {
      console.error("❌ Error en el fetch:", err);
    }
  });
});

function updateCartSidebar(cart) {
  const list = document.getElementById("cart-list");
  const emptyMsg = document.getElementById("cart-empty-msg");
  const summary = document.getElementById("cart-summary");
  const totalDisplay = document.getElementById("cart-total");

  list.innerHTML = "";

  if (!cart.products || cart.products.length === 0) {
    emptyMsg.style.display = "block";
    summary.classList.add("hidden");
    return;
  }

  emptyMsg.style.display = "none";
  summary.classList.remove("hidden");

  let total = 0;

  cart.products.forEach((item) => {
    const price = item.product.price || 0;
    const subtotal = price * item.quantity;
    total += subtotal;

    const li = document.createElement("li");
    li.classList.add("border-b", "border-gray-700", "pb-2");

    li.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium text-white">${item.product.title}</p>
          <p class="text-xs text-gray-400">x${item.quantity} • $${price.toFixed(2)}</p>
          <p class="text-xs text-gray-400">Subtotal: $${subtotal.toFixed(2)}</p>
        </div>
        <button
          class="remove-from-cart text-red-400 hover:text-red-500 text-sm"
          data-product-id="${item.product._id}"
          data-cart-id="${cart._id}"
          title="Eliminar"
        >
          ❌
        </button>
      </div>
    `;

    list.appendChild(li);
  });

  totalDisplay.textContent = `$${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const cartId = document.querySelector("[data-cart-id]")?.dataset.cartId;

  if (cartId) {
    try {
      const res = await fetch(`/api/carts/${cartId}`);
      if (res.ok) {
        const cart = await res.json();
        updateCartSidebar(cart);
      }
    } catch (err) {
      console.error("❌ Error al cargar el carrito:", err);
    }
  }
});

document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("remove-from-cart")) {
    const productId = e.target.dataset.productId;
    const cartId = e.target.dataset.cartId;

    try {
      const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        console.log("🗑 Producto eliminado del carrito");
        window.location.reload();
      } else {
        console.error("❌ No se pudo eliminar el producto del carrito");
      }
    } catch (err) {
      console.error("❌ Error en el fetch DELETE:", err);
    }
  }
});


function updateFullCartView(products) {
  const listContainer = document.querySelector(".lg\\:col-span-2");
  const summaryContainer = document.querySelector("aside .text-white.space-y-2");
  const totalContainer = document.querySelector(".border-t .text-green-400");

  if (!listContainer || !summaryContainer || !totalContainer) return;

  listContainer.innerHTML = "";
  summaryContainer.innerHTML = "";

  let total = 0;

  if (products.length === 0) {
    document.querySelector(".grid").innerHTML = `
      <p class="text-center text-gray-400 text-lg w-full">Tu carrito está vacío 😢</p>
    `;
    return;
  }

  products.forEach((item) => {
    const { product, quantity } = item;
    const subtotal = product.price * quantity;
    total += subtotal;

    const productHTML = `
      <div class="bg-neutral-800 rounded-xl p-4 shadow flex flex-col sm:flex-row gap-4 items-center">
        <img src="${product.thumbnails[0]}" alt="${product.title}" class="w-32 h-32 object-contain bg-white rounded-lg" />
        <div class="flex-grow text-white space-y-1">
          <h2 class="text-lg font-bold text-orange-400">${product.title}</h2>
          <p class="text-sm text-gray-400">Categoría: ${product.category}</p>
          <p class="text-sm text-gray-400">Precio: <span class="text-green-400 font-semibold">$ ${product.price.toFixed(2)}</span></p>
          <p class="text-sm text-gray-400">Cantidad: x${quantity}</p>
          <p class="text-sm text-gray-400">Subtotal: <span class="text-white font-medium">$ ${subtotal.toFixed(2)}</span></p>
        </div>
        <button class="remove-from-cart text-red-400 hover:text-red-500 text-sm"
                data-product-id="${product._id}"
                data-cart-id="${document.querySelector('[data-cart-id]').dataset.cartId}">
          Eliminar
        </button>
      </div>
    `;

    listContainer.insertAdjacentHTML("beforeend", productHTML);

    const summaryHTML = `
      <div class="flex justify-between text-sm">
        <span>${product.title}</span>
        <span>$ ${subtotal.toFixed(2)}</span>
      </div>
    `;

    summaryContainer.insertAdjacentHTML("beforeend", summaryHTML);
  });

  totalContainer.textContent = `$ ${total.toFixed(2)}`;
}

