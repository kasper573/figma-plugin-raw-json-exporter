import { save } from "./saveFigmaData";
import { resolveFigmaData } from "./resolvers/resolveFigmaData";

if (figma.command === "export") {
  exportData();
}

async function exportData() {
  const resolveResult = await resolveFigmaData();
  if (resolveResult.type === "error") {
    figma.closePlugin(
      `An error occurred while resolving Figma data: ${resolveResult.message}`
    );
    return;
  }

  const saveResult = await save(resolveResult.data);
  if (saveResult.type === "error") {
    figma.closePlugin(
      `An error occurred while saving data: ${saveResult.message}`
    );
    return;
  }

  figma.closePlugin(
    resolveResult.type === "success-with-warnings"
      ? "Data exported with warnings: " + resolveResult.warnings.join(", \n")
      : "Data exported successfully."
  );
}
