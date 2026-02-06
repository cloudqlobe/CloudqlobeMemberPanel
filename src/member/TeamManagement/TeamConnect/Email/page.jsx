import { useState } from 'react';
import { Mail, Send, Reply, ReplyAll, Forward, Trash2, Archive, Star, Flag, MoreVertical, Search, RefreshCw, Paperclip, Image, Smile, AlignLeft, Bold, Italic, Underline, Link2, List, X, Menu, Settings, User, Inbox, FileText, AlertCircle } from 'lucide-react';
import Layout from '../../../layout/page';

const EmailClient = () => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      from: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      subject: 'Q4 Budget Review Meeting',
      preview: 'Hi team, I wanted to schedule a meeting to discuss the Q4 budget allocations...',
      body: 'Hi team,\n\nI wanted to schedule a meeting to discuss the Q4 budget allocations. Please review the attached documents before our meeting on Friday.\n\nBest regards,\nSarah',
      time: '10:30 AM',
      date: new Date('2024-11-24'),
      read: false,
      starred: true,
      flagged: false,
      folder: 'inbox',
      hasAttachment: true,
      important: true
    },
    {
      id: 2,
      from: 'Marketing Team',
      email: 'marketing@company.com',
      subject: 'New Campaign Launch - Action Required',
      preview: 'The new holiday campaign is ready to launch. Please review and approve...',
      body: 'The new holiday campaign is ready to launch. Please review and approve the creative assets by EOD.\n\nThanks,\nMarketing Team',
      time: '9:15 AM',
      date: new Date('2024-11-24'),
      read: false,
      starred: false,
      flagged: true,
      folder: 'inbox',
      hasAttachment: false,
      important: false
    },
    {
      id: 3,
      from: 'David Chen',
      email: 'david.chen@partner.com',
      subject: 'RE: Partnership Proposal',
      preview: 'Thanks for your proposal. I have reviewed it with our team...',
      body: 'Thanks for your proposal. I have reviewed it with our team and we are interested in moving forward. Let\'s set up a call next week.\n\nBest,\nDavid',
      time: 'Yesterday',
      date: new Date('2024-11-23'),
      read: true,
      starred: false,
      flagged: false,
      folder: 'inbox',
      hasAttachment: false,
      important: false
    },
    {
      id: 4,
      from: 'HR Department',
      email: 'hr@company.com',
      subject: 'Updated Employee Handbook',
      preview: 'Please find attached the updated employee handbook for 2024...',
      body: 'Please find attached the updated employee handbook for 2024. All employees are required to review and acknowledge receipt.\n\nHR Team',
      time: 'Nov 22',
      date: new Date('2024-11-22'),
      read: true,
      starred: false,
      flagged: false,
      folder: 'inbox',
      hasAttachment: true,
      important: false
    }
  ]);

  const [folders] = useState([
    { id: 'inbox', name: 'Inbox', icon: Inbox, count: 2 },
    { id: 'sent', name: 'Sent', icon: Send, count: 0 },
    { id: 'drafts', name: 'Drafts', icon: FileText, count: 3 },
    { id: 'starred', name: 'Starred', icon: Star, count: 1 },
    { id: 'important', name: 'Important', icon: AlertCircle, count: 1 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 5 }
  ]);

  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [composing, setComposing] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [composeForm, setComposeForm] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const filteredEmails = emails.filter(email => {
    const matchesFolder = selectedFolder === 'starred' 
      ? email.starred 
      : selectedFolder === 'important'
      ? email.important
      : email.folder === selectedFolder;
    
    const matchesSearch = searchQuery === '' || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFolder && matchesSearch;
  });

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, read: true } : e
    ));
    setReplyingTo(null);
  };

  const handleCompose = () => {
    setComposing(true);
    setSelectedEmail(null);
    setReplyingTo(null);
    setComposeForm({ to: '', cc: '', bcc: '', subject: '', body: '' });
  };

  const handleReply = (email, type = 'reply') => {
    setReplyingTo({ email, type });
    setComposeForm({
      to: type === 'reply' ? email.email : '',
      cc: type === 'replyAll' ? 'team@company.com' : '',
      bcc: '',
      subject: `RE: ${email.subject}`,
      body: `\n\n---\nOn ${email.time}, ${email.from} wrote:\n${email.body}`
    });
  };

  const handleSend = () => {
    alert('Email sent successfully!');
    setComposing(false);
    setReplyingTo(null);
    setComposeForm({ to: '', cc: '', bcc: '', subject: '', body: '' });
  };

  const toggleStar = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, starred: !e.starred } : e
    ));
  };

  const toggleFlag = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, flagged: !e.flagged } : e
    ));
  };

  const deleteEmail = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, folder: 'trash' } : e
    ));
    setSelectedEmail(null);
  };

  const archiveEmail = (emailId) => {
    setEmails(emails.map(e => 
      e.id === emailId ? { ...e, folder: 'archive' } : e
    ));
    setSelectedEmail(null);
  };

  return (
    <Layout>
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b">
          <button
            onClick={handleCompose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 font-medium transition"
          >
            <Mail size={18} />
            Compose
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {folders.map(folder => {
            const Icon = folder.icon;
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition ${
                  selectedFolder === folder.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.count > 0 && (
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {folder.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-gray-700">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <RefreshCw size={20} />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <User size={20} />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className={`${selectedEmail || composing || replyingTo ? 'w-96' : 'flex-1'} bg-white border-r overflow-y-auto`}>
            {filteredEmails.map(email => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  !email.read ? 'bg-blue-50' : ''
                } ${selectedEmail?.id === email.id ? 'bg-blue-100' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold truncate ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {email.from}
                      </span>
                      {email.important && (
                        <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                      )}
                      {email.hasAttachment && (
                        <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className={`text-sm mb-1 truncate ${!email.read ? 'font-semibold' : 'font-medium text-gray-700'}`}>
                      {email.subject}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {email.preview}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">{email.time}</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(email.id);
                        }}
                        className="hover:bg-gray-200 p-1 rounded"
                      >
                        {email.starred ? (
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        ) : (
                          <Star size={16} className="text-gray-400" />
                        )}
                      </button>
                      {email.flagged && <Flag size={16} className="text-red-500" />}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Email Detail / Compose */}
          {(selectedEmail || composing || replyingTo) && (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Compose Email */}
              {(composing || replyingTo) && (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      {`replyingTo ? ${replyingTo.type === 'reply' ? 'Reply' : replyingTo.type === 'replyAll' ? 'Reply All' : 'Forward'} : 'New Message'`}
                    </h2>
                    <button
                      onClick={() => {
                        setComposing(false);
                        setReplyingTo(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-12">To:</span>
                        <input
                          type="text"
                          value={composeForm.to}
                          onChange={(e) => setComposeForm({...composeForm, to: e.target.value})}
                          className="flex-1 px-2 py-1 border-b focus:outline-none focus:border-blue-500"
                          placeholder="Recipients"
                        />
                        <button
                          onClick={() => setShowCc(!showCc)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Cc
                        </button>
                        <button
                          onClick={() => setShowBcc(!showBcc)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Bcc
                        </button>
                      </div>

                      {showCc && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">Cc:</span>
                          <input
                            type="text"
                            value={composeForm.cc}
                            onChange={(e) => setComposeForm({...composeForm, cc: e.target.value})}
                            className="flex-1 px-2 py-1 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      {showBcc && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 w-12">Bcc:</span>
                          <input
                            type="text"
                            value={composeForm.bcc}
                            onChange={(e) => setComposeForm({...composeForm, bcc: e.target.value})}
                            className="flex-1 px-2 py-1 border-b focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-12">Subject:</span>
                        <input
                          type="text"
                          value={composeForm.subject}
                          onChange={(e) => setComposeForm({...composeForm, subject: e.target.value})}
                          className="flex-1 px-2 py-1 border-b focus:outline-none focus:border-blue-500"
                          placeholder="Subject"
                        />
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex gap-2 mb-3 pb-3 border-b">
                          <button className="p-2 hover:bg-gray-100 rounded"><Bold size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><Italic size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><Underline size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><Link2 size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><List size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><AlignLeft size={18} /></button>
                          <div className="flex-1"></div>
                          <button className="p-2 hover:bg-gray-100 rounded"><Paperclip size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><Image size={18} /></button>
                          <button className="p-2 hover:bg-gray-100 rounded"><Smile size={18} /></button>
                        </div>
                        
                        <textarea
                          value={composeForm.body}
                          onChange={(e) => setComposeForm({...composeForm, body: e.target.value})}
                          className="w-full min-h-[300px] p-2 focus:outline-none resize-none"
                          placeholder="Write your message..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t flex items-center gap-3">
                    <button
                      onClick={handleSend}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Send size={18} />
                      Send
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">
                      <Paperclip size={18} />
                    </button>
                    <button className="px-4 py-2 hover:bg-gray-100 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Email Detail View */}
              {selectedEmail && !composing && !replyingTo && (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h1 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h1>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {selectedEmail.from[0]}
                          </div>
                          <div>
                            <div className="font-medium">{selectedEmail.from}</div>
                            <div className="text-sm text-gray-500">{selectedEmail.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{selectedEmail.time}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReply(selectedEmail, 'reply')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Reply size={16} />
                        Reply
                      </button>
                      <button
                        onClick={() => handleReply(selectedEmail, 'replyAll')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ReplyAll size={16} />
                        Reply All
                      </button>
                      <button
                        onClick={() => handleReply(selectedEmail, 'forward')}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Forward size={16} />
                        Forward
                      </button>
                      <div className="flex-1"></div>
                      <button
                        onClick={() => toggleStar(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {selectedEmail.starred ? (
                          <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        ) : (
                          <Star size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => toggleFlag(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Flag size={20} className={selectedEmail.flagged ? 'text-red-500' : ''} />
                      </button>
                      <button
                        onClick={() => archiveEmail(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Archive size={20} />
                      </button>
                      <button
                        onClick={() => deleteEmail(selectedEmail.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{selectedEmail.body}</p>
                    </div>
                    
                    {selectedEmail.hasAttachment && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Paperclip size={20} className="text-gray-400" />
                          <div className="flex-1">
                            <div className="font-medium">Budget_Q4_2024.pdf</div>
                            <div className="text-sm text-gray-500">2.4 MB</div>
                          </div>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Download
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default EmailClient;