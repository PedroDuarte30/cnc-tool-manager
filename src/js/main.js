//Dashboard tools
const tools = [];
const categories = [];

const totalTools = tools.length;

let totalStock = 0;
let lowStock = 0;
let outOfStock = 0;
const totalToolsElement = document.getElementById("total-tools");
const totalStockElement = document.getElementById("total-stock");
const lowStockElement = document.getElementById("low-stock");
const outOfStockElement = document.getElementById("out-stock");
const movementHistory = document.querySelector(".movement-history");

function updateDashboard() {
  totalStock = 0;
  lowStock = 0;
  outOfStock = 0;

  tools.forEach((tool) => {
    totalStock += tool.stock;

    if (tool.stock > 0 && tool.stock <= tool.minStock) {
      lowStock++;
    }

    if (tool.stock === 0) {
      outOfStock++;
    }
  });

  totalToolsElement.textContent = tools.length;
  totalStockElement.textContent = totalStock;
  lowStockElement.textContent = lowStock;
  outOfStockElement.textContent = outOfStock;
}

updateDashboard();

//Tools Section
const container = document.getElementById("container-cards");

function renderTools(toolsToRender) {
  const cardsHTML = toolsToRender
    .map((tool) => {
      let toolStatus = "";

      if (tool.stock === 0) {
        toolStatus = "Out of Stock";
      } else if (tool.stock > 0 && tool.stock <= tool.minStock) {
        toolStatus = "Low Stock";
      } else {
        toolStatus = "In Stock";
      }

      return `
        <tr>
        <td data-label="Tool Name">${tool.name}</td>
        <td data-label="Tool Reference">${tool.reference}</td>
        <td data-label="Tool Category">${tool.category}</td>
        <td data-label="Tool Stock">${tool.stock}</td>
        <td data-label="Minimum Stock">${tool.minStock}</td>
        <td data-label="Status">${toolStatus}</td>
        <td data-label="Actions"></td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = cardsHTML;
}

renderTools(tools);

//Search tool
const searchTool = document.getElementById("tool-search");
const categoryFilter = document.getElementById("category-filter");
const stockFilter = document.getElementById("stock-filter");

function renderCategoryFilter() {
  let optionsHTML = '<option value="">All categories</option>';

  categories.forEach((category) => {
    const option = `<option value="${category}">${category}</option>`;
    optionsHTML += option;
  });

  categoryFilter.innerHTML = optionsHTML;
}

renderCategoryFilter();

function applyFilters() {
  let filteredTools = tools;

  if (searchTool.value !== "") {
    filteredTools = filteredTools.filter((tool) => {
      return tool.name.toLowerCase().includes(searchTool.value.toLowerCase());
    });
  }

  if (categoryFilter.value !== "") {
    filteredTools = filteredTools.filter((tool) => {
      return tool.category === categoryFilter.value;
    });
  }

  if (stockFilter.value !== "") {
    filteredTools = filteredTools.filter((tool) => {
      return (
        (stockFilter.value === "out-stock" && tool.stock === 0) ||
        (stockFilter.value === "in-stock" && tool.stock > 0) ||
        (stockFilter.value === "low-stock" &&
          tool.stock > 0 &&
          tool.stock <= tool.minStock)
      );
    });
  }

  renderTools(filteredTools);
}

//Unified filter events
searchTool.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
stockFilter.addEventListener("change", applyFilters);

//Stock Verification
const verificationStock = document.getElementById("verification-table-body");
const confirmVerification = document.getElementById("confirm-verification");
const lastVerification = document.querySelector(".verification-status p");
const verificationSearch = document.getElementById("verification-search");

const verificationValues = {};

function renderVerification(toolsToRender) {
  const verificationHTML = toolsToRender
    .map((tool) => {
      return `
        <tr>
          <td>${tool.name}</td>
          <td>${tool.reference}</td>
          <td>${tool.stock}</td>
          <td>
            <input type="number" id="physical-${tool.id}" data-id="${tool.id}" min="0" step="1" value="${verificationValues[tool.id] || ""}">
          </td>
        </tr>
      `;
    })
    .join("");

  verificationStock.innerHTML = verificationHTML;
}

verificationStock.addEventListener("input", function (event) {
  const toolId = event.target.dataset.id;
  verificationValues[toolId] = event.target.value;
});

verificationSearch.addEventListener("input", function () {
  const searchValue = verificationSearch.value.toLowerCase();

  const filteredTools = tools.filter((tool) => {
    return tool.name.toLowerCase().includes(searchValue);
  });

  renderVerification(filteredTools);
});

renderVerification(tools);

confirmVerification.addEventListener("click", function () {
  let hasInvalidInput = false;
  let hasVerifiedInput = false;

  const verifiedStock = [];

  Object.entries(verificationValues).forEach(([toolId, value]) => {
    if (value === "") return;

    const physicalStock = Number(value);

    if (!Number.isInteger(physicalStock) || physicalStock < 0) {
      hasInvalidInput = true;
      return;
    }

    hasVerifiedInput = true;

    verifiedStock.push({
      id: toolId,
      stock: physicalStock,
    });
  });

  if (hasInvalidInput || !hasVerifiedInput) return;

  verifiedStock.forEach((item) => {
    const tool = tools.find((tool) => tool.id === item.id);
    tool.stock = item.stock;
  });

  Object.keys(verificationValues).forEach((key) => {
    delete verificationValues[key];
  });

  applyFilters();

  const searchValue = verificationSearch.value.toLowerCase();
  const filteredTools = tools.filter((tool) =>
    tool.name.toLowerCase().includes(searchValue),
  );

  renderVerification(filteredTools);
  updateDashboard();

  lastVerification.textContent = new Date().toLocaleDateString();
});

// Add Tool Modal
const addToolModal = document.getElementById("add-tool-modal");
const openAddTool = document.getElementById("open-add-tool");
const closeAddTool = document.getElementById("close-add-tool");
const cancelAddTool = document.getElementById("cancel-add-tool");

openAddTool.addEventListener("click", function () {
  addToolModal.style.display = "flex";
});

closeAddTool.addEventListener("click", function () {
  addToolModal.style.display = "none";
});

cancelAddTool.addEventListener("click", function () {
  addToolModal.style.display = "none";
});

const addToolForm = document.getElementById("add-tool-form");
const toolCategorySelect = document.getElementById("tool-category");
addToolForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const toolName = document.getElementById("tool-name").value;
  const toolReference = document.getElementById("tool-reference").value;
  const toolCategory = document.getElementById("tool-category").value;
  const toolStock = Number(document.getElementById("tool-stock").value);
  const toolMinStock = Number(document.getElementById("tool-min-stock").value);
  const addToolForm = document.getElementById("add-tool-form");

  const referenceExists = tools.some((tool) => {
    return tool.reference === toolReference;
  });

  if (referenceExists) {
    alert("This reference already exists. Please use a different reference.");
    return;
  }

  const newTool = {
    id: String(Date.now()),
    name: toolName,
    reference: toolReference,
    category: toolCategory,
    stock: toolStock,
    minStock: toolMinStock,
  };

  tools.push(newTool);
  updateDashboard();
  renderCategoryFilter();
  renderVerification(tools);
  renderMovementTools();
  applyFilters();
  addToolForm.reset();

  addToolModal.style.display = "none";
});

//Stock Movements
const movementTool = document.getElementById("movement-tool");
const movementType = document.getElementById("movement-type");
const movementQuantity = document.getElementById("movement-quantity");
const registerMovement = document.getElementById("register-movement");

const movements = [];

function renderMovementTools() {
  const optionsHTML = tools
    .map((tool) => {
      return `
       <option value="${tool.id}">${tool.name}</option>
     `;
    })
    .join("");
  movementTool.innerHTML =
    `<option value="">Choose a tool</option>` + optionsHTML;
}

renderMovementTools();

registerMovement.addEventListener("click", function () {
  const selectedTool = movementTool.value;
  const selectedType = movementType.value;
  const selectedQuantity = movementQuantity.value;
  const quantity = Number(selectedQuantity);

  if (quantity <= 0 || !Number.isInteger(quantity)) {
    alert("Please enter a valid whole number greater than zero.");
    return;
  }

  if (selectedTool === "") {
    return;
  }

  const tool = tools.find((tool) => {
    return tool.id === selectedTool;
  });

  if (selectedType === "entry") {
    tool.stock += quantity;
  } else if (selectedType === "exit" && quantity > tool.stock) {
    alert(
      "Insufficient stock. The requested quantity exceeds available stock.",
    );
    return;
  } else {
    tool.stock -= quantity;
  }

  const newMovement = {
    id: String(Date.now()),
    toolId: tool.id,
    toolName: tool.name,
    type: selectedType,
    quantity: quantity,
    date: new Date().toLocaleString(),
  };

  movements.push(newMovement);
  updateDashboard();
  applyFilters();
  renderVerification(tools);
  movementQuantity.value = "";
  renderMovementHistory();
});

function renderMovementHistory() {
  if (movements.length === 0) {
    movementHistory.innerHTML = `
  <h3>Movement History</h3>
  <p class="empty-state">No movements recorded yet.</p>
`;
  } else {
    const movementsHTML = movements
      .map((movement) => {
        return `
      <div class="movement-item">
      ${movement.toolName}
      ${movement.type}
      ${movement.quantity}
      ${movement.date}
      </div>
      `;
      })
      .join("");
    movementHistory.innerHTML = `
     <h3>Movement History</h3>
     ${movementsHTML}
    `;
  }
}

renderMovementHistory();

//Settings
const newCategoryInput = document.getElementById("new-category");
const addCategoryButton = document.getElementById("add-category");
const categoryList = document.querySelector(".category-list");

addCategoryButton.addEventListener("click", function () {
  const categoryName = newCategoryInput.value.trim();

  if (categoryName === "") {
    alert("Empty category");
    return;
  }

  const categoryExists = categories.some((category) => {
    return category.toLowerCase() === categoryName.toLowerCase();
  });

  if (categoryExists) {
    alert("Category already exists");
    return;
  }

  categories.push(categoryName);
  renderToolCategorySelect();
  renderCategories();
  renderCategoryFilter();
});

renderCategories();

function renderCategories() {
  const categoriesHTML = categories
    .map((category) => {
      return `
    <div>
    <span>${category}</span>
    <button class="delete-category" data-category="${category}">Delete</button>
    </div>
    
    `;
    })
    .join("");

  categoryList.innerHTML = categoriesHTML;

  const deleteCategoryButtons = document.querySelectorAll(".delete-category");
  deleteCategoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const categoryToDelete = button.dataset.category;
      const categoryInUse = tools.some((tool) => {
        return tool.category === categoryToDelete;
      });

      if (categoryInUse) {
        alert(
          "This category is assigned to existing tools and cannot be deleted.",
        );
        return;
      }

      const updatedCategories = categories.filter((category) => {
        return category !== categoryToDelete;
      });
      categories.splice(0, categories.length, ...updatedCategories);
      renderCategories();
      renderCategoryFilter();
      renderToolCategorySelect();

      newCategoryInput.value = "";
    });
  });
}

function renderToolCategorySelect() {
  toolCategorySelect.innerHTML = categories
    .map((category) => {
      return `
    <option value="${category}">${category}</option>
    
    `;
    })
    .join("");
}

renderToolCategorySelect();
