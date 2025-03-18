const socket = io();

const productList = document.getElementById('productList');

productList.addEventListener('click', (event) => {
    if (event.target && event.target.id === 'delete-button') {
        const productId = event.target.getAttribute('data-id');
        eliminarProducto(productId);
    }
});

/* Actualizar Productos */
socket.on("actualizarProductos", (productos) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; 

    productos.forEach((producto) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("flex", "justify-between", "items-center", "bg-gray-700", "p-4", "rounded-lg", "space-y-4"); 
    
        const productContentDiv = document.createElement("div");
        productContentDiv.classList.add("flex", "items-center", "space-x-4");  
    
        const img = document.createElement("img");
        img.src = producto.thumbnails[0];
        img.alt = producto.title;
        img.classList.add("w-20", "h-20", "object-cover", "rounded-md");
    
        const productInfo = document.createElement("div");
        productInfo.classList.add("text-white");
    
        const title = document.createElement("p");
        title.classList.add("font-semibold", "text-lg");
        title.innerText = producto.title;
    
        const price = document.createElement("p");
        price.classList.add("text-sm", "text-gray-400");
        price.innerText = `$${producto.price}`;
    
        productInfo.appendChild(title);
        productInfo.appendChild(price);
    
        productContentDiv.appendChild(img);
        productContentDiv.appendChild(productInfo);
    
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("bg-red-600", "hover:bg-red-700", "text-white", "py-2", "px-4", "rounded-md");
        deleteBtn.setAttribute("data-id", producto.id);
        deleteBtn.innerText = "Eliminar";
        deleteBtn.addEventListener("click", () => eliminarProducto(producto.id));
    
        productDiv.appendChild(productContentDiv);
        productDiv.appendChild(deleteBtn); 
    
        productList.appendChild(productDiv);
    });
});

/* Agregar Producto */
function agregarProducto(event) {
    event.preventDefault();

    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: parseFloat(document.getElementById("price").value),
        status: document.getElementById("status").checked,
        stock: parseInt(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        thumbnails: [document.getElementById("thumbnails").value]
    };

    if (validateProduct(producto)) {
        socket.emit("nuevoProducto", producto);
    }
}

/* Validar Producto */
function validateProduct(producto) {
    if (!producto.title || !producto.description || !producto.code || !producto.price || !producto.stock || !producto.category || !producto.thumbnails) {
        alert("Todos los campos son obligatorios.");
        return false;
    }
    return true;
}

/* Eliminar Producto */
function eliminarProducto(id) {
    console.log(id);
    socket.emit("eliminarProducto", id);
}

document.getElementById("productForm").addEventListener("submit", agregarProducto);
