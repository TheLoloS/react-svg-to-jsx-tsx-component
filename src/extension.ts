// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "react-svg-to-jsx-tsx-component" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let javascript = vscode.commands.registerCommand(
    "react-svg-to-jsx-tsx-component.convertToJsx",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        if (selectedText.length <= 0) {
          vscode.window.showInformationMessage("Nie wybrano tekstu.");
          return;
        }
        if (!isSvgComponent(selectedText)) {
          vscode.window.showInformationMessage(
            `Wybrany SVG jest niepoprawny ${selectedText}`
          );
          return;
        }

        // Ustal ścieżkę do pliku (np. w folderze projektu)
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

        // Zapisz komponent SVG do pliku
        vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          Buffer.from(template)
        );

        vscode.window.showInformationMessage(`Zapisano plik. 💚`);
      } else {
        vscode.window.showInformationMessage("Wystąpił Błąd. 💔");
      }
    }
  );
  let typescript = vscode.commands.registerCommand(
    "react-svg-to-jsx-tsx-component.convertToTsx",
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selectedText = editor.document.getText(editor.selection);
        if (selectedText.length <= 0) {
          vscode.window.showInformationMessage("Nie wybrano tekstu.");
          return;
        }
        if (!isSvgComponent(selectedText)) {
          vscode.window.showInformationMessage(
            `Wybrany SVG jest niepoprawny ${selectedText}`
          );
          return;
        }

        // Ustal ścieżkę do pliku (np. w folderze projektu)
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

        // Zapisz komponent SVG do pliku
        vscode.workspace.fs.writeFile(
          vscode.Uri.file(filePath),
          Buffer.from(template)
        );

        vscode.window.showInformationMessage(`Zapisano plik. 💚`);
      } else {
        vscode.window.showInformationMessage("Wystąpił Błąd. 💔");
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
