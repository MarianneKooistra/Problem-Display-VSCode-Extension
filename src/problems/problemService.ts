import * as vscode from 'vscode';
import { ProblemCounts } from "./problemTypes";

const ERROR_SCORE = 2;
const WARNING_SCORE = 0.5;

export function getProblemCounts(): ProblemCounts {
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

export function getCurrentFileProblemCounts(): ProblemCounts {
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

export function calculateScore(errors: number, warnings: number): number {
	return (errors * ERROR_SCORE) + (warnings * WARNING_SCORE);
}

export function updateStatusBar(
	statusBar: vscode.StatusBarItem,
	projectProblems: ProblemCounts,
	totalScore: number,
	fileScore: number
) {
	statusBar.text = `$(flame) errors ${projectProblems.errors} \
	and warnings $(warning) ${projectProblems.warnings} \
	Score = ${totalScore} \
	For this file = ${fileScore}`;
}
