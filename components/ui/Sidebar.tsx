'use client'

import Link from 'next/link';
import { LayoutDashboard, Briefcase, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type SidebarProps = {
  links: { href: string; label: string; icon: JSX.Element }[];
};

const Sidebar = ({ links = [] }: SidebarProps) => {
  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-2xl font-bold text-gray-800">Project Manager</h2>
      </div>
      <nav className="mt-6">
        {links.map((link, index) => (
          <Link key={index} href={link.href} className="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100">
            {link.icon}
            {link.label}
          </Link>
        ))}
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
  );
};

export default Sidebar;
