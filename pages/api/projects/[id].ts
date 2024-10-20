import { NextApiRequest, NextApiResponse } from 'next';

// プロジェクト
const projects = [
  { id: 1, name: "要件定義書", description: "要件定義書のサンプルプロジェクト", progress: 70 },
  { id: 2, name: "デザイン案", description: "クライアントへのデザイン案の提出", progress: 30 },
  { id: 3, name: "フロントエンド実装", description: "フロントエンド実装の進捗", progress: 50 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const project = projects.find(proj => proj.id === parseInt(id as string, 10));

  if (project) {
    res.status(200).json(project);
  } else {
    res.status(404).json({ message: 'プロジェクトが見つかりませんでした' });
  }
}
