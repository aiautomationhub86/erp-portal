'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Clock,
  FileText,
  Paperclip,
  Send,
  Sparkles,
  Search,
  Filter,
  UserCheck,
  Award,
  ChevronDown
} from 'lucide-react';

export default function HomeworkPage() {
  const { activeRole, user } = useAuth();
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // Student Upload Submission Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedHwForUpload, setSelectedHwForUpload] = useState<any | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State (Assign HW)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics (Standard 041)');
  const [section, setSection] = useState('Class 10-A');
  const [dueDate, setDueDate] = useState('');
  const [attachments, setAttachments] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Grading form
  const [gradeInput, setGradeInput] = useState('A+');
  const [feedbackInput, setFeedbackInput] = useState('');

  const fetchHomeworks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/homework');
      if (res.ok) {
        const data = await res.json();
        setHomeworks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const handleCreateHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          dueDate: dueDate || new Date(Date.now() + 86400000 * 3).toISOString(),
          attachments: attachments || 'worksheet_practice_sheet.pdf',
        })
      });

      if (res.ok) {
        setStatusMsg('Homework assigned and published to Class 10-A students & parents!');
        setIsAssignModalOpen(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        fetchHomeworks();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStudentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwForUpload) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'STUDENT_SUBMIT',
          homeworkId: selectedHwForUpload.id,
          studentId: user?.studentProfile?.id,
          submissionText: submissionText || 'Attached step-by-step solved homework sheet.',
          fileUrl: uploadFileName || `${(user?.name || 'student').toLowerCase().replace(/\s+/g, '_')}_solution.pdf`,
        })
      });

      if (res.ok) {
        setStatusMsg(`🎉 Solution for "${selectedHwForUpload.title}" uploaded & submitted successfully!`);
        setIsUploadModalOpen(false);
        setSelectedHwForUpload(null);
        setSubmissionText('');
        setUploadFileName('');
        fetchHomeworks();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeSubmission = async () => {
    if (!selectedSubmission) return;
    try {
      const res = await fetch('/api/homework', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          grade: gradeInput,
          feedback: feedbackInput || 'Great effort and accurate working.',
          status: 'EVALUATED',
        })
      });

      if (res.ok) {
        setStatusMsg('Submission graded successfully! Grade sent to student & parent portal.');
        setSelectedSubmission(null);
        fetchHomeworks();
        setTimeout(() => setStatusMsg(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const isTeacherOrAdmin = activeRole === 'TEACHER' || activeRole === 'PRINCIPAL' || activeRole === 'DIRECTOR' || activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN' || activeRole === 'HOD';

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Academic Homework Module
              </span>
              <span className="text-xs text-blue-200">Daily Assignments &amp; Digital Submissions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Homework &amp; Assignments Tracker
            </h1>
            <p className="text-sm text-blue-100/90 mt-1 max-w-2xl">
              Centralized assignments board: Download problem worksheets, upload solved solutions, and track teacher grades &amp; feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (homeworks.length > 0) {
                  setSelectedHwForUpload(homeworks[0]);
                  setIsUploadModalOpen(true);
                }
              }}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
            >
              <Paperclip className="w-4 h-4" /> Upload Homework Solution
            </button>

            {isTeacherOrAdmin && (
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Assign New Homework
              </button>
            )}
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Homework Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : homeworks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No active homework found</h3>
          <p className="text-xs text-slate-500 mt-1">Assign new homework to track daily student progress.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {homeworks.map((hw) => {
            const hasSubmissions = hw.submissions && hw.submissions.length > 0;
            const mySubmission = hw.submissions?.find((s: any) =>
              s.student?.user?.email === user?.email || s.student?.rollNumber === '10024'
            );

            return (
              <div
                key={hw.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                        {hw.subject?.name || 'Mathematics'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {hw.section ? `Class ${hw.section.name}` : 'Class 10-A'}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {new Date(hw.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mt-2">{hw.title}</h2>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {hw.description}
                  </p>

                  {/* Worksheet Attachment */}
                  {hw.attachments && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-mono text-[11px] truncate max-w-xs">{hw.attachments}</span>
                      </div>
                      <button
                        onClick={() => {
                          setStatusMsg(`Downloaded worksheet "${hw.attachments}"`);
                          setTimeout(() => setStatusMsg(null), 3000);
                        }}
                        className="text-blue-600 hover:underline font-semibold text-[11px]"
                      >
                        Download
                      </button>
                    </div>
                  )}

                  {/* Student Upload Action Bar on Card */}
                  <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
                    <div>
                      {mySubmission ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Submitted on {new Date(mySubmission.submittedAt).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>Ready for student submission</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedHwForUpload(hw);
                        setSubmissionText(mySubmission?.submissionText || '');
                        setUploadFileName(mySubmission?.fileUrl || '');
                        setIsUploadModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1.5 active:scale-95"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {mySubmission ? 'Re-upload / Edit Solution' : 'Upload Solution'}
                    </button>
                  </div>
                </div>

                {/* Submissions Drawer / List */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Submissions ({hw.submissions?.length || 0})
                    </span>
                    <span className="text-[11px] text-slate-400">Class 10-A</span>
                  </div>

                  {hasSubmissions ? (
                    <div className="space-y-2">
                      {hw.submissions.map((sub: any) => (
                        <div
                          key={sub.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">
                                {sub.student?.user?.name || 'Aarav Sharma'} (Roll #{sub.student?.rollNumber || '10024'})
                              </span>
                              {sub.fileUrl && (
                                <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 font-mono text-[10px] rounded flex items-center gap-1">
                                  <Paperclip className="w-2.5 h-2.5" /> {sub.fileUrl}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {sub.submissionText || 'Completed assignment file attached'}
                            </span>
                            {sub.feedback && (
                              <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                                Grade: <strong className="text-emerald-800">{sub.grade}</strong> • {sub.feedback}
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {isTeacherOrAdmin && (
                              <button
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setGradeInput(sub.grade || 'A+');
                                  setFeedbackInput(sub.feedback || '');
                                }}
                                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition"
                              >
                                {sub.grade ? 'Edit Grade' : 'Grade'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-400 flex items-center justify-between">
                      <span>No submissions uploaded yet for this assignment.</span>
                      <button
                        onClick={() => {
                          setSelectedHwForUpload(hw);
                          setIsUploadModalOpen(true);
                        }}
                        className="text-blue-600 font-bold hover:underline text-[11px]"
                      >
                        + Submit Solution
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Upload Homework Solution Modal */}
      {isUploadModalOpen && selectedHwForUpload && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Upload Homework Solution</h3>
                  <p className="text-[11px] text-slate-500">{selectedHwForUpload.subject?.name || 'Mathematics'} • {selectedHwForUpload.section ? `Class ${selectedHwForUpload.section.name}` : 'Class 10-A'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStudentUpload} className="space-y-3.5 text-xs">
              {/* Assignment Summary Box */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Target Assignment:</span>
                <h4 className="font-bold text-xs text-slate-900">{selectedHwForUpload.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2">{selectedHwForUpload.description}</p>
              </div>

              {/* Student Identity Banner */}
              <div className="flex items-center justify-between p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg text-xs">
                <span className="text-slate-600">Submitting as:</span>
                <span className="font-bold text-blue-900">{user?.name || 'Aarav Sharma'} (Roll #{user?.studentProfile?.rollNumber || '10024'})</span>
              </div>

              {/* Solution Working Notes Textarea */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Solution Notes &amp; Step-by-Step Working
                </label>
                <textarea
                  rows={3}
                  required
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="e.g. Solved all questions from Section 5.2. Calculated 20th term as a_20 = 253 - (20-1)*5 = 158. Detailed graph attached..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 text-xs focus:outline-blue-500"
                />
              </div>

              {/* File Upload / Attachment Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Upload Solved Worksheet File (PDF / DOCX / Image)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="e.g. aarav_sharma_ch5_solution.pdf"
                    className="w-full p-2.5 pl-9 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500/20 focus:outline-blue-500"
                  />
                  <Paperclip className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                {/* Quick 1-Click Preset Files */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-medium">Quick Attach:</span>
                  {[
                    `${(user?.name || 'aarav').toLowerCase().replace(/\s+/g, '_')}_solution.pdf`,
                    'handwritten_worksheet_scan.pdf',
                    'math_step_by_step_proofs.pdf',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setUploadFileName(preset)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[10px] font-mono text-slate-700 transition"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Uploading Solution...' : 'Submit to Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Homework Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" /> Assign New Class Homework
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Instantly notifies students and class parents via portal &amp; SMS alerts.
            </p>

            <form onSubmit={handleCreateHomework} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  <option>Mathematics (Standard 041)</option>
                  <option>Science (Physics, Chemistry, Biology 086)</option>
                  <option>English Language &amp; Literature (184)</option>
                  <option>Social Science (087)</option>
                  <option>Information Technology (402)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class &amp; Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  <option>Class 10-A</option>
                  <option>Class 10-B</option>
                  <option>Class 9-A</option>
                  <option>Class 9-B</option>
                  <option>Class 11-SCI</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Homework Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 5: Arithmetic Progressions - Ex 5.2"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Instructions &amp; Problem Sets</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Solve Questions 1 to 12 from NCERT book. Verify nth term equations..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Attachment File URL</label>
                  <input
                    type="text"
                    value={attachments}
                    onChange={(e) => setAttachments(e.target.value)}
                    placeholder="formula_sheet_ch5.pdf"
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Evaluate Student Submission
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Student: <strong>{selectedSubmission.student?.user?.name || 'Aarav Sharma'}</strong> (Roll #{selectedSubmission.student?.rollNumber || '10024'})
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Grade</label>
                <select
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-blue-500"
                >
                  <option>A+ (Outstanding 95-100%)</option>
                  <option>A (Excellent 85-94%)</option>
                  <option>B+ (Very Good 75-84%)</option>
                  <option>B (Good 65-74%)</option>
                  <option>C (Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Teacher Feedback &amp; Remarks</label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="Flawless calculations and clear step-by-step proofs!"
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGradeSubmission}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition shadow-sm"
                >
                  Save &amp; Notify Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
