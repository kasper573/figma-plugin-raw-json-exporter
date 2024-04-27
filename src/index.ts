import { save } from "./saveFigmaData";
import { resolveFigmaData } from "./resolvers/resolveFigmaData";

if (figma.command === "export") {
  resolveFigmaData().then(async (data) => {
    await save(data);
    figma.closePlugin();
  });
}
