import React, { useState } from 'react';
import { FolderOpen, CheckCircle2, Clock, AlertCircle, Plus, Trash2, User, Calendar } from 'lucide-react';
import Layout from '../../../layout/page';

export default function ProjectTaskManager() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      color: 'blue',
      tasks: [
        { id: 101, title: 'Create wireframes', status: 'completed', priority: 'high', assignee: 'Sarah', dueDate: '2025-11-01' },
        { id: 102, title: 'Design mockups', status: 'in-progress', priority: 'high', assignee: 'John', dueDate: '2025-11-05' },
        { id: 103, title: 'Frontend development', status: 'todo', priority: 'medium', assignee: 'Mike', dueDate: '2025-11-10' }
      ]
    },
    {
      id: 2,
      name: 'Mobile App',
      color: 'green',
      tasks: [
        { id: 201, title: 'API integration', status: 'in-progress', priority: 'high', assignee: 'Emma', dueDate: '2025-11-04' },
        { id: 202, title: 'Testing', status: 'todo', priority: 'medium', assignee: 'Alex', dueDate: '2025-11-08' }
      ]
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      color: 'purple',
      tasks: [
        { id: 301, title: 'Content creation', status: 'completed', priority: 'medium', assignee: 'Lisa', dueDate: '2025-10-30' },
        { id: 302, title: 'Social media strategy', status: 'in-progress', priority: 'high', assignee: 'Tom', dueDate: '2025-11-06' }
      ]
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'todo',
    priority: 'medium',
    assignee: '',
    dueDate: ''
  });

  const addTask = () => {
    if (newTask.title.trim()) {
      const updatedProjects = projects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: [...project.tasks, { ...newTask, id: Date.now() }]
          };
        }
        return project;
      });
      setProjects(updatedProjects);
      setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
      setNewTask({ title: '', status: 'todo', priority: 'medium', assignee: '', dueDate: '' });
      setShowTaskForm(false);
    }
  };

  const deleteTask = (taskId) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          tasks: project.tasks.filter(task => task.id !== taskId)
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedProjects = projects.map(project => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          tasks: project.tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        };
      }
      return project;
    });
    setProjects(updatedProjects);
    setSelectedProject(updatedProjects.find(p => p.id === selectedProject.id));
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 size={18} className="text-green-600" />;
    if (status === 'in-progress') return <Clock size={18} className="text-yellow-600" />;
    return <AlertCircle size={18} className="text-gray-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'high') return 'border-l-red-500';
    if (priority === 'medium') return 'border-l-yellow-500';
    return 'border-l-green-500';
  };

  const getProjectColor = (color) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      red: 'bg-red-500 hover:bg-red-600',
      orange: 'bg-orange-500 hover:bg-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const taskStats = {
    total: selectedProject.tasks.length,
    completed: selectedProject.tasks.filter(t => t.status === 'completed').length,
    inProgress: selectedProject.tasks.filter(t => t.status === 'in-progress').length,
    todo: selectedProject.tasks.filter(t => t.status === 'todo').length
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Project Tasks</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Projects</h2>
              <div className="space-y-2">
                {projects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                      selectedProject.id === project.id
                        ? `${getProjectColor(project.color)} text-white`
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <FolderOpen size={20} />
                    <div className="flex-1">
                      <div className="font-medium">{project.name}</div>
                      <div className={`text-xs ${selectedProject.id === project.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
                        {project.tasks.length} tasks
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Total Tasks</span>
                  <span className="font-bold text-gray-800">{taskStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Completed</span>
                  <span className="font-bold text-green-600">{taskStats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">In Progress</span>
                  <span className="font-bold text-yellow-600">{taskStats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">To Do</span>
                  <span className="font-bold text-gray-600">{taskStats.todo}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${taskStats.total ? (taskStats.completed / taskStats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}% Complete
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
                <button
                  onClick={() => setShowTaskForm(!showTaskForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium"
                >
                  <Plus size={18} />
                  Add Task
                </button>
              </div>

              {showTaskForm && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6 border-2 border-blue-200">
                  <h3 className="font-semibold mb-3 text-gray-800">New Task</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Assignee"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={addTask}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Save Task
                    </button>
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedProject.tasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No tasks in this project</p>
                  </div>
                ) : (
                  selectedProject.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`bg-white border-l-4 ${getPriorityColor(task.priority)} rounded-lg p-4 shadow hover:shadow-md transition`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                const statuses = ['todo', 'in-progress', 'completed'];
                                const currentIndex = statuses.indexOf(task.status);
                                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                                updateTaskStatus(task.id, nextStatus);
                              }}
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(task.status)}`}
                            >
                              {getStatusIcon(task.status)}
                              {task.status.replace('-', ' ').toUpperCase()}
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 transition p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User size={16} className="text-blue-600" />
                          <span>{task.assignee || 'Unassigned'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-blue-600" />
                          <span>{task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </Layout>
  );
}