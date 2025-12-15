import { computationalWorkflow, designMethodsData } from "./methods-data.js";
import { renderWorkflowStrip } from "./workflow-strip.js";
import { renderDesignPack } from "./design-pack.js";

function init(){
  if(typeof d3 === "undefined"){
    console.warn("D3 not loaded yet.");
    return;
  }
  renderWorkflowStrip("workflow-strip", computationalWorkflow);
  renderDesignPack("design-pack", designMethodsData);

  // simple responsive redraw (optional but helpful)
  let t = null;
  window.addEventListener("resize", ()=>{
    clearTimeout(t);
    t = setTimeout(()=>{
      renderWorkflowStrip("workflow-strip", computationalWorkflow);
      renderDesignPack("design-pack", designMethodsData);
    }, 150);
  });
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
