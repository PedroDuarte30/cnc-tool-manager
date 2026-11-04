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

//Tools Section
const container = document.getElementById("container-cards");

const cardsHTML = tools
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

//Search tool
const searchTool = document.getElementById('tool-search');
