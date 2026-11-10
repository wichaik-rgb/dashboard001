import { useState, useEffect, useCallback } from 'react';
import { SurveyResponse } from './types';
import SurveyView from './components/SurveyView';
import DashboardView from './components/DashboardView';
import CodeGuideView from './components/CodeGuideView';
import {
  Smartphone,
  BarChart3,
  FileCode2,
  Share2,
  Check,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'code'>('dashboard');
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse URL query parameter: if ?view=survey, open survey directly for smartphone scanners!
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'survey') {
      setActiveTab('survey');
    } else if (viewParam === 'dashboard') {
      setActiveTab('dashboard');
    } else if (viewParam === 'code') {
      setActiveTab('code');
    }
  }, []);

  // Fetch initial responses
  const fetchResponses = useCallback(async () => {
    try {
      const res = await fetch('/api/responses');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setResponses(json.data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch responses:', err);
    }
  }, []);

  // Listen to Server-Sent Events (SSE) for live instantaneous real-time sync across devices
  useEffect(() => {
    fetchResponses();

    let evtSource: EventSource | null = null;
    try {
      evtSource = new EventSource('/api/stream');
      evtSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.responses) {
            setResponses(payload.responses);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      };

      evtSource.onerror = () => {
        // SSE disconnected or fallback
      };
    } catch (err) {
      console.warn('SSE not supported or error:', err);
    }

    return () => {
      evtSource?.close();
    };
  }, [fetchResponses]);

  // Seed data handler
  const handleSeedData = async () => {
    try {
      await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 5 })
      });
      fetchResponses();
    } catch (err) {
      console.error(err);
    }
  };

  // Clear data handler
  const handleClearData = async () => {
    try {
      await fetch('/api/responses', { method: 'DELETE' });
      setResponses([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Direct survey URL for QR Code & Sharing
  const surveyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=survey`
    : 'https://ais-preview.run.app?view=survey';

  const handleCopySurveyUrl = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-['Prompt',sans-serif]">
      {/* Global Navigation Header */}
      <nav className="bg-slate-950 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                ระบบประเมินความพึงพอใจการอบรม
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  Real-time
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ผู้เข้าอบรมสแกนตอบผ่านมือถือ • ผลขึ้นบนจอทันที
              </p>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('survey')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'survey'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>หน้าผู้เข้าอบรม (มือถือ)</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>หน้าจอ Dashboard (โปรเจกเตอร์)</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>โค้ด 2 ไฟล์ & วิธีติดตั้ง</span>
            </button>
          </div>

          {/* Quick Share Link */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={handleCopySurveyUrl}
              className="inline-flex items-center gap-1.5 text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl transition cursor-pointer"
              title="คัดลอกลิงก์สำหรับส่งให้ผู้เข้าอบรม"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์ตอบ'}</span>
            </button>

            <a
              href={surveyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-slate-800 transition"
              title="เปิดหน้าตอบในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'survey' && (
          <div className="bg-slate-100 min-h-[calc(100vh-65px)] text-slate-800 py-4">
            <SurveyView
              surveyUrl={surveyUrl}
              onSuccessSubmit={(newResp) => {
                setResponses((prev) => [newResp, ...prev]);
              }}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            responses={responses}
            onSeedData={handleSeedData}
            onClearData={handleClearData}
            surveyUrl={surveyUrl}
          />
        )}

        {activeTab === 'code' && (
          <div className="bg-slate-950 min-h-[calc(100vh-65px)] text-slate-100 py-4">
            <CodeGuideView />
          </div>
        )}
      </main>
    </div>
  );
}
