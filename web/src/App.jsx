import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import LeftSidebar from './components/LeftSidebar.jsx';
import ReadingCanvas from './components/ReadingCanvas.jsx';
import RightSidebar from './components/RightSidebar.jsx';
import TaskManagementView from './components/TaskManagementView.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import AddUpdateModal from './components/AddUpdateModal.jsx';
import AddTaskModal from './components/AddTaskModal.jsx';
import TaskLogsModal from './components/TaskLogsModal.jsx';
import DateNavigator from './components/DateNavigator.jsx';

const PAGE_SIZE = 50;

export default function App() {
  const [updates, setUpdates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  const [activeTab, setActiveTab] = useState('all');
  const [filterRead, setFilterRead] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Navigation state - current offset (0 = latest page)
  const [currentOffset, setCurrentOffset] = useState(0);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [activeLogTask, setActiveLogTask] = useState(null);

  // Mobile state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab, currentOffset]);

  // Load a specific page of updates (replaces current feed)
  const loadPage = async (offset) => {
    setIsLoading(true);
    try {
      const categoryParam =
        activeTab !== 'all' && activeTab !== 'tasks'
          ? `&category=${encodeURIComponent(activeTab)}`
          : '';
      const resUpdates = await fetch(
        `/api/updates?limit=${PAGE_SIZE}&offset=${offset}${categoryParam}`
      );
      const dataUpdates = await resUpdates.json();

      if (Array.isArray(dataUpdates)) {
        setUpdates(dataUpdates);
        if (dataUpdates.length > 0 && !selectedUpdate) {
          setSelectedUpdate(dataUpdates[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching Daily API data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    // Load updates for current offset
    await loadPage(currentOffset);

    // Fetch Tasks (always fresh)
    try {
      const resTasks = await fetch('/api/tasks');
      const dataTasks = await resTasks.json();
      if (Array.isArray(dataTasks)) {
        setTasks(dataTasks);
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch Stats
    try {
      const resStats = await fetch('/api/stats');
      const dataStats = await resStats.json();
      setStats(dataStats);
    } catch (e) {
      console.error(e);
    }
  };

  // Navigation handlers
  const handleNavigate = (offset) => {
    if (offset === currentOffset) return;
    setCurrentOffset(offset);
    setSelectedUpdate(null); // Clear selection when page changes
  };

  const handleGoToday = () => {
    handleNavigate(0);
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
      const res = await fetch(`/api/tasks/${taskId}/trigger`, { method: 'POST' });
      const result = await res.json();
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

  const handleRunWatchdog = async () => {
    handleTriggerTask('system-watchdog');
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

  // Compute date range of current view for navigator
  const viewDateRange = useMemo(() => {
    if (updates.length === 0) return { oldest: null, newest: null };
    // Updates are already sorted newest-first from API
    const newest = updates[0]?.created_at;
    const oldest = updates[updates.length - 1]?.created_at;
    return { oldest, newest };
  }, [updates]);

  // Navigation bounds
  const totalItems = stats?.updates?.total ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const currentPage = Math.floor(currentOffset / PAGE_SIZE);
  const isAtLatest = currentOffset === 0;
  const isAtOldest = currentOffset >= (totalPages - 1) * PAGE_SIZE;

  const unreadCount = updates.filter(u => u.read_status === 0).length;

  // Mobile handlers
  const handleMobileItemClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(false);
    }
  };

  const handleMobileMenuOpen = () => {
    setIsMobileSidebarOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Render mobile sidebar overlay
  const renderMobileSidebar = () => {
    if (!isMobileSidebarOpen) return null;

    return (
      <div
        className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-sm md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Feed sidebar"
      >
        <div 
          className="flex h-full flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-3 border-b border-white/10 bg-slate-950/80 shrink-0">
            <h3 className="font-bold font-mono text-white text-sm">Feed</h3>
            <button
              onClick={handleMobileMenuClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <LeftSidebar
              updates={updates}
              selectedUpdate={selectedUpdate}
              onSelectUpdate={setSelectedUpdate}
              filterRead={filterRead}
              setFilterRead={setFilterRead}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onItemClickMobile={handleMobileItemClick}
              // Navigation props
              currentOffset={currentOffset}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
              isLoading={isLoading}
              onNavigate={handleNavigate}
              onGoToday={handleGoToday}
              isAtLatest={isAtLatest}
              isAtOldest={isAtOldest}
              currentViewDate={viewDateRange.oldest}
              currentViewNewestDate={viewDateRange.newest}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render mobile reading canvas overlay
  const renderMobileReadingCanvas = () => {
    if (!selectedUpdate || window.innerWidth >= 1024) return null;

    return (
      <div
        className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm md:hidden overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Reading update"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-3 border-b border-white/10 bg-slate-950/80 shrink-0">
            <h3 className="font-bold font-mono text-white text-sm truncate max-w-[200px]">
              {selectedUpdate.title}
            </h3>
            <button
              onClick={() => setSelectedUpdate(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 shrink-0"
              aria-label="Close reading view"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ReadingCanvas
              update={selectedUpdate}
              onToggleRead={handleToggleRead}
              onDeleteUpdate={handleDeleteUpdate}
              onBackToFeed={() => setSelectedUpdate(null)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#090D16] text-slate-100 overflow-hidden font-sans antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddUpdate={() => setIsAddUpdateOpen(true)}
        onOpenAddTask={() => setIsAddTaskOpen(true)}
        onRunWatchdog={handleRunWatchdog}
        onRefresh={fetchData}
        unreadCount={unreadCount}
        isRefreshing={isLoading}
        onOpenMobileMenu={handleMobileMenuOpen}
        isMobileMenuOpen={isMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Feed (hidden on mobile, shown via overlay) */}
        <aside className="hidden lg:block w-80 border-r border-white/10 bg-[#0A0E1A] flex flex-col shrink-0 overflow-hidden select-none">
          <LeftSidebar
            updates={updates}
            selectedUpdate={selectedUpdate}
            onSelectUpdate={setSelectedUpdate}
            filterRead={filterRead}
            setFilterRead={setFilterRead}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onItemClickMobile={handleMobileItemClick}
            // Navigation props
            currentOffset={currentOffset}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            isLoading={isLoading}
            onNavigate={handleNavigate}
            onGoToday={handleGoToday}
            isAtLatest={isAtLatest}
            isAtOldest={isAtOldest}
            currentViewDate={viewDateRange.oldest}
            currentViewNewestDate={viewDateRange.newest}
          />
        </aside>

        {/* Center - Reading Canvas */}
        <main className="flex-1 min-w-0 relative">
          {activeTab === 'tasks' ? (
            /* Autonomous Tasks Full Management Tab */
            <TaskManagementView
              tasks={tasks}
              onTriggerTask={handleTriggerTask}
              onToggleTaskPause={handleToggleTaskPause}
              onDeleteTask={handleDeleteTask}
              onViewLogs={(t) => setActiveLogTask(t)}
              onOpenAddTask={() => setIsAddTaskOpen(true)}
            />
          ) : (
            /* Feed & Intelligence Canvas */
            <ReadingCanvas
              update={selectedUpdate}
              onToggleRead={handleToggleRead}
              onDeleteUpdate={handleDeleteUpdate}
              onBackToFeed={() => setSelectedUpdate(null)}
            />
          )}
        </main>

        {/* Right Sidebar - Stats & Tasks (hidden on mobile, shown on lg+) */}
        <aside className="hidden xl:block w-80 border-l border-white/10 bg-[#0A0E1A] flex flex-col shrink-0 overflow-hidden select-none">
          <RightSidebar
            stats={stats}
            tasks={tasks}
            onTriggerTask={handleTriggerTask}
            onToggleTaskPause={handleToggleTaskPause}
            onViewLogs={(t) => setActiveLogTask(t)}
            onOpenAddTask={() => setIsAddTaskOpen(true)}
          />
        </aside>

        {/* Mobile Overlays */}
        {renderMobileSidebar()}
        {renderMobileReadingCanvas()}
      </div>

      {/* Modals & Overlays */}
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