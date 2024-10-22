// data/projects.ts

export interface Project {
  id: number;
  name: string;
  progress: number;
  amountExTax: number;
  startDate: string;
  tasks: Task[]; // tasksプロパティを追加
  notes: Note[]; // notesプロパティを追加
  files: ProjectFile[]; // filesプロパティを追加
  // 他の必要なフィールドを追加
}

// 初期データ
const initialProjects: Project[] = [
  { id: 1, name: "プロジェクトA", progress: 70, amountExTax: 100000, startDate: "2023-01-01" },
  { id: 2, name: "プロジェクトB", progress: 30, amountExTax: 200000, startDate: "2023-02-01" },
  { id: 3, name: "プロジェクトC", progress: 50, amountExTax: 300000, startDate: "2023-03-01" },
];

// globalオブジェクトにprojectsを保存
declare global {
  var projects: Project[] | undefined;
}

if (!global.projects) {
  global.projects = initialProjects;
}

export const projects = global.projects;
