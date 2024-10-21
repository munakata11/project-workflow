'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PlusCircle, ChevronRight, AlertCircle, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const initialProjects = [
  { id: 1, name: "ウェブサイトリニューアル", progress: 70 },
  { id: 2, name: "モバイルアプリ開発", progress: 30 },
  { id: 3, name: "マーケティングキャンペーン", progress: 50 },
];

function BasicDatePicker({ selectedDate, onDateChange }) {
  return (
    <div className="grid gap-2">
      <label className="text-lg font-semibold">設計工期</label>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat="yyyy/MM/dd"
        placeholderText="日付を選択"
        className="w-full border-2 border-gray-300 p-2"
        popperPlacement="bottom-start"
      />
    </div>
  );
}

export default function SleekDashboard() {
  const [projects, setProjects] = useState(initialProjects);
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [amountExTax, setAmountExTax] = useState('');
  const [amountIncTax, setAmountIncTax] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const addProject = () => {
    setShowForm(true);
  };

  const handleAddProject = (newProjectData) => {
    const newProject = {
      id: projects.length + 1,
      name: newProjectData.projectName,
      progress: 0,
    };
    setProjects([...projects, newProject]);
    setShowForm(false);
    toast.success('プロジェクトが正常に追加されました！', {
      style: {
        border: '1px solid #000',
        padding: '16px',
        color: '#000',
        background: '#fff',
      },
      iconTheme: {
        primary: '#000',
        secondary: '#fff',
      },
    });
    router.push(`/project-workflow-manager/${newProject.id}`);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleAmountExTaxChange = (e) => {
    const value = e.target.value;
    setAmountExTax(value);
    const calculatedIncTax = value ? Math.round(parseFloat(value) * 1.1) : '';
    setAmountIncTax(calculatedIncTax);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // フォームのバリデーションとプロジェクト追加のロジックをここに追加
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
      <div className="mt-8 flex relative">
        <Button onClick={addProject} className="bg-gray-900 text-white hover:bg-gray-800">
          <PlusCircle className="mr-2 h-4 w-4" /> プロジェクトを追加
        </Button>
      </div>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-4 md:p-8 absolute mt-2"
        >
          <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-white border-2 border-black">
            <CardHeader className="bg-black text-white rounded-t-lg p-6">
              <CardTitle className="text-3xl font-bold tracking-tight">新規プロジェクト追加</CardTitle>
            </CardHeader>
            <CardContent className="mt-8 px-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                <FormField
                  label="プロジェクト名"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  error={errors.projectName}
                />
                <FormField
                  label="受注会社名"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  error={errors.companyName}
                />
                <div className="flex space-x-4">
                  <FormField
                    label="受注金額（税抜き）"
                    id="amountExTax"
                    type="number"
                    value={amountExTax}
                    onChange={handleAmountExTaxChange}
                    error={errors.amountExTax}
                  />
                  <FormField
                    label="受注金額（税込）"
                    id="amountIncTax"
                    type="text"
                    value={amountIncTax}
                    readOnly
                    error={errors.amountIncTax}
                  />
                </div>
                <BasicDatePicker
                  selectedDate={selectedDate}
                  onDateChange={(date) => setSelectedDate(date)}
                />
                {/* 他のフォームフィールド */}
              </form>
            </CardContent>
            <CardFooter className="px-6 pb-6 flex space-x-4">
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 transition-all duration-300 text-lg py-6"
                onClick={handleSubmit}
              >
                プロジェクトを追加
              </Button>
              <Button
                type="button"
                className="w-full bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 text-lg py-6"
                onClick={handleCancel}
              >
                キャンセル
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function FormField({ label, id, value, onChange, error, type = "text", className = "", ...props }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-lg font-semibold">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`transition-all duration-300 focus:ring-2 focus:ring-black border-2 border-gray-300 ${className}`}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      <AnimatePresence>
        {error && <ErrorMessage message={error} />}
      </AnimatePresence>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="text-black text-sm mt-1 flex items-center"
    >
      <AlertCircle className="w-4 h-4 mr-1" />
      {message}
    </motion.p>
  );
}
