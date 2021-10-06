// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const generateTree = require("./filetree");

function generateFileTree(dir, ignore = []) {
	const treeArr = generateTree(dir, ignore);
	const nums = Math.max(...treeArr.map(e => e.str.length));
	return treeArr.map((e) => e.str + " ".repeat(nums - e.str.length + 2) + "\n").join("");
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "file-tree-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('file-tree-generator.generator', function (uri) {
		// The code you place here will be executed every time your command is executed

		vscode.window.showInputBox({
			title: "Comma separated list of paths to ignore",
			placeHolder: "e.g. node_modules"
		}).then((data) => {
			if (data === undefined || data === "") {
				const tree = generateFileTree(uri.fsPath);
				vscode.env.clipboard.writeText(tree)
				// Display a message box to the user
				vscode.window.showInformationMessage('Copied file tree to clipboard!');
			} else {
				const tree = generateFileTree(uri.fsPath, data.split(","));
				vscode.env.clipboard.writeText(tree)
				// Display a message box to the user
				vscode.window.showInformationMessage('Copied file tree to clipboard!');
			}
		})
		
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
