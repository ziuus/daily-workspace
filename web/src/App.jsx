import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import LeftSidebar from './components/LeftSidebar.jsx';
import ReadingCanvas from './components/ReadingCanvas.jsx';
import RightSidebar from './components/RightSidebar.jsx';
import TaskManagementView from './components/TaskManagementView.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import AddUpdateModal from './components/AddUpdateModal.jsx';
import AddTaskModal from './components/AddTaskModal.jsx';
import TaskLogsModal from './components/TaskLogsModal.jsx';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('daily_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [updates, setUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [activeTab, setActiveTab] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeLogTask, setActiveLogTask] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('daily_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const categoryParam = (activeTab !== 'all' && activeTab !== 'tasks') ? `?category=${activeTab}` : '';
      const resUpdates = await fetch(`/api/updates${categoryParam}`);
      const dataUpdates = await resUpdates.json();

      if (Array.isArray(dataUpdates)) {
        setUpdates(dataUpdates);
        if (dataUpdates.length > 0 && !selectedUpdate) {
          setSelectedUpdate(dataUpdates[0]);
        }
      }

      const resTasks = await fetch('/api/tasks');
      const dataTasks = await resTasks.json();
      if (Array.isArray(dataTasks)) {
        setTasks(dataTasks);
      }

      const resStats = await fetch('/api/stats');
      const dataStats = await resStats.json();
      setStats(dataStats);
    } catch (err) {
      console.error('Error fetching Daily API data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleToggleRead = async (id, newReadStatus) => {
    try {
      const res = await fetch(`/api/updates/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read_status: newReadStatus })
      });
      const updated = await res.json();
      setUpdates(prev => prev.map(u => u.id === id ? updated : u));
      if (selectedUpdate && selectedUpdate.id === id) {
        setSelectedUpdate(updated);
      }
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUpdate = async (id) => {
    try {
      await fetch(`/api/updates/${id}`, { method: 'DELETE' });
      setUpdates(prev => prev.filter(u => u.id !== id));
      if (selectedUpdate && selectedUpdate.id === id) {
        const remaining = updates.filter(u => u.id !== id);
        setSelectedUpdate(remaining.length > 0 ? remaining[0] : null);
      }
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddUpdate = async (updateData) => {
    try {
      const res = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const created = await res.json();
      setUpdates(prev => [created, ...prev]);
      setSelectedUpdate(created);
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerTask = async (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'running' } : t));
    try {
      await fetch(`/api/tasks/${taskId}/trigger`, { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
      fetchData();
    }
  };

  const handleToggleTaskPause = async (taskId, newStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const created = await res.json();
      setTasks(prev => [...prev, created]);
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== taskId));
      fetchStatsOnly();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStatsOnly = async () => {
    try {
      const resStats = await fetch('/api/stats');
      const dataStats = await resStats.json();
      setStats(dataStats);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = updates.filter(u => u.read_status === 0).length;

  return (
    <div className="h-screen w-screen flex flex-col bg-[#FAF9F6] dark:bg-[#0A0B0E] text-slate-900 dark:text-slate-100 overflow-hidden font-sans antialiased">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddUpdate={() => setIsAddUpdateOpen(true)}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onRefresh={fetchData}
        unreadCount={unreadCount}
        isRefreshing={isRefreshing}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'tasks' ? (
          <TaskManagementView
            tasks={tasks}
            onTriggerTask={handleTriggerTask}
            onToggleTaskPause={handleToggleTaskPause}
            onDeleteTask={handleDeleteTask}
            onViewLogs={(t) => setActiveLogTask(t)}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        ) : (
          <>
            <LeftSidebar
              updates={updates}
              selectedUpdate={selectedUpdate}
              onSelectUpdate={setSelectedUpdate}
              filterRead={filterRead}
              setFilterRead={setFilterRead}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            <ReadingCanvas
              update={selectedUpdate}
              onToggleRead={handleToggleRead}
              onDeleteUpdate={handleDeleteUpdate}
            />

            <RightSidebar
              stats={stats}
              tasks={tasks}
              onTriggerTask={handleTriggerTask}
              onToggleTaskPause={handleToggleTaskPause}
              onViewLogs={(t) => setActiveLogTask(t)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
            />
          </>
        )}
      </div>

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        updates={updates}
        tasks={tasks}
        onSelectUpdate={(u) => {
          setSelectedUpdate(u);
          if (activeTab === 'tasks') setActiveTab('all');
        }}
        onSelectTaskTab={() => setActiveTab('tasks')}
      />

      <AddUpdateModal
        isOpen={isAddUpdateOpen}
        onClose={() => setIsAddUpdateOpen(false)}
        onAddUpdate={handleAddUpdate}
      />

      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <TaskLogsModal
        isOpen={!!activeLogTask}
        onClose={() => setActiveLogTask(null)}
        task={activeLogTask}
      />
    </div>
  );
}
