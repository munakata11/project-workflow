import { NextApiRequest, NextApiResponse } from 'next';
import { projects } from '../../../data/projects';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      res.status(200).json(projects);
    } else if (req.method === 'POST') {
      const { name, company, progress, amountExcludingTax, amountIncTax, startDate } = req.body; // 修正: amountExTax -> amountExcludingTax
      if (!name || amountExcludingTax == null || !startDate) {
        return res.status(400).json({ message: '必須項目が不足しています' });
      }
      const newProject = {
        id: projects.length + 1,
        name,
        company,
        progress: progress || 0,
        amountExcludingTax,
        amountIncTax,
        startDate,
      };
      projects.push(newProject); // global.projectsを更新
      res.status(201).json(newProject);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`メソッド ${req.method} は許可されていません`);
    }
  } catch (error) {
    console.error(error); // エラーをコンソールに出力
    res.status(500).json({ message: 'サーバー内部エラー' });
  }
}
