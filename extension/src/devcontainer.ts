// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let quickPick = vscode.commands.registerCommand('devcontainer',
		showQuickPick);
	context.subscriptions.push(quickPick);
}

export async function showQuickPick() {
	let i = 0;
	const result = await vscode.window.showQuickPick(['new', 'activate', 'deactivate'], {
		placeHolder: 'new, activate or deactivate',
		onDidSelectItem: item => vscode.window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	if (vscode.workspace.workspaceFolders != undefined)
		vscode.window.showInformationMessage(`Got: ${result} in workspace ${vscode.workspace.workspaceFolders[0].uri.fsPath}`);
	else
		vscode.window.showInformationMessage(`Got: ${result}`);
}

export async function showInputBox() {
	const result = await vscode.window.showInputBox({
		value: 'abcdef',
		valueSelection: [2, 4],
		placeHolder: 'For example: fedcba. But not: 123',
		validateInput: text => {
			vscode.window.showInformationMessage(`Validating: ${text}`);
			return text === '123' ? 'Not 123!' : null;
		}
	});
	vscode.window.showInformationMessage(`Got: ${result}`);
}

// this method is called when your extension is deactivated
export function deactivate() {}
