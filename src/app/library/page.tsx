'use client';

import React, { useState, useEffect } from 'react';
import {
  Library,
  BookOpen,
  Search,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LibraryPage() {
  const { activeRole } = useAuth();
  const [data, setData] = useState<any>({ books: [], activeLoans: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'catalog' | 'loans'>('catalog');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [students, setStudents] = useState<any[]>([]);

  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentId: '',
    durationDays: '14',
  });

  const [bookForm, setBookForm] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    category: 'Computer Science',
    totalCopies: '5',
    shelfLocation: 'Rack CS-05',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/library?search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.books?.[0]) {
          setIssueForm((prev) => ({ ...prev, bookId: json.books[0].id }));
        }
      }

      const studRes = await fetch('/api/students');
      if (studRes.ok) {
        const studJson = await studRes.json();
        setStudents(studJson);
        if (studJson[0]) {
          setIssueForm((prev) => ({ ...prev, studentId: studJson[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ISSUE_BOOK', ...issueForm }),
      });
      if (res.ok) {
        setShowIssueModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReturnBook = async (transactionId: string) => {
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RETURN_BOOK', transactionId, fineAmount: 0 }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD_BOOK', ...bookForm }),
      });
      if (res.ok) {
        setShowAddBookModal(false);
        setBookForm({
          isbn: '',
          title: '',
          author: '',
          publisher: '',
          category: 'Computer Science',
          totalCopies: '5',
          shelfLocation: 'Rack CS-05',
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Library className="w-4 h-4" /> Module 12 • Central Library &amp; Book Lending Desk
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Library Management Portal</h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Search physical book inventory, check availability, manage lending check-outs, and compute late fines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(activeRole === 'LIBRARIAN' || activeRole === 'ADMIN' || activeRole === 'SUPER_ADMIN') && (
            <>
              <button
                onClick={() => setShowAddBookModal(true)}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Catalog Book
              </button>
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-3.5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-xl shadow flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-4 h-4" /> Issue Book
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'catalog' ? 'border-cyan-600 text-cyan-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Book Inventory &amp; Catalog
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'loans' ? 'border-cyan-600 text-cyan-600' : 'border-transparent hover:text-slate-900'
          }`}
        >
          Active Loans &amp; Returns History
        </button>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search library catalog by Title, Author, or ISBN..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-xs rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.books?.map((book: any) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-cyan-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 uppercase">
                      {book.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">ISBN: {book.isbn}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{book.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">by {book.author}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Location:</span>
                    <span className="font-semibold text-slate-700">{book.shelfLocation || 'Rack CS-02'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Available / Total:</span>
                    <span
                      className={`font-bold ${
                        book.availableCopies > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {book.availableCopies} / {book.totalCopies} Copies
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'loans' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Borrower Student</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Loan Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.activeLoans?.map((loan: any) => (
                <tr key={loan.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{loan.book?.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{loan.student?.user?.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {loan.student?.rollNumber}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{new Date(loan.issueDate).toLocaleDateString()}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {new Date(loan.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        loan.status === 'ISSUED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {loan.status === 'ISSUED' && (
                      <button
                        onClick={() => handleReturnBook(loan.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Return Book
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Issue Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Issue Book to Student</h2>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIssueBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Book</label>
                <select
                  value={issueForm.bookId}
                  onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                >
                  {data.books
                    ?.filter((b: any) => b.availableCopies > 0)
                    .map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.availableCopies} available)
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student</label>
                <select
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.name} ({s.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Loan Duration (Days)</label>
                <input
                  type="number"
                  value={issueForm.durationDays}
                  onChange={(e) => setIssueForm({ ...issueForm, durationDays: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-base font-bold text-slate-800">Add Book to Library Catalog</h2>
              <button onClick={() => setShowAddBookModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  placeholder="e.g. Clean Code"
                  className="w-full p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    placeholder="Robert C. Martin"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ISBN</label>
                  <input
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    placeholder="978-0132350884"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Copies</label>
                  <input
                    type="number"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Shelf Location</label>
                  <input
                    type="text"
                    value={bookForm.shelfLocation}
                    onChange={(e) => setBookForm({ ...bookForm, shelfLocation: e.target.value })}
                    placeholder="Rack CS-10"
                    className="w-full p-2.5 bg-slate-50 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 border rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl shadow"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
