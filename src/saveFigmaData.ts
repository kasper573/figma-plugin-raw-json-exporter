import { FigmaData } from "./resolvers/resolveFigmaData";

export function save(data: FigmaData) {
  return saveFile({
    filename: "data.json",
    mimeType: "application/json",
    content: JSON.stringify(data),
  });
}

function saveFile(args: Omit<DownloadArgs, "callbackMessage">) {
  return new Promise<void>((resolve) => {
    const callbackMessage = "saveFile";
    figma.showUI(createDownloadPayload({ callbackMessage, ...args }), {
      visible: false,
    });
    figma.ui.onmessage = (msg) => {
      if (msg === callbackMessage) {
        resolve();
      }
    };
  });
}

function createDownloadPayload({
  filename,
  mimeType,
  content,
  callbackMessage,
}: DownloadArgs) {
  return `
  <script>
    const blob = new Blob(
      [${JSON.stringify(content)}],
      { type: ${JSON.stringify(mimeType)} }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = ${JSON.stringify(filename)};
    a.click();
    a.remove();
    setTimeout(() => {
      parent.postMessage({ pluginMessage: ${JSON.stringify(
        callbackMessage
      )} }, '*');
    }, 1)
  </script>
`;
}

interface DownloadArgs {
  filename: string;
  mimeType: string;
  content: string;
  callbackMessage: string;
}
