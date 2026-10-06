const form = document.querySelector(".input-group");
const nameInput = document.getElementById("name");
const stockInput = document.getElementById("stock");
const toolList = document.querySelector("#tools-ul");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const item = document.createElement("li");

  const toolName = document.createElement("p");
  toolName.textContent = "Name: " + nameInput.value;
  nameInput.value = "";
  item.appendChild(toolName);
  

  const desc = document.createElement("p");
  item.appendChild(desc);

  const stock = Number(stockInput.value);
  if (stock === 0) {
    desc.textContent = "Out of stock";
  } else {
    desc.textContent = "Stock: " + stock;
  }

  stockInput.value = "";

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  item.appendChild(removeBtn);

  removeBtn.addEventListener("click", function () {
    this.parentElement.remove();
  });

  toolList.appendChild(item);
});
