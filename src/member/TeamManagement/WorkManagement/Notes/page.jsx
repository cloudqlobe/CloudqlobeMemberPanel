import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import Layout from '../../../layout/page';

export default function MemberNotesPage() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Welcome Note', content: 'Welcome to your notes page!', date: new Date().toISOString() }
  ]);
  const [editingId, setEditingId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isAdding, setIsAdding] = useState(false);

  const addNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title || 'Untitled Note',
        content: newNote.content,
        date: new Date().toISOString()
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '' });
      setIsAdding(false);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
  };

  const saveEdit = (id, updatedTitle, updatedContent) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, title: updatedTitle || 'Untitled Note', content: updatedContent, date: new Date().toISOString() }
        : note
    ));
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Notes</h1>
          <p className="text-gray-600">Organize your thoughts and ideas</p>
        </div>

        {/* Add Note Button */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mb-6 bg-white border-2 border-dashed border-indigo-300 rounded-lg p-4 flex items-center justify-center gap-2 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
          >
            <Plus size={20} />
            <span className="font-medium">Add New Note</span>
          </button>
        )}

        {/* Add Note Form */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-indigo-400">
            <input
              type="text"
              placeholder="Note Title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full text-xl font-semibold mb-3 p-2 border-b-2 border-gray-200 focus:border-indigo-500 outline-none"
            />
            <textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              rows="4"
              className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={addNote}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save size={18} />
                Save Note
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewNote({ title: '', content: '' });
                }}
                className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-xl">No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                isEditing={editingId === note.id}
                onEdit={() => startEdit(note)}
                onSave={saveEdit}
                onCancel={cancelEdit}
                onDelete={() => deleteNote(note.id)}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
}

function NoteCard({ note, isEditing, onEdit, onSave, onCancel, onDelete, formatDate }) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-400">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full text-xl font-semibold mb-3 p-2 border-b-2 border-gray-200 focus:border-indigo-500 outline-none"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows="4"
          className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none resize-none"
        />
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              onSave(note.id, editTitle, editContent);
              setEditTitle(note.title);
              setEditContent(note.content);
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={18} />
            Save
          </button>
          <button
            onClick={() => {
              setEditTitle(note.title);
              setEditContent(note.content);
              onCancel();
            }}
            className="flex items-center gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{note.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit note"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-3 whitespace-pre-wrap">{note.content}</p>
      <p className="text-sm text-gray-400">{formatDate(note.date)}</p>
    </div>
  );
}