//Dashboard tools
const tools = [
  {
    id: "tool-001",
    name: "Broca M5",
    reference: "BR-M5",
    category: "Brocas",
    stock: 12,
    minStock: 5,
  },
  {
    id: "tool-002",
    name: "Broca M8",
    reference: "BR-M8",
    category: "Brocas",
    stock: 3,
    minStock: 5,
  },
  {
    id: "tool-003",
    name: "Fresa M10",
    reference: "FR-M10",
    category: "Fresas",
    stock: 0,
    minStock: 2,
  },
  {
    id: "tool-004",
    name: "Fresa M8",
    reference: "FR-M8",
    category: "Fresas",
    stock: 55,
    minStock: 2,
  },
];

const totalTools = tools.length;

let totalStock = 0;
let lowStock = 0;
let outOfStock = 0;
const totalToolsElement = document.getElementById("total-tools");
const totalStockElement = document.getElementById("total-stock");
const lowStockElement = document.getElementById("low-stock");
const outOfStockElement = document.getElementById("out-stock");

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

  totalToolsElement.textContent = totalTools;
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
        <div class="tool-card">
          <h3>${tool.name}</h3>
          <p><strong>Id:</strong> ${tool.id}</p>
          <p><strong>Reference:</strong> ${tool.reference}</p>
          <p><strong>Category:</strong> ${tool.category}</p>
          <p><strong>Stock:</strong> ${tool.stock}</p>
          <p><strong>MinStock:</strong> ${tool.minStock}</p>
          <p><strong>Status:</strong> ${toolStatus}</p>
        </div>
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
  const categories = tools.map((tool) => {
    return tool.category;
  });

  const uniqueCategories = new Set(categories);
  const categoriesArray = [...uniqueCategories];

  let optionsHTML = '<option value="">All categories</option>';

  categoriesArray.forEach((category) => {
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

function renderVerification() {
  const verificationHTML = tools
    .map((tool) => {
      return `
        <tr>
          <td>${tool.name}</td>
          <td>${tool.reference}</td>
          <td>${tool.stock}</td>
          <td>
            <input type="number" id="physical-${tool.id}" data-id="${tool.id}" min="0" step="1">
          </td>
        </tr>
      `;
    })
    .join("");

  verificationStock.innerHTML = verificationHTML;
}

renderVerification();

confirmVerification.addEventListener("click", function() {
  const verificationInputs = verificationStock.querySelectorAll("input");

  verificationInputs.forEach((input) => {
    if (input.value === "") return;

    const physicalStock = Number(input.value);
    const toolId = input.dataset.id;

    const tool = tools.find((tool) => tool.id === toolId);

    if (physicalStock !== tool.stock) {
      tool.stock = physicalStock;
    }
  });

  applyFilters();
  renderVerification();
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
addToolForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const toolName = document.getElementById("tool-name").value;
  const toolReference = document.getElementById("tool-reference").value;
  const toolCategory = document.getElementById("tool-category").value;
  const toolStock = Number(document.getElementById("tool-stock").value);
  const toolMinStock = Number(document.getElementById("tool-min-stock").value);

  const referenceExists = tools.some((tool) => {
    return tool.reference === toolReference;
  });

  if(referenceExists) {
    alert("This reference already exists. Please use a different reference.");
    return;
  }


  const newTool = {
    id: Date.now(),
    name: toolName,
    reference: toolReference,
    category: toolCategory,
    stock: toolStock,
    minStock: toolMinStock,
  }

  tools.push(newTool);
  updateDashboard();
  renderCategoryFilter();
  applyFilters();
  addToolForm.reset();

  addToolModal.style.display = "none";
});


