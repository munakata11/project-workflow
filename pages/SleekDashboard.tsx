import Link from 'next/link';
import { PlusCircle, LayoutDashboard, Briefcase, Settings, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from "@/components/ui/Sidebar";

const projects = [
  { id: 1, name: "ウェブサイトリニューアル", progress: 70 },
  { id: 2, name: "モバイルアプリ開発", progress: 30 },
  { id: 3, name: "マーケティングキャンペーン", progress: 50 },
];

export default function SleekDashboard() {
  const links = [
    { href: "/project-workflow-manager", label: "プロジェクトワークフロー", icon: <LayoutDashboard /> },
    { href: "/SleekDashboard", label: "スリークダッシュボード", icon: <Briefcase /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={links} />
      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
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
                  <Button variant="ghost" className="w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 justify-between">
                    詳細を見る
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex">
            <Button className="bg-gray-900 text-white hover:bg-gray-800">
              <PlusCircle className="mr-2 h-4 w-4" /> プロジェクトを追加
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
