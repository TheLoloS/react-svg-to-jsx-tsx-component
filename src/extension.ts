import * as vscode from "vscode";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "react-svg-to-jsx-tsx-component" is now active!'
  );
  let javascript = vscode.commands.registerCommand(
    "react-svg-to-jsx-tsx-component.convertToJsx",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        if (selectedText.length <= 0) {
          vscode.window.showInformationMessage("You don't select any text.");
          return;
        }
        if (!isSvgComponent(selectedText)) {
          vscode.window.showInformationMessage(
            `Selected text is not a SVG  ${selectedText}`
          );
          return;
        }
        const template = `import React from 'react'

		const SVG = () => {
		  return (
			${selectedText}
		  )
		}
		
		export default SVG;
                `;
        const fileUri = editor.document.uri;
        const folderPath = path.dirname(fileUri.fsPath);
        const baseFileName = "svg";
        const extension = ".jsx";
        const newFileName = await getAvailableFileName(
          folderPath,
          baseFileName,
          extension
        );
        const filePath = path.join(folderPath, newFileName);

        vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          Buffer.from(template)
        );
        const importLine = `import ${newFileName
          .substring(0, newFileName.indexOf("."))
          .toUpperCase()} from \'./${newFileName}\';\n`;
        const position = new vscode.Position(0, 0);
        const replacementText = `<${newFileName
          .substring(0, newFileName.indexOf("."))
          .toUpperCase()} />`;
        editor.edit((editBuilder) => {
          editBuilder.insert(position, importLine);
          editBuilder.replace(editor.selection, replacementText);
        });

        vscode.window.showInformationMessage(`File saved. 💚`);
      } else {
        vscode.window.showInformationMessage("Get some errors. 💔");
      }
    }
  );
  let typescript = vscode.commands.registerCommand(
    "react-svg-to-jsx-tsx-component.convertToTsx",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        if (selectedText.length <= 0) {
          vscode.window.showInformationMessage("You don't select any text.");
          return;
        }
        if (!isSvgComponent(selectedText)) {
          vscode.window.showInformationMessage(
            `Selected text is not a SVG ${selectedText}`
          );
          return;
        }
        const template = `import React from 'react'

		const SVG = () => {
		  return (
			${selectedText}
		  )
		}
		
		export default SVG;
                `;
        const fileUri = editor.document.uri;
        const folderPath = path.dirname(fileUri.fsPath);
        const baseFileName = "svg";
        const extension = ".tsx";
        const newFileName = await getAvailableFileName(
          folderPath,
          baseFileName,
          extension
        );
        const filePath = path.join(folderPath, newFileName);
        vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          Buffer.from(template)
        );
        const importLine = `import ${newFileName
          .substring(0, newFileName.indexOf("."))
          .toUpperCase()} from \'./${newFileName
          .substring(0, newFileName.indexOf("."))
          .toUpperCase()}\';\n`;
        const position = new vscode.Position(0, 0);
        const replacementText = `<${newFileName
          .substring(0, newFileName.indexOf("."))
          .toUpperCase()} />`;
        editor.edit((editBuilder) => {
          editBuilder.insert(position, importLine);
          editBuilder.replace(editor.selection, replacementText);
        });

        vscode.window.showInformationMessage(`File saved. 💚`);
      } else {
        vscode.window.showInformationMessage("Get some errors. 💔");
      }
    }
  );

  context.subscriptions.push(javascript, typescript);
}

function isSvgComponent(text: string): boolean {
  // Sprawdź, czy tekst pasuje do wzorców komponentu SVG
  const svgPattern = /<svg[\s\S]*<\/svg>/i; // Przykładowy prosty wzorzec SVG

  return svgPattern.test(text);
}
async function getAvailableFileName(
  folderPath: string,
  baseFileName: string,
  extension: string
): Promise<string> {
  let index = 0;
  let newFileName = baseFileName + extension;

  while (await fileExists(path.join(folderPath, newFileName))) {
    index++;
    newFileName = `${baseFileName}${index}${extension}`;
  }

  return newFileName;
}
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(filePath));
    return true;
  } catch {
    return false;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
