"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.showVerbs = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const cp = require("child_process");
const path = require("path");
const EXTENSION_NAME = "aniongithub.devcontainer";
function runCommandAsChildProcess(command, workingDirectory) {
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
function showInputBox(defaultValue = "") {
    return __awaiter(this, void 0, void 0, function* () {
        return vscode.window.showInputBox({
            value: defaultValue,
            valueSelection: [0, defaultValue.length]
        });
    });
}
// Get all sub-directories in a given path
function getSubDirs(pathToScan) {
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
    }
    catch (_) {
        return false;
    }
}
// New verb
function doNew() {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the name of our devcontainer
        let devcontainerName = yield showInputBox("devcontainer-name-here");
        // Let the user choose the template they want to use
        let templateName = yield vscode.window.showQuickPick(getSubDirs(path.join(currentExtPath, "scripts/templates/")));
        // Try composing & running the devcontainer command
        try {
            var result = yield runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --new ${devcontainerName} ${templateName}`, workspacePath);
            console.log();
            vscode.window.showInformationMessage(`Successfully created devcontainer ${devcontainerName} from template ${templateName}`);
        }
        catch (e) {
            vscode.window.showErrorMessage(`Could not create devcontainer ${devcontainerName} from template ${templateName},\nerror was ${e}`);
        }
    });
}
// Activate verb
function doActivate() {
    return __awaiter(this, void 0, void 0, function* () {
        let devcontainerName = yield vscode.window.showQuickPick(getSubDirs(path.join(workspacePath, "/.devcontainer/")));
        try {
            var result = yield runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --activate ${devcontainerName}`, workspacePath);
            vscode.window.showInformationMessage(`Activating ${devcontainerName}...`);
            if (runningInContainer())
                yield vscode.commands.executeCommand("remote-containers.rebuildContainer");
            else
                yield vscode.commands.executeCommand("remote-containers.rebuildAndReopenInContainer");
        }
        catch (e) {
            vscode.window.showErrorMessage(`Could not activate devcontainer ${devcontainerName},\nerror was ${e}`);
        }
    });
}
// Deactivate verb
function doDeActivate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            var result = yield runCommandAsChildProcess(`${path.join(currentExtPath, "scripts/devcontainer")} --deactivate`, workspacePath);
            vscode.window.showInformationMessage(`Deactivating current devcontainer...`);
            if (runningInContainer())
                yield vscode.commands.executeCommand("remote-containers.reopenLocally");
        }
        catch (e) {
            vscode.window.showErrorMessage(`Could not deactivate current devcontainer,\nerror was ${e}`);
        }
    });
}
// Main action, show list of supported verbs
function showVerbs() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode.window.showQuickPick(['new', 'activate', 'deactivate', 'version']);
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
    });
}
exports.showVerbs = showVerbs;
// This method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
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
        let quickPick = vscode.commands.registerCommand('devcontainer', showVerbs);
        context.subscriptions.push(quickPick);
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=devcontainer.js.map