import * as vscode from 'vscode';
import { ProjectHealthProvider } from './ProjectHealthProvider';

const ERROR_SCORE = 2;
const WARNING_SCORE = 0.5;

interface ProblemCounts {
	errors: number;
	warnings: number;
}

function getProblemCounts(): ProblemCounts {
	// Count all project errors/warnings
	console.log("start counting now!");
	let errorAmount = 0;
	let warningAmount = 0;
	const vscodeDiagnostics = vscode.languages.getDiagnostics();

	for (const [, diagnostics] of vscodeDiagnostics) {
		for (const diagnostic of diagnostics) {
			switch (diagnostic.severity) {
				case vscode.DiagnosticSeverity.Error:
					errorAmount++;
					break;
				case vscode.DiagnosticSeverity.Warning:
					warningAmount++;
					break;
			}
		}
	}

	return {
		errors: errorAmount,
		warnings: warningAmount
	};
}

function getCurrentFileProblemCounts(): ProblemCounts {
	// Count errors/warnings in current file
	let currentErrorAmount = 0;
	let currentWarningAmount = 0;
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		const fileDiagnostics = vscode.languages.getDiagnostics(editor.document.uri);

		for (const fileDiagnostic of fileDiagnostics) {
			switch (fileDiagnostic.severity) {
				case vscode.DiagnosticSeverity.Error:
					currentErrorAmount++;
					break;
				case vscode.DiagnosticSeverity.Warning:
					currentWarningAmount++;
					break;
			}
		}
	}

	return {
		errors: currentErrorAmount,
		warnings: currentWarningAmount
	};
}

function calculateScore(errors: number, warnings: number): number {
	return (errors * ERROR_SCORE) + (warnings * WARNING_SCORE);
}

function updateStatusBar(
	statusBar:vscode.StatusBarItem, 
	projectProblems: ProblemCounts, 
	totalScore: number, 
	fileScore: number
) {
	statusBar.text = `$(flame) errors ${projectProblems.errors} and warnings $(warning) ${projectProblems.warnings} Score = ${totalScore} For this file = ${fileScore} `;
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "problemdisplay" is now active!');

	const provider = new ProjectHealthProvider();
	vscode.window.registerTreeDataProvider("ProjectHealth", provider);

	const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
	statusBar.command = "workbench.actions.view.problems";
	statusBar.show();

	function updateProblemCount() {
		const projectProblems: ProblemCounts = getProblemCounts();
		const currentProblems: ProblemCounts = getCurrentFileProblemCounts();
		const projectTotalScore: number = calculateScore(
			projectProblems.errors, 
			projectProblems.warnings
		);
		const currentFileScore: number = calculateScore(
			currentProblems.errors,
			currentProblems.warnings
		);

		updateStatusBar(
			statusBar,
			projectProblems,
			projectTotalScore,
			currentFileScore
		);
	}

	context.subscriptions.push(
		statusBar,
		vscode.window.registerTreeDataProvider("ProjectHealth", provider),
		vscode.languages.onDidChangeDiagnostics(updateProblemCount)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// This might be useful to remove the images or something when extension is disabled or uninstalled.
}
