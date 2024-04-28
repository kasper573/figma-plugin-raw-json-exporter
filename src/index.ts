import { save } from "./saveFigmaData";
import { resolveFigmaData } from "./resolvers/resolveFigmaData";

if (figma.command === "export") {
  exportData();
}

async function exportData() {
  try {
    const data = await resolveFigmaData();
    await save(data);
    figma.closePlugin("Data exported successfully!");
  } catch (e) {
    figma.closePlugin(`An error occurred while exporting data: ${String(e)}`);
  }
}
