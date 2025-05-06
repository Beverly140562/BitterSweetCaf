function updateDisplayQty(spanId, delta) {
  const span = document.getElementById(spanId);
  let qty = parseInt(span.innerText);
  qty += delta;
  if (qty < 1) qty = 1;
  span.innerText = qty;
}

function addToCart(button) {
  const name = button.getAttribute("data-name");
  const category = button.getAttribute("data-category");
  const price = button.getAttribute("data-price");
  const qtyId = button.getAttribute("data-qty-id");


  const qty = parseInt(document.getElementById(qtyId).innerText);

  if (!qty || qty < 1) {
    alert("Please select a valid quantity.");
    return;
  }

  let cart = sessionStorage.getItem("cart") || "";
  let cartItems = cart ? cart.split(",") : [];
  let updated = false;

  for (let i = 0; i < cartItems.length; i++) {
    let parts = cartItems[i].split("|");
    if (parts[0] === name) {
      parts[3] = parseInt(parts[3]) + qty; 
      cartItems[i] = parts.join("|");
      updated = true;
      break;
    }
  }

  if (!updated) {
    cartItems.push(`${name}|${category}|${price}|${qty}`);
  }

  sessionStorage.setItem("cart", cartItems.join(","));
  alert(`${qty} x ${name} added to cart!`);
  location.reload();
}
function updateQty(name, delta) {
  let cartItems = sessionStorage.getItem("cart").split(",");
  for (let i = 0; i < cartItems.length; i++) {
    let parts = cartItems[i].split("|");
    if (parts[0] === name) {
      let qty = parseInt(parts[3]) + delta;
      if (qty < 1) {
        if (confirm("Quantity is 0. Do you want to remove this item?")) {
          cartItems.splice(i, 1);
        } else {
          qty = 1;
          parts[3] = qty;
          cartItems[i] = parts.join("|");
        }
      } else {
        parts[3] = qty;
        cartItems[i] = parts.join("|");
      }
      break;
    }
  }
  sessionStorage.setItem("cart", cartItems.join(","));
  location.reload();
}


  
  function removeItem(name) {
    let cartItems = sessionStorage.getItem("cart").split(",");
    cartItems = cartItems.filter(item => item.split("|")[0] !== name);
    sessionStorage.setItem("cart", cartItems.join(","));
    location.reload();
  }
  
  function clearCart() {
    sessionStorage.removeItem("cart");
    location.reload();
  }
  
  function checkoutCart() {
    const cart = sessionStorage.getItem("cart");
  
    if (!cart || cart === "") {
      alert("🛒 Your cart is empty.");
      return;
    }
  
    const customerName = prompt("👤 Enter your name:");
    if (!customerName) {
      alert(" Name is required to proceed with checkout.");
      return;
    }


    const dine = prompt("🍽️ Choose meal method:\n1. Dine-in\n2. Take-out", "1");
    if (!dine || !["1", "2"].includes(dine)) {
      alert(" Invalid meal method. Please try again.");
      return;
    }
    const payment = prompt("💳 Choose payment method:\n1. 📲 GCash\n2. 💳 Bank\n3. 💵 Cash", "1");
    if (!payment || !["1", "2", "3"].includes(payment)) {
      alert(" Invalid payment method. Please try again.");
      return;
    }
  
  
    const paymentMethods = {
      "1": "📲 GCash",
      "2": "💳 Bank",
      "3": "💵 Cash"
    };
  
    const dineMethods = {
      "1": "Dine-in",
      "2": "Take-out"
    };
  
    const selectedPayment = paymentMethods[payment];
    const selectedDine = dineMethods[dine];
  
    const cartItems = cart.split(",");
    let total = 0;
  
    let receipt = `
  ╔══════════════════════════════╗
       🧾 Bitter Sweet Café     
  ╚══════════════════════════════╝
  👤 Customer: ${customerName}
  🍽️  Meal Method: ${selectedDine}
  💳 Payment: ${selectedPayment}
  ──────────────────────────────
  `;
  
    cartItems.forEach(item => {
      const [name, category, price, qty] = item.split("|");
      const subTotal = parseFloat(price) * parseInt(qty);
      total += subTotal;
      receipt += ` ${name} [${category}]
      ₱${price} x ${qty} = ₱${subTotal.toFixed(2)}\n`;
    });
  
    receipt += `──────────────────────────────
  🧾 Total: ₱${total.toFixed(2)}
  📅 Date: ${new Date().toLocaleString()}
  🙏 Thank you for choosing us!
     ☕ Bitter Sweet Café ☕
  `;
  
  document.getElementById("receiptContent").innerHTML = `<pre>${receipt}</pre>`;
const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
receiptModal.show();

  }

  
  function confirmCheckout() {
    alert(" Thank you! Your order has been placed successfully. Enjoy your order! ☕");
    sessionStorage.removeItem("cart");
    location.reload();
  }
  
  
  
  
  window.onload = function () {
    const table = document.getElementById("transaction-list");
    const data = sessionStorage.getItem("cart");
    let total = 0;
  
    if (!table) return;
    table.innerHTML = "";
  
    if (data) {
      const items = data.split(",");
  
      if (items.length === 0 || items[0] === "") {
        const row = table.insertRow();
        row.innerHTML = `<td colspan="6">Your cart is empty.</td>`;
      } else {
        items.forEach(entry => {
          const [name, category, price, qty] = entry.split("|");
          total += parseFloat(price) * parseInt(qty);
          const row = table.insertRow();
          row.innerHTML = `
            <td class="fs-4">${name}</td>
            <td class="fs-4">${category}</td>
            <td class="fs-4">₱${price}</td>
            <td>
              <div style="display: inline-flex; align-items: center; gap: 5px; border: 1px solid #ccc; border-radius: 5px; padding: 2px 5px;">
                <button style="width: 25px; height: 25px;" onclick="updateQty('${name}', -1)">-</button>
                <span style="min-width: 20px; text-align: center;">${qty}</span>
                <button style="width: 25px; height: 25px;" onclick="updateQty('${name}', 1)">+</button>
              </div>
            </td>
            <td><button style="width: 60px; height: 25px;" onclick="removeItem('${name}')">Remove</button></td>
          `;
        });
  
       
        const totalRow = table.insertRow();
        totalRow.innerHTML = `
          <td class="fs-5"colspan="5" style="text-align:right"><strong>Total: ₱${total.toFixed(2)}</strong></td>
        `;
      }
    } else {
      const row = table.insertRow();
      row.innerHTML = `<td colspan="5">Your cart is empty.</td>`;
    }
  };


  function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    if (userInput.trim() === "") {
        return;
    }

    //  user message
    displayMessage(userInput, "user");

  
    const botResponse = getBotResponse(userInput);


    setTimeout(() => {
        displayMessage(botResponse, "bot");
    }, 1000);

    // Clear input field
    document.getElementById("userInput").value = "";
}

// Function messages
function displayMessage(message, sender) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message");

    if (sender === "user") {
        messageContainer.classList.add("user-message");
        messageContainer.textContent = "You: " + message;
    } else {
        messageContainer.classList.add("bot-message");
        messageContainer.textContent = "Bitter Sweet Café: " + message;
    }

    document.getElementById("messages").appendChild(messageContainer);
    document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

// Simple bot responses
function getBotResponse(userMessage) {
    userMessage = userMessage.toLowerCase();

    if (userMessage.includes("order status")) {
        return "Please provide your order number, and I'll check the status for you.";
    } else if (userMessage.includes("refund")) {
        return "Refund requests are processed within 7 business days. Can you provide your order details?";
    } else if (userMessage.includes("delivery time")) {
        return "Our standard delivery time is 3-5 business days. Would you like more details?";
    } else if (userMessage.includes("thank you")) {
        return "You're welcome! Feel free to ask if you need anything else.";
    } else if (userMessage.includes("hi") || userMessage.includes("hello")) {
        return "Thank you for your message. welcome to Bitter Sweet Café. ! How can I assist you today?";
    } else {
        return "I'm sorry, I didn't understand that. Could you rephrase your question?";
    }
}
  