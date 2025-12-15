export const computationalWorkflow = {
  title: "Computational Workflow",
  steps: [
    {
      id: "data",
      short: "Data",
      label: "Spatial Data",
      detail: ["Consumption proxies", "Storage proxies", "Poverty / vulnerability"],
      affordance: "Align heterogeneous indicators into a shared spatial unit."
    },
    {
      id: "normalize",
      short: "Normalize",
      label: "Normalization",
      detail: ["Common analytical scale", "Comparability across neighborhoods"],
      affordance: "Enable relational comparison rather than isolated measurement."
    },
    {
      id: "index",
      short: "Index",
      label: "Composite Index",
      detail: ["Food Vulnerability Index", "Synthesis across variables"],
      affordance: "Make intersectional vulnerability legible as a composite condition."
    },
    {
      id: "map",
      short: "Map",
      label: "Diagnostic Mapping",
      detail: ["Patterns & thresholds", "Uneven exposure"],
      affordance: "Use mapping as spatial reasoning—not final output."
    },
    {
      id: "targets",
      short: "Targets",
      label: "Intervention Targets",
      detail: ["Leverage points", "Design inputs"],
      affordance: "Translate diagnosis into actionable intervention opportunities."
    }
  ],
  links: [
    { source: "data", target: "normalize" },
    { source: "normalize", target: "index" },
    { source: "index", target: "map" },
    { source: "map", target: "targets" }
  ]
};

export const designMethodsData = {
  name: "Design Methods",
  children: [
    {
      name: "Analytical",
      value: 25,
      children: [
        {
          name: "Spatial Reasoning",
          value: 12,
          children: [
            { name: "Thresholds", value: 6 },
            { name: "Comparisons", value: 6 }
          ]
        },
        {
          name: "Index Logic",
          value: 13,
          children: [
            { name: "Synthesis", value: 7 },
            { name: "Clarity First", value: 6 }
          ]
        }
      ]
    },
    {
      name: "Behavioral",
      value: 25,
      children: [
        {
          name: "Decision Context",
          value: 12,
          children: [
            { name: "Constraints", value: 6 },
            { name: "Substitutions", value: 6 }
          ]
        },
        {
          name: "Feedback Design",
          value: 13,
          children: [
            { name: "Cues", value: 7 },
            { name: "Friction", value: 6 }
          ]
        }
      ]
    },
    {
      name: "Interface",
      value: 25,
      children: [
        {
          name: "Translation",
          value: 12,
          children: [
            { name: "Legibility", value: 6 },
            { name: "Actionability", value: 6 }
          ]
        },
        {
          name: "Interaction",
          value: 13,
          children: [
            { name: "Hover Reveal", value: 6 },
            { name: "Scenarios", value: 7 }
          ]
        }
      ]
    },
    {
      name: "Community",
      value: 15,
      children: [
        {
          name: "Neighborhoods",
          value: 7,
          children: [{ name: "Local Constraints", value: 7 }]
        },
        {
          name: "Institutions",
          value: 8,
          children: [{ name: "Procurement", value: 8 }]
        }
      ]
    },
    {
      name: "Speculative",
      value: 10,
      children: [
        {
          name: "Futures",
          value: 10,
          children: [{ name: "Agency", value: 10 }]
        }
      ]
    }
  ]
};
