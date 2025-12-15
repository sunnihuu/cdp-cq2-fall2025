export const computationalWorkflow = {
  title: "Computational Workflow",
  subtitle: "Translating complex urban data into actionable diagnostics",
  steps: [
    {
      id: "data",
      label: "Spatial Data",
      short: "Data",
      detail: ["Food consumption proxies", "Household storage indicators", "Socioeconomic vulnerability"]
    },
    {
      id: "normalize",
      label: "Normalization",
      short: "Normalize",
      detail: ["Common analytical scale", "Relational comparison"]
    },
    {
      id: "index",
      label: "Composite Index",
      short: "Index",
      detail: ["Food Vulnerability Index", "Synthesis across variables"]
    },
    {
      id: "map",
      label: "Diagnostic Mapping",
      short: "Map",
      detail: ["Mapping as reasoning", "Revealing uneven risk"]
    },
    {
      id: "targets",
      label: "Intervention Targets",
      short: "Targets",
      detail: ["Neighborhood focus", "Behavioral leverage points"]
    }
  ],
  links: [
    { source: "data", target: "normalize" },
    { source: "normalize", target: "index" },
    { source: "index", target: "map" },
    { source: "map", target: "targets" }
  ],
  bridge: "Interfaces to Design Methods (Behavioral / Interface-driven)",
  hint: "Hover circles to see details. Design Methods explore how intervention might operate."
};
