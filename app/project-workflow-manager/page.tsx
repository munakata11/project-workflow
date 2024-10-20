'use client'

import { useState, useEffect } from "react"
import { LayoutDashboard, Briefcase, Settings, LogOut, PlusCircle, CheckCircle, Circle, Phone, FileText, Paperclip, ChevronUp, ChevronDown, Trash2 } from "lucide-react"
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
  subTasks?: Task[]
}

type Note = {
  id: number
  type: 'call' | 'meeting'
  title: string // タイトルを追加
  content: string
  date: string
}

type File = {
  id: number
  name: string
  type: string
  url: string
  category: string // カテゴリ追加
}

type Project = {
  id: number
  name: string
  company: string // 会社名を追加
  amountExcludingTax: number // 税抜金額を追加
  amountIncludingTax: number // 税込金額を追加
  duration: string // 期間を追加
  tasks: Task[]
  notes: Note[]
  files: File[]
}

function FileUploadDialog({ onClose, onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-lg font-semibold mb-4">ファイルを選択</h2>
        <input type="file" onChange={handleFileChange} />
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="mr-2">キャンセル</button>
          <button onClick={handleSubmit} disabled={!selectedFile}>追加</button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectWorkflowManagerComponent() {
  const [project, setProject] = useState<Project>({
    id: 1,
    name: "ウェブサイトリニーアル",
    company: "サンプル株式会社", // 会社名を追加
    amountExcludingTax: 100000, // 税抜金額を追加
    amountIncludingTax: 110000, // 税込金額を追加
    duration: "2023年5月 - 2023年8月", // 期間を追加
    tasks: [
      { id: 1, text: "要件定義", completed: false, percentage: 20 },
      { id: 2, text: "デザイン", completed: false, percentage: 30 },
      { id: 3, text: "フロントエンド実装", completed: false, percentage: 25 },
      { id: 4, text: "バックエンド開発", completed: false, percentage: 25 },
    ],
    notes: [
      { id: 1, type: 'call', title: "初回電話", content: "クライアントとの初回電話。要件確認。", date: "2023-05-01" },
      { id: 2, type: 'meeting', title: "チーム内キックオフミーティング", content: "チーム内キックオフミーティング。役割分担決定。", date: "2023-05-03" },
    ],
    files: [
      { id: 1, name: "要件定義書.pdf", type: "pdf", url: "/files/requirements.pdf" },
      { id: 2, name: "ワイヤーフレーム.docuworks", type: "docuworks", url: "/files/wireframe.xdw" },
    ],
  })

  const [overallProgress, setOverallProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState<string>("")

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState(project.files);

  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setProject((prevProject) => {
      const updatedProject = { ...prevProject, [field]: value };
      if (field === 'amountExcludingTax') {
        updatedProject.amountIncludingTax = (parseFloat(value) * 1.1).toFixed(2);
      }
      return updatedProject;
    });
  };

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

  const addTask = (taskText: string, percentage: number) => {
    if (taskText.trim() !== "") {
      const roundedPercentage = Math.round(percentage); // 四捨五入
      const updatedTasks = project.tasks.map(task => {
        const oldPercentage = Math.round(100 / project.tasks.length);
        const newPercentage = Math.round(100 / (project.tasks.length + 1));
        return { ...task, percentage: task.percentage === oldPercentage ? newPercentage : task.percentage };
      });

      setProject(prev => ({
        ...prev,
        tasks: [...updatedTasks, { id: Date.now(), text: taskText, completed: false, percentage: roundedPercentage }],
      }));
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

  const addNote = (type: 'call' | 'meeting', title: string, content: string, date: string) => {
    if (content.trim() !== "" && title.trim() !== "") {
      setProject(prev => ({
        ...prev,
        notes: [...prev.notes, { id: Date.now(), type, title, content, date }],
      }))
    }
  }

  const updateNote = (noteId: number, updatedFields: Partial<Note>) => {
    setProject(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId ? { ...note, ...updatedFields } : note
      ),
    }))
  }

  const addCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const addFile = (name: string, type: string, url: string, category: string) => {
    setProject(prev => ({
      ...prev,
      files: [...prev.files, { id: Date.now(), name, type, url, category }],
    }))
  }

  const deleteNote = (noteId: number) => {
    setProject(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId),
    }))
  }

  const addFileToNote = (noteId: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        setProject(prev => ({
          ...prev,
          files: [...prev.files, { id: Date.now(), name: file.name, type: file.type, url: fileUrl, category: noteId.toString() }],
        }));
      }
    };
    input.click();
  };

  const handleFileSelect = (file) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      category: newCategory // 選択されたカテゴリを使用
    };
    setFiles([...files, newFile]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        category: newCategory // 選択されたカテを使用
      };
      setFiles([...files, newFile]);
    }
  };

  const moveFile = (fileId, direction) => {
    const index = files.findIndex(file => file.id === fileId);
    const newFiles = [...files];
    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      const targetCategory = newFiles[targetIndex].category;
      newFiles[index].category = targetCategory;
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      setFiles(newFiles);
    } else if (direction === 1 && index === newFiles.length - 1) {
      // Move to the first file of the next category
      const nextCategoryIndex = categories.findIndex(cat => cat === newFiles[index].category) + 1;
      if (nextCategoryIndex < categories.length) {
        newFiles[index].category = categories[nextCategoryIndex];
        setFiles(newFiles);
      }
    }
  };

  const changeCategory = (fileId, newCategory) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, category: newCategory } : file
    ));
  };

  const deleteFile = (fileId) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const deleteCategory = (category) => {
    setCategories(categories.filter(cat => cat !== category));
    setFiles(files.map(file => file.category === category ? { ...file, category: "" } : file));
  };

  const deleteTask = (taskId: number) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
  }

  // 全体の合計パーセントを計算
  const totalPercentage = project.tasks.reduce((sum, task) => sum + task.percentage, 0);

  // サブタスクを追加る関数
  const addSubTask = (taskId: number) => {
    const subTaskText = prompt("新しいサブタスクを入力してください:");
    if (subTaskText) {
      setProject(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.id === taskId
            ? { ...task, subTasks: [...(task.subTasks || []), { id: Date.now(), text: subTaskText, completed: false }] }
            : task
        ),
      }));
    }
  };

  // サブタスクの完了状態を切り替える関数
  const toggleSubTask = (taskId: number, subTaskId: number) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map(subTask =>
                subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask
              ),
            }
          : task
      ),
    }));
  };

  // サブタスクを削除する関数
  const deleteSubTask = (taskId: number, subTaskId: number) => {
    setProject(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter(subTask => subTask.id !== subTaskId),
            }
          : task
      ),
    }));
  };

  return (
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
        <Alert variant="destructive" className="mb-4 mt-8"> {/* 下にマージンを追加 */}
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Tabs defaultValue="project">
        <TabsList className="mb-4">
          <TabsTrigger value="project">プロジェクト概要</TabsTrigger>
          <TabsTrigger value="tasks">全体工程・タスク</TabsTrigger>
          <TabsTrigger value="notes">メモ</TabsTrigger>
          <TabsTrigger value="files">ファイル</TabsTrigger>
        </TabsList>
        <TabsContent value="project">
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-xl font-bold text-left">プロジェクト概要</CardTitle>
              <button onClick={handleEditToggle} className="text-blue-500 ml-auto">
                {isEditing ? '保存' : '編集'}
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700">プロジェクト名</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  ) : (
                    <p className="mt-1 pl-4">{project.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">受注会社名</label>
                  {isEditing ? (
                    <Input
                      type="text"
                      value={project.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  ) : (
                    <p className="mt-1 pl-4">{project.company}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">受注金額（税抜）</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={project.amountExcludingTax}
                      onChange={(e) => handleInputChange('amountExcludingTax', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  ) : (
                    <p className="mt-1 pl-4">{Number(project.amountExcludingTax).toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">受注金額（税込）</label>
                  <p className="mt-1 pl-4">{Number(project.amountIncludingTax).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700">設計工期</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={project.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  ) : (
                    <p className="mt-1 pl-4">{project.duration}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">全体工程</CardTitle> {/* 見出しを少し小さく */}
              <span className="text-blue-500">合計: {totalPercentage}%</span> {/* 合計パーセントを青字で表示 */}
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {project.tasks.map(task => (
                  <li key={task.id} className="flex flex-col">
                    <div className="flex items-center justify-between">
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
                        <button
                          className="text-gray-500 text-sm ml-2"
                          onClick={() => addSubTask(task.id)}
                        >
                          ＋タスク追加
                        </button>
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
                        <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="ml-2">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <ul className="ml-8 mt-2">
                      {task.subTasks && task.subTasks.map(subTask => (
                        <li key={subTask.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={subTask.completed}
                            onChange={() => toggleSubTask(task.id, subTask.id)}
                            className="mr-2"
                          />
                          <span className={subTask.completed ? "line-through text-gray-500" : "text-gray-700"}>{subTask.text}</span>
                          <Button variant="ghost" size="icon" onClick={() => deleteSubTask(task.id, subTask.id)} className="ml-2">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Input
                placeholder="新しい工程を追加"
                id="new-task-input"
              />
              <Button onClick={() => {
                const taskText = (document.getElementById('new-task-input') as HTMLInputElement).value;
                const totalTasks = project.tasks.length + 1;
                const newPercentage = (100 / totalTasks).toFixed(2);
                addTask(taskText, Number(newPercentage));
                (document.getElementById('new-task-input') as HTMLInputElement).value = '';
              }}>
                追加
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2 mt-4">電話メモ</h3> {/* 見出しを少し小さく */}
              {project.notes
                .filter(note => note.type === 'call')
                .map(note => (
                  <div key={note.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <Phone className="mr-2 h-6 w-6" />
                      {editingNoteId === note.id ? (
                        <Input
                          value={note.title}
                          onChange={(e) => updateNote(note.id, { title: e.target.value })}
                          className="font-semibold"
                        />
                      ) : (
                        <span className="font-semibold">{note.title}</span>
                      )}
                      <span className="ml-auto text-base text-gray-500"> 
                        {editingNoteId === note.id ? (
                          <Input
                            type="date"
                            value={note.date}
                            onChange={(e) => updateNote(note.id, { date: e.target.value })}
                            className="text-base"
                          />
                        ) : (
                          note.date
                        )}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => setEditingNoteId(editingNoteId === note.id ? null : note.id)}>
                        {editingNoteId === note.id ? "保存" : "編集"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {editingNoteId === note.id ? (
                      <Textarea
                        value={note.content}
                        onChange={(e) => updateNote(note.id, { content: e.target.value })}
                        className="text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    )}
                    {/* ファイル名を表示し、リンクを追加 */}
                    <ul className="mt-4"> {/* ここでマージンを追加 */}
                      {project.files
                        .filter(file => file.category === note.id.toString())
                        .map(file => (
                          <li key={file.id} className="flex items-center">
                            <Paperclip className="mr-2 h-4 w-4 text-gray-500" />
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {file.name}
                            </a>
                          </li>
                        ))}
                    </ul>
                    {/* 各メモにファイル添付ボタンを追加 */}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => addFileToNote(note.id)}>
                      ファイルを添付
                    </Button>
                  </div>
                ))}
              
              <hr className="my-6" />

              <h3 className="text-xl font-semibold mb-2">打合せ議事録</h3> {/* 見出しを少し小さく */}
              {project.notes
                .filter(note => note.type === 'meeting')
                .map(note => (
                  <div key={note.id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <FileText className="mr-2 h-6 w-6" />
                      {editingNoteId === note.id ? (
                        <Input
                          value={note.title}
                          onChange={(e) => updateNote(note.id, { title: e.target.value })}
                          className="font-semibold"
                        />
                      ) : (
                        <span className="font-semibold">{note.title}</span>
                      )}
                      <span className="ml-auto text-base text-gray-500"> 
                        {editingNoteId === note.id ? (
                          <Input
                            type="date"
                            value={note.date}
                            onChange={(e) => updateNote(note.id, { date: e.target.value })}
                            className="text-base"
                          />
                        ) : (
                          note.date
                        )}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => setEditingNoteId(editingNoteId === note.id ? null : note.id)}>
                        {editingNoteId === note.id ? "保存" : "編集"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteNote(note.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {editingNoteId === note.id ? (
                      <Textarea
                        value={note.content}
                        onChange={(e) => updateNote(note.id, { content: e.target.value })}
                        className="text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                    )}
                    {/* ファイル名を表示、リンクを追加 */}
                    <ul className="mt-4"> {/* ここでマージンを追加 */}
                      {project.files
                        .filter(file => file.category === note.id.toString())
                        .map(file => (
                          <li key={file.id}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {file.name}
                            </a>
                          </li>
                        ))}
                    </ul>
                    {/* 各メモにファイル添付ボタンを追 */}
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => addFileToNote(note.id)}>
                      ファイルを添付
                    </Button>
                  </div>
                ))}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <Input
                placeholder="タイトルを追加"
                className="mb-2 w-full"
                id="new-note-title"
              />
              <Textarea
                placeholder="新しいメモを追加"
                className="mb-2 w-full h-32"
                id="new-note-content"
              />
              <div className="flex justify-between w-full">
                <Button onClick={() => {
                  const title = (document.getElementById('new-note-title') as HTMLInputElement).value
                  const content = (document.getElementById('new-note-content') as HTMLTextAreaElement).value
                  const date = new Date().toISOString().split('T')[0]
                  if (title && content) {
                    addNote('call', title, content, date)
                    ;(document.getElementById('new-note-title') as HTMLInputElement).value = ''
                    ;(document.getElementById('new-note-content') as HTMLTextAreaElement).value = ''
                  }
                }}>
                  <Phone className="mr-2 h-4 w-4" /> 電話メモを追加
                </Button>
                <Button onClick={() => {
                  const title = (document.getElementById('new-note-title') as HTMLInputElement).value
                  const content = (document.getElementById('new-note-content') as HTMLTextAreaElement).value
                  const date = new Date().toISOString().split('T')[0]
                  if (title && content) {
                    addNote('meeting', title, content, date)
                    ;(document.getElementById('new-note-title') as HTMLInputElement).value = ''
                    ;(document.getElementById('new-note-content') as HTMLTextAreaElement).value = ''
                  }
                }}>
                  <FileText className="mr-2 h-4 w-4" /> 議事録追加
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">ファイル</CardTitle> {/* 見出しを少し小さく */}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {files
                  .filter(file => file.category === "")
                  .map((file, index) => (
                    <li key={file.id} className="flex items-center">
                      <Paperclip className="mr-2 h-4 w-4 text-gray-500" />
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {file.name}
                      </a>
                      <span className="ml-2 text-sm text-gray-500">({file.type})</span>
                      <button onClick={() => moveFile(file.id, -1)} className="ml-2">↑</button>
                      <button onClick={() => moveFile(file.id, 1)} className="ml-2">↓</button>
                      <button onClick={() => deleteFile(file.id)} className="ml-2 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
              </ul>
              {categories.map((category) => {
                const categoryFiles = files.filter(file => file.category === category);
                if (categoryFiles.length === 0) return null;
                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold flex items-center">
                      {category}
                      <button onClick={() => deleteCategory(category)} className="ml-2 text-gray-500 text-sm">
                  削除
                      </button>
                    </h3>
                    <ul className="space-y-2">
                      {categoryFiles.map((file, index) => (
                        <li key={file.id} className="flex items-center">
                          <Paperclip className="mr-2 h-4 w-4 text-gray-500" />
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {file.name}
                          </a>
                          <span className="ml-2 text-sm text-gray-500">({file.type})</span>
                          <button onClick={() => moveFile(file.id, -1)} className="ml-2">↑</button>
                          <button onClick={() => moveFile(file.id, 1)} className="ml-2">↓</button>
                          <button onClick={() => deleteFile(file.id)} className="ml-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <div className="mt-4 mb-4 flex items-center"> {/* マージンを追加 */}
                <Button onClick={() => document.getElementById('fileInput').click()}>ファイルを追加</Button>
                <select onChange={(e) => setNewCategory(e.target.value)} className="ml-4">
                  <option value="">カテゴリを選択</option>
                  {categories.map((category, idx) => (
                    <option key={idx} value={category}>{category}</option>
                  ))}
                </select>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="fileInput"
                />
              </div>
              <div className="mt-8"> {/* 上にマージンを追加 */}
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="新しいカテゴリを追加"
                />
                <Button onClick={addCategory} className="ml-2">カテゴリを追加</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {isDialogOpen && (
        <FileUploadDialog
          onClose={() => setIsDialogOpen(false)}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  )
}
