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
exports.deactivate = exports.showInputBox = exports.showQuickPick = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let quickPick = vscode.commands.registerCommand('devcontainer', showQuickPick);
    context.subscriptions.push(quickPick);
}
exports.activate = activate;
function showQuickPick() {
    return __awaiter(this, void 0, void 0, function* () {
        let i = 0;
        const result = yield vscode.window.showQuickPick(['new', 'activate', 'deactivate'], {
            placeHolder: 'new, activate or deactivate',
            onDidSelectItem: item => vscode.window.showInformationMessage(`Focus ${++i}: ${item}`)
        });
        if (vscode.workspace.workspaceFolders != undefined)
            vscode.window.showInformationMessage(`Got: ${result} in workspace ${vscode.workspace.workspaceFolders[0].uri.fsPath}`);
        else
            vscode.window.showInformationMessage(`Got: ${result}`);
    });
}
exports.showQuickPick = showQuickPick;
function showInputBox() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield vscode.window.showInputBox({
            value: 'abcdef',
            valueSelection: [2, 4],
            placeHolder: 'For example: fedcba. But not: 123',
            validateInput: text => {
                vscode.window.showInformationMessage(`Validating: ${text}`);
                return text === '123' ? 'Not 123!' : null;
            }
        });
        vscode.window.showInformationMessage(`Got: ${result}`);
    });
}
exports.showInputBox = showInputBox;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=devcontainer.js.map