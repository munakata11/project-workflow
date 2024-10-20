'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const initialProjects = [
  { id: 1, name: "ウェブサイトリニューアル", progress: 70 },
  { id: 2, name: "モバイルアプリ開発", progress: 30 },
  { id: 3, name: "マーケティングキャンペーン", progress: 50 },
];

export default function SleekDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const router = useRouter();

  const addProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: `新しいプロジェクト ${projects.length + 1}`,
      progress: 0,
    };
    setProjects([...projects, newProject]);
    router.push(`/project-workflow-manager/${newProject.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">プロジェクトサマリー</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Card key={project.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="border-b border-gray-100 bg-white">
              <CardTitle className="text-xl text-gray-800">{project.name}</CardTitle>
              <CardDescription className="text-gray-500">進捗: {project.progress}%</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <Progress value={project.progress} className="mb-4" />
            </CardContent>
            <CardFooter className="bg-gray-50">
              <Link href={`/project-workflow-manager/${project.id}`}>
                <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 justify-between">
                  詳細を見る
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8 flex">
        <Button onClick={addProject} className="bg-gray-900 text-white hover:bg-gray-800">
          <PlusCircle className="mr-2 h-4 w-4" /> プロジェクトを追加
        </Button>
      </div>
    </div>
  );
}
