import { renderConceptSankey } from './conceptual-sankey.js';

// Conceptual Sankey data
const conceptualSankey = {
  nodes: [
    // Column 1 — System Drivers
    { name: "Production", col: 1, category: "drivers" },
    { name: "Processing", col: 1, category: "drivers" },
    { name: "Trade + Policy", col: 1, category: "drivers" },

    // Column 2 — Urban Infrastructure
    { name: "Distribution", col: 2, category: "infrastructure" },
    { name: "Retail Geography", col: 2, category: "infrastructure" },
    { name: "Storage Capacity", col: 2, category: "infrastructure" },
    { name: "Institutional Procurement", col: 2, category: "infrastructure" },

    // Column 3 — Uneven Conditions
    { name: "Affordability", col: 3, category: "conditions" },
    { name: "Access", col: 3, category: "conditions" },
    { name: "Time + Constraints", col: 3, category: "conditions" },
    { name: "Neighborhood Vulnerability", col: 3, category: "conditions" },

    // Column 4 — Everyday Levers
    { name: "Meal Choices", col: 4, category: "levers" },
    { name: "Substitution Pathways", col: 4, category: "levers" },
    { name: "Demand Signals", col: 4, category: "levers" },
    { name: "Community Action", col: 4, category: "levers" }
  ],
  links: [
    // Drivers -> Infrastructure
    { source: "Production", target: "Distribution", value: 6 },
    { source: "Processing", target: "Distribution", value: 5 },
    { source: "Trade + Policy", target: "Distribution", value: 4 },
    { source: "Trade + Policy", target: "Retail Geography", value: 3 },

    // Infrastructure -> Conditions
    { source: "Distribution", target: "Access", value: 6 },
    { source: "Retail Geography", target: "Access", value: 5 },
    { source: "Storage Capacity", target: "Time + Constraints", value: 4 },
    { source: "Retail Geography", target: "Affordability", value: 4 },
    { source: "Institutional Procurement", target: "Affordability", value: 3 },
    { source: "Access", target: "Neighborhood Vulnerability", value: 5 },
    { source: "Affordability", target: "Neighborhood Vulnerability", value: 5 },
    { source: "Time + Constraints", target: "Neighborhood Vulnerability", value: 4 },

    // Conditions -> Levers
    { source: "Neighborhood Vulnerability", target: "Meal Choices", value: 5 },
    { source: "Neighborhood Vulnerability", target: "Substitution Pathways", value: 4 },
    { source: "Affordability", target: "Substitution Pathways", value: 4 },
    { source: "Access", target: "Meal Choices", value: 4 },
    { source: "Time + Constraints", target: "Meal Choices", value: 3 },
    { source: "Demand Signals", target: "Community Action", value: 2 }
  ]
};

function draw() {
  renderConceptSankey('concept-sankey', conceptualSankey);
}

// Render on DOM ready and on resize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', draw);
} else {
  draw();
}

window.addEventListener('resize', () => {
  draw();
});
