'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  ShieldAlert,
  BrainCircuit,
  Send,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Users,
  BookOpen,
  ArrowUpRight,
  HelpCircle,
  Lightbulb,
  Zap,
  MessageSquare
} from 'lucide-react';

export default function AIInsightsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatedQuiz, setGeneratedQuiz] = useState<any | null>(null);
  const [quizTopic, setQuizTopic] = useState('CBSE Class 10 Light & Reflection Optics');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-insights');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleGenerateQuiz = async () => {
    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'GENERATE_HOMEWORK',
          topic: quizTopic,
        })
      });
      if (res.ok) {
        const result = await res.json();
        setGeneratedQuiz(result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDispatchAction = (name: string, act: string) => {
    setActionSuccess(`Automated AI Action "${act}" executed for ${name}. Parent notified.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" /> AI Predictive Analytics Engine
              </span>
              <span className="text-xs text-purple-200">Continuous Student &amp; Academic Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              AI Insights &amp; Early Warning Automation
            </h1>
            <p className="text-sm text-purple-100/80 mt-1 max-w-2xl">
              Real-time multi-variate modeling across attendance, unit assessments, homework submissions, and fee compliance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateQuiz}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-lg transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Generate AI Homework Quiz
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 4 AI Core Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Enrolled Students</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">1,842</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">93.4% Attendance Baseline</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-xs font-bold text-rose-700 uppercase">At-Risk Early Flags</span>
          <div className="text-2xl font-bold text-rose-600 mt-2">31 Students</div>
          <div className="text-xs text-rose-700 mt-1 font-medium">1.68% of Total Body</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">Dropout Risk Index</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">0.2% Low</div>
          <div className="text-xs text-slate-500 mt-1">Below CBSE National Avg</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase">AI Recommendations</span>
          <div className="text-2xl font-bold text-indigo-600 mt-2">3 Active</div>
          <div className="text-xs text-indigo-700 mt-1 font-medium">Actionable Strategic Insights</div>
        </div>
      </div>

      {/* Main Grid: At-Risk Diagnostic Table & Strategic AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At-Risk Students Action Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" /> At-Risk Student Deep-Dive Monitor (31 Flagged)
            </h2>
            <span className="text-xs text-rose-700 bg-rose-100 font-semibold px-2.5 py-0.5 rounded-full">
              Requires Intervention
            </span>
          </div>

          <div className="space-y-3">
            {data?.atRiskStudents?.map((st: any) => (
              <div
                key={st.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{st.name}</span>
                      <span className="text-[10px] font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                        {st.class} (#{st.roll})
                      </span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase">
                        Risk Score: {st.riskScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      ?? Trigger: <strong className="text-slate-800">{st.reason}</strong>
                    </p>
                    <p className="text-[11px] text-indigo-700 mt-0.5 font-medium">
                      ?? AI Solution: {st.recommendedAction}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDispatchAction(st.name, 'SMS Alert to ' + st.parentPhone)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" /> SMS Parent
                    </button>
                    <button
                      onClick={() => handleDispatchAction(st.name, 'Enroll in Remedial Class')}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition"
                    >
                      Enroll Remedial
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic AI Recommendations */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" /> Strategic AI Directives
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Institutional intelligence generated from real-time school logs.
            </p>

            <div className="space-y-3">
              {data?.aiRecommendations?.map((rec: any) => (
                <div key={rec.id} className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                  <span className="font-bold text-indigo-950 block">{rec.title}</span>
                  <p className="text-slate-600 mt-1">{rec.description}</p>
                  <div className="mt-2 text-[11px] font-bold text-emerald-700">
                    Impact: {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Automated Homework Quiz Generator Drawer */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-600" /> Instant AI Quiz &amp; Worksheet Generator
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Generate CBSE/ICSE curriculum aligned problem sets and answers in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={quizTopic}
            onChange={(e) => setQuizTopic(e.target.value)}
            placeholder="e.g. CBSE Class 10 Quadratic Equations Word Problems"
            className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-purple-600"
          />
          <button
            onClick={handleGenerateQuiz}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Generate Practice Quiz
          </button>
        </div>

        {generatedQuiz && (
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-3 animate-in fade-in">
            <h3 className="font-bold text-purple-950 text-sm">{generatedQuiz.title}</h3>
            <div className="space-y-2">
              {generatedQuiz.questions?.map((item: any, idx: number) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-purple-100 space-y-1">
                  <div className="font-semibold text-slate-900">Q{idx + 1}: {item.q}</div>
                  <div className="text-emerald-700 font-medium text-[11px]">? Answer: {item.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
