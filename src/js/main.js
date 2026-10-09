const form = document.querySelector(".input-group");
const nameInput = document.getElementById("name");
const stockInput = document.getElementById("stock");
const toolList = document.querySelector("#tools-ul");
const noResults = document.getElementById("no-results");

//Add tools
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const item = document.createElement("li");

  const toolName = document.createElement("p");
  toolName.textContent = "Name: " + nameInput.value;
  nameInput.value = "";
  item.appendChild(toolName);

  const desc = document.createElement("p");
  desc.classList.add("stock");
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

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit Tool";
  item.appendChild(editBtn);

  editBtn.addEventListener("click", function () {
    const stockText = this.parentElement.querySelector(".stock").textContent;
    const stockNumber = Number(stockText.replace("Stock: ", ""));

    if (editBtn.textContent === "Edit Tool") {
      stockInput.value = stockNumber;
      editBtn.textContent = "Save";
    } else {
      const newStock = Number(stockInput.value);
      this.parentElement.querySelector(".stock").textContent =
        "Stock: " + newStock;
      editBtn.textContent = "Edit Tool";
    }
  });

  toolList.appendChild(item);
});

//Search tools
const searchInput = document.getElementById("search");

searchInput.addEventListener("input", function () {
  const tools = toolList.querySelectorAll("li");

  let found = false;

  tools.forEach(function (tool) {
    if (
      tool.textContent.toLowerCase().includes(searchInput.value.toLowerCase())
    ) {
      tool.classList.remove("hidden");
      found = true;
    } else {
      tool.classList.add("hidden");
    }
  });

  if (found === false) {
    noResults.classList.remove("hidden");
  }else {
    noResults.classList.add("hidden");
  }
});
