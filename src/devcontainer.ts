// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as cp from 'child_process'
import * as path from 'path'

const EXTENSION_NAME = "aniongithub.devcontainer";

declare global {
	var workspacePath: string;
	var currentExtPath: string;
	var output: vscode.OutputChannel;
}

function runCommandAsChildProcess(command: string, workingDirectory: string) {
	return new Promise(function (resolve, reject) {
		cp.exec(command, { cwd: workingDirectory }, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}
			resolve(stdout.trim());
		});
	});
}

// Convenience function to show an input box with a pre-selected default
async function showInputBox(defaultValue: string = "") {
	return vscode.window.showInputBox({
		value: defaultValue,
		valueSelection: [0, defaultValue.length]
	});
}

// Get all sub-directories in a given path
function getSubDirs(pathToScan: string) {
	// Iterate over all items in the directory
	return fs.readdirSync(pathToScan).filter(function (file) {
		// Only return directories
		return fs.statSync(path.join(pathToScan, file)).isDirectory();
	});
}

// Check to see if we're running in a container
function runningInContainer() {
	try {
		return fs.statSync('/.dockerenv') || fs.readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch (_) {
		return false;
	}
}

// New verb
async function doNew() {
	// Get the name of our devcontainer
	let devcontainerName = await showInputBox("devcontainer-name-here")

	// Let the user choose the template they want to use
	let templateName = await vscode.window.showQuickPick(getSubDirs(path.join(currentExtPath, "scripts/templates/")))

	// Try composing & running the devcontainer command
	try {
		var result = await runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --new ${devcontainerName} ${templateName}`, workspacePath)
		console.log()
		vscode.window.showInformationMessage(`Successfully created devcontainer ${devcontainerName} from template ${templateName}`);
	}
	catch (e) {
		vscode.window.showErrorMessage(`Could not create devcontainer ${devcontainerName} from template ${templateName},\nerror was ${e}`)
	}
}

// Activate verb
async function doActivate() {
	let devcontainerName = await vscode.window.showQuickPick(getSubDirs(path.join(workspacePath, "/.devcontainer/")));
	try {
		var result = await runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --activate ${devcontainerName}`, workspacePath);
		vscode.window.showInformationMessage(`Activating ${devcontainerName}...`);
		
		if (runningInContainer())
			await vscode.commands.executeCommand("remote-containers.rebuildContainer");
		else
			await vscode.commands.executeCommand("remote-containers.rebuildAndReopenInContainer");

	}
	catch (e) {
		vscode.window.showErrorMessage(`Could not activate devcontainer ${devcontainerName},\nerror was ${e}`)
	}
}

// Deactivate verb
async function doDeActivate() {
	try {
		var result = await runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --deactivate`, workspacePath);
		vscode.window.showInformationMessage(`Deactivating current devcontainer...`);
		if (runningInContainer())
			await vscode.commands.executeCommand("remote-containers.reopenLocally");
	}
	catch (e) {
		vscode.window.showErrorMessage(`Could not deactivate current devcontainer,\nerror was ${e}`)
	}
}

// Main action, show list of supported verbs
export async function showVerbs() {
	const result = await vscode.window.showQuickPick(['new', 'activate', 'deactivate', 'version']);
	switch (result) {
		case "new":
			doNew();
			break;

		case "activate":
			doActivate();
			break;

		case "deactivate":
			doDeActivate();
			break;
	}
}

// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	
	// Can't proceed if we aren't in a workspace
	if (vscode.workspace.workspaceFolders == undefined) {
		vscode.window.showErrorMessage("No workspace, please open one for devcontainer to operate in!");
		return;
	}
	// We are in a workspace, get the path
	globalThis.workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;

	// Try to get our current extension path
	// TODO: Is there a better way?
	let currentExt = vscode.extensions.getExtension(EXTENSION_NAME);
	if (currentExt == undefined) {
		vscode.window.showErrorMessage("Cannot get the current extension, this should never happen!");
		return;
	}
	// Got it, get the path of our extension so we can run our scripts
	globalThis.currentExtPath = currentExt.extensionUri.fsPath;

	// Create an output console
	globalThis.output = vscode.window.createOutputChannel("devcontainer");
	
	// Register main verbs
	let quickPick = vscode.commands.registerCommand('devcontainer',
		showVerbs);
	context.subscriptions.push(quickPick);
}

// this method is called when your extension is deactivated
export function deactivate() { }