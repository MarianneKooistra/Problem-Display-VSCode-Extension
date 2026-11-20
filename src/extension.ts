import * as vscode from 'vscode';
import { ProjectHealthProvider } from './ProjectHealthProvider';
import { ProblemCounts } from './problems/problemTypes';
import { 
	calculateScore, 
	getCurrentFileProblemCounts, 
	getProblemCounts, 
	updateStatusBar 
} from './problems/problemService';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "problemdisplay" is now active!');

	const provider = new ProjectHealthProvider();
	vscode.window.registerTreeDataProvider("ProjectHealth", provider);

	const statusBar = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Left
	);
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
	// Unused for now, but leave it as is as a reminder.
}
