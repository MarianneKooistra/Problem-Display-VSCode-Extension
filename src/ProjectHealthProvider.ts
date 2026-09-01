import * as vscode from "vscode";

// Made by ai as an example / starting off point to expand the extension. 
// TODO: 
//  - show actual error and warning numbers
//  - change status based on problem score
//  - change emoji based on status


export class ProjectHealthProvider implements vscode.TreeDataProvider<string> {
    getTreeItem(element: string): vscode.TreeItem {
        return new vscode.TreeItem(element);
    }
    
    getChildren(): string[] {
        return [
            "❌ Errors: 0",
            "⚠ Warnings: 0",
            "😊 Status: Great"
        ];
    }
}
