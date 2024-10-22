import { NextApiRequest, NextApiResponse } from 'next';
import { projects } from '../../../data/projects';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;

    if (req.method === 'GET') {
      const project = projects.find(p => p.id === parseInt(id as string, 10));

      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'プロジェクトが見つかりません' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`メソッド ${req.method} は許可されていません`);
    }
  } catch (error) {
    console.error(error); // エラーをコンソールに出力
    res.status(500).json({ message: 'サーバー内部エラー' });
  }
}
