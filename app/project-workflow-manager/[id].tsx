'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query; // IDを取得
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`); // APIからプロジェクトを取得
          if (!response.ok) {
            throw new Error('プロジェクトの取得に失敗しました');
          }
          const projectData = await response.json();
          setProject(projectData);
        } catch (error) {
          console.error('プロジェクトの取得中にエラーが発生しました:', error);
        }
      };
      fetchProject();
    }
  }, [id]);

  if (!project) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
      <p className="text-gray-700 mb-4">{project.description}</p>
      <div className="mb-4">
        <span className="text-gray-500">進捗: {project.progress}%</span>
      </div>
    </div>
  );
}
