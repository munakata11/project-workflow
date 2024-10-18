'use client'

import { useState, useEffect } from "react"
import { LayoutDashboard, Briefcase, Settings, LogOut, PlusCircle, CheckCircle, Circle, Phone, FileText, Paperclip, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Task = {
  id: number
  text: string
  completed: boolean
  percentage: number
}

type Note = {
  id: number
  type: 'call' | 'meeting'
  content: string
  date: string
}

type File = {
  id: number
  name: string
  type: string
  url: string
}

type Project = {
  id: number
  name: string
  tasks: Task[]
  notes: Note[]
  files: File[]
}

export function ProjectWorkflowManagerComponent() {
  const [project, setProject] = useState<Project>({
    id: 1,
    name: "ウェブサイトリニューアル",
    tasks: [
      { id: 1, text: "要件定義", completed: false, percentage: 20 },
      { id: 2, text: "デザイン", completed: false, percentage: 30 },
      { id: 3, text: "フロントエンド実装", completed: false, percentage: 25 },
      { id: 4, text: "バックエンド開発", completed: false, percentage: 25 },
    ],
    notes: [
      { id: 1, type: 'call', content: "クライアントとの初回電話。要件確認。", date: "2023-05-01" },
      { id: 2, type: 'meeting', content: "チーム内キックオフミーティング。役割分担決定。", date: "2023-05-03" },
    ],
    files: [
      { id: 1, name: "要件定義書.pdf", type: "pdf", url: "/files/requirements.pdf" },
      { id: 2, name: "ワイヤーフレーム.docuworks", type: "docuworks", url: "/files/wireframe.xdw" },
    ],
  })

  const [overallProgress, setOverallProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    updateOverallProgress()
  }, [project.tasks])

  const updateOverallProgress = () => {
    const totalPercentage = project.tasks.reduce((sum, task) => sum + task.percentage, 0)
    const completedPercentage = project.tasks
      .filter(task => task.completed)
      .reduce((sum, task) => sum + task.percentage, 0)
    
    if (totalPercentage > 100) {
      setError("エラー：合計が100%を超えています。")
    } else {
      setError(null)
    }

    setOverallProgress(completedPercentage)
  }

  const addTask = (taskText: string) => {
    if (taskText.trim() !== "") {
      const totalPercentage = project.tasks.reduce((sum, task) => sum + task.percentage, 0)
      const remainingPercentage = 100 - totalPercentage
      if (remainingPercentage > 0) {
        setProject(prev => ({
          ...prev,
          tasks: [...prev.tasks, { id: Date.now(), text: taskText, completed: false, percentage: remainingPercentage }],
        }))
      } else {
        setError("エラー：新しいタスクを追加するスペースがありません。")
      }
    }
  }

  const toggleTask = (taskId: number) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }))
  }

  const adjustTaskPercentage = (taskId: number, newPercentage: number) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, percentage: newPercentage } : task
    )
    const totalPercentage = updatedTasks.reduce((sum, task) => sum + task.percentage, 0)
    
    if (totalPercentage <= 100) {
      setProject(prev => ({ ...prev, tasks: updatedTasks }))
      setError(null)
    } else {
      setError("エラー：合計が100%を超えています。")
    }
  }

  const addNote = (type: 'call' | 'meeting', content: string) => {
    if (content.trim() !== "") {
      setProject(prev => ({
        ...prev,
        notes: [...prev.notes, { id: Date.now(), type, content, date: new Date().toISOString().split('T')[0] }],
      }))
    }
  }

  const addFile = (name: string, type: string, url: string) => {
    setProject(prev => ({
      ...prev,
      files: [...prev.files, { id: Date.now(), name, type, url }],
    }))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">WorkFlow</h2>
        </div>
        <nav className="mt-6">
          <a className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100" href="#">
            <LayoutDashboard className="mr-3 h-5 w-5" />
            ダッシュボード
          </a>
          <a className="flex items-center mt-2 py-2 px-4 bg-gray-100 text-gray-900" href="#">
            <Briefcase className="mr-3 h-5 w-5" />
            プロジェクト
          </a>
          <a className="flex items-center mt-2 py-2 px-4 text-gray-600 hover:bg-gray-100" href="#">
            <Settings className="mr-3 h-5 w-5" />
            設定
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">ユーザー名</p>
              <p className="text-xs text-gray-500">user@example.com</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <LogOut className="mr-2 h-4 w-4" /> ログアウト
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">全体の進捗</h2>
            <div className="flex items-center">
              <Progress value={overallProgress} className="flex-grow mr-4" />
              <span className="text-lg font-semibold">{overallProgress}%</span>
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="tasks">
            <TabsList className="mb-4">
              <TabsTrigger value="tasks">タスク</TabsTrigger>
              <TabsTrigger value="notes">メモ</TabsTrigger>
              <TabsTrigger value="files">ファイル</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <Card>
                <CardHeader>
                  <CardTitle>タスク</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {project.tasks.map(task => (
                      <li key={task.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleTask(task.id)}
                            className={task.completed ? "text-green-500" : "text-gray-400"}
                          >
                            {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                          </Button>
                          <span className={`ml-2 ${task.completed ? "line-through text-gray-500" : "text-gray-700"}`}>{task.text}</span>
                        </div>
                        <div className="flex items-center">
                          <Input
                            type="number"
                            value={task.percentage}
                            onChange={(e) => adjustTaskPercentage(task.id, Number(e.target.value))}
                            className="w-16 mr-2"
                            min="0"
                            max="100"
                          />
                          <span className="mr-2">%</span>
                          <Button variant="outline" size="icon" onClick={() => adjustTaskPercentage(task.id, Math.max(0, task.percentage - 1))} className="mr-1">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => adjustTaskPercentage(task.id, Math.min(100, task.percentage + 1))}>
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Input
                    placeholder="新しいタスクを追加"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTask(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>メモ</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.notes.map(note => (
                    <div key={note.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        {note.type === 'call' ? <Phone className="mr-2 h-4 w-4" /> : <FileText className="mr-2 h-4 w-4" />}
                        <span className="font-semibold">{note.type === 'call' ? '電話メモ' : '議事録'}</span>
                        <span className="ml-auto text-sm text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <Textarea
                    placeholder="新しいメモを追加"
                    className="mb-2 w-full"
                    id="new-note"
                  />
                  <div className="flex justify-between w-full">
                    <Button onClick={() => {
                      const content = (document.getElementById('new-note') as HTMLTextAreaElement).value
                      if (content) {
                        addNote('call', content)
                        ;(document.getElementById('new-note') as HTMLTextAreaElement).value = ''
                      }
                    }}>
                      <Phone className="mr-2 h-4 w-4" /> 電話メモを追加
                    </Button>
                    <Button onClick={() => {
                      const content = (document.getElementById('new-note') as HTMLTextAreaElement).value
                      if (content) {
                        addNote('meeting', content)
                        ;(document.getElementById('new-note') as HTMLTextAreaElement).value = ''
                      }
                    }}>
                      <FileText className="mr-2 h-4 w-4" /> 議事録を追加
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>ファイル</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {project.files.map(file => (
                      <li key={file.id} className="flex items-center">
                        <Paperclip className="mr-2 h-4 w-4 text-gray-500" />
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {file.name}
                        </a>
                        <span className="ml-2 text-sm text-gray-500">({file.type})</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        //   実際のアプリケーションでは、ここでファイルをアップロードし、
                        // 返されたURLを使用してaddFile関数を呼び出します。
                        // この例では、ローカルのURL表現を使用します。
                        const fileUrl = URL.createObjectURL(file)
                        addFile(file.name, file.type, fileUrl)
                      }
                    }}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}