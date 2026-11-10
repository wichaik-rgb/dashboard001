import { useState } from 'react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
  FIREBASE_SETUP_GUIDE_MD
} from '../data/standaloneTemplates';
import {
  Code,
  Copy,
  Check,
  Download,
  BookOpen,
  FileCode,
  Flame,
  Globe,
  Sliders,
  ExternalLink
} from 'lucide-react';

export default function CodeGuideView() {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Optional custom Firebase config replacer
  const [customConfig, setCustomConfig] = useState({
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  });
  const [showConfigCustomizer, setShowConfigCustomizer] = useState(false);

  // Function to replace config placeholder if user provided custom values
  const getProcessedCode = (baseCode: string) => {
    if (
      !customConfig.apiKey &&
      !customConfig.databaseURL &&
      !customConfig.projectId
    ) {
      return baseCode;
    }

    let modified = baseCode;
    if (customConfig.apiKey) {
      modified = modified.replace('YOUR_API_KEY', customConfig.apiKey);
    }
    if (customConfig.authDomain) {
      modified = modified.replace('YOUR_PROJECT_ID.firebaseapp.com', customConfig.authDomain);
    }
    if (customConfig.databaseURL) {
      modified = modified.replace(
        'https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app',
        customConfig.databaseURL
      );
    }
    if (customConfig.projectId) {
      modified = modified.replace(/YOUR_PROJECT_ID/g, customConfig.projectId);
    }
    if (customConfig.messagingSenderId) {
      modified = modified.replace('YOUR_MESSAGING_SENDER_ID', customConfig.messagingSenderId);
    }
    if (customConfig.appId) {
      modified = modified.replace('YOUR_APP_ID', customConfig.appId);
    }
    return modified;
  };

  const currentSurveyCode = getProcessedCode(STANDALONE_SURVEY_HTML);
  const currentDashboardCode = getProcessedCode(STANDALONE_DASHBOARD_HTML);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full font-semibold mb-3">
              <FileCode className="w-3.5 h-3.5" /> โค้ด 2 ไฟล์พร้อมใช้งาน (Standalone HTML + Firebase)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              โค้ดแยก 2 ไฟล์ & คู่มือติดตั้ง Firebase ทีละขั้นตอน
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              นำไฟล์ทั้งสองไปใช้งานได้ทันทีบนโฮสติ้งฟรีใดๆ (เช่น GitHub Pages, Firebase Hosting หรือ Netlify) โดยเชื่อมโยงผ่าน Firebase Realtime Database
            </p>
          </div>

          <button
            onClick={() => setShowConfigCustomizer(!showConfigCustomizer)}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition self-start md:self-auto cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>{showConfigCustomizer ? 'ซ่อนช่องใส่ Config' : 'ใส่ Firebase Config ในโค้ด'}</span>
          </button>
        </div>

        {/* Customizer Box */}
        {showConfigCustomizer && (
          <div className="mt-6 pt-6 border-t border-slate-800 bg-slate-950/70 p-5 rounded-2xl animate-in fade-in duration-200">
            <h2 className="text-sm font-bold text-indigo-300 mb-1 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              กรอกค่าคอนฟิก Firebase ของคุณ (ระบบจะแทนที่ในโค้ดให้อัตโนมัติ)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              นำมาจาก Firebase Console &gt; Project Settings &gt; Your apps &gt; SDK setup and configuration
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">apiKey</label>
                <input
                  type="text"
                  placeholder="AIzaSy..."
                  value={customConfig.apiKey}
                  onChange={(e) => setCustomConfig({ ...customConfig, apiKey: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">databaseURL</label>
                <input
                  type="text"
                  placeholder="https://your-project-rtdb.asia-southeast1.firebasedatabase.app"
                  value={customConfig.databaseURL}
                  onChange={(e) => setCustomConfig({ ...customConfig, databaseURL: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">projectId</label>
                <input
                  type="text"
                  placeholder="your-project-id"
                  value={customConfig.projectId}
                  onChange={(e) => setCustomConfig({ ...customConfig, projectId: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('survey')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'survey'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>ไฟล์ที่ 1: survey.html (หน้าตอบ)</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'dashboard'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>ไฟล์ที่ 2: dashboard.html (หน้าจอสรุปผล)</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
            activeTab === 'guide'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50 rounded-t-xl'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>คู่มือตั้งค่า Firebase & Deploy (Step-by-Step)</span>
        </button>
      </div>

      {/* Tab 1: survey.html */}
      {activeTab === 'survey' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                survey.html (ไฟล์แบบสอบถามสำหรับสมาร์ตโฟน)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                ขนาด 1 ไฟล์จบ • มีระบบป้องกันตอบซ้ำ • Mobile-first UI • บันทึกลง Firebase Realtime DB
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentSurveyCode, 'survey')}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                {copiedKey === 'survey' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'survey' ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('survey.html', currentSurveyCode)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด survey.html</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>HTML • UTF-8 • Standalone</span>
              <span>พร้อม Firebase Compat CDN</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{currentSurveyCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: dashboard.html */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                dashboard.html (ไฟล์จอโปรเจกเตอร์ Live Dashboard)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                อัปเดตเรียลไทม์ผ่าน onValue listener • กราฟแท่ง Chart.js • QR Code สแกน • ดาวน์โหลด CSV
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(currentDashboardCode, 'dashboard')}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                {copiedKey === 'dashboard' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'dashboard' ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
              </button>
              <button
                onClick={() => handleDownloadFile('dashboard.html', currentDashboardCode)}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลด dashboard.html</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>HTML • Chart.js • QRCode.js</span>
              <span>Projector Screen Optimized</span>
            </div>
            <pre className="p-4 text-xs font-mono text-cyan-400 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{currentDashboardCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Deployment & Firebase Guide */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                คู่มือการตั้งค่า Firebase Realtime Database และการ Deploy (100% ฟรี)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                ทำตาม 5 ขั้นตอนนี้เพื่อเริ่มใช้งานแบบ Real-time เต็มรูปแบบ
              </p>
            </div>
            <a
              href="https://console.firebase.google.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-xl transition"
            >
              <span>เปิด Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step 1 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-bold text-slate-800 text-base">สร้าง Firebase Project (ฟรีไม่มีค่าใช้จ่าย)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 ml-10 list-disc">
              <li>ไปที่ <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">console.firebase.google.com</a> แล้วล็อกอินด้วย Google Account</li>
              <li>คลิกปุ่ม <strong>"Add project"</strong> แล้วตั้งชื่อโปรเจกต์ เช่น <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">training-survey-2026</code></li>
              <li>ในหน้า Google Analytics สามารถปิด (Disable) หรือเปิดไว้ก็ได้ จากนั้นกด <strong>Create project</strong></li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-bold text-slate-800 text-base">เปิดใช้งาน Realtime Database (เลือกโซนสิงคโปร์)</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 ml-10 list-disc">
              <li>ในเมนูด้านซ้าย เลือก <strong>Build &gt; Realtime Database</strong></li>
              <li>คลิกปุ่ม <strong>"Create Database"</strong></li>
              <li>เลือกภูมิภาค (Location) เป็น <strong>Singapore (asia-southeast1)</strong> เพื่อความรวดเร็วสูงสุดสำหรับผู้ใช้ในประเทศไทย</li>
              <li>เลือก <strong>"Start in test mode"</strong> แล้วกด Enable</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="font-bold text-slate-800 text-base">ตั้งค่า Security Rules ให้ผู้ตอบส่งได้โดยไม่ต้องล็อกอิน</h3>
            </div>
            <div className="ml-10 space-y-2">
              <p className="text-xs text-slate-600">
                คลิกแท็บ <strong>"Rules"</strong> ใน Realtime Database แล้ววางกฎด้านล่างนี้ จากนั้นกด <strong>Publish</strong>:
              </p>
              <div className="bg-slate-900 rounded-xl p-3 text-xs font-mono text-emerald-400">
                <pre>{`{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true
    }
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <h3 className="font-bold text-slate-800 text-base">คัดลอก Firebase Config มาใส่ในโค้ด</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 ml-10 list-disc">
              <li>ไปที่ไอคอนเฟือง <strong>Project Settings</strong> (มุมบนซ้ายข้าง Project Overview)</li>
              <li>เลื่อนลงมาที่หัวข้อ <strong>"Your apps"</strong> คลิกไอคอนเว็บ <strong>&lt;/&gt;</strong></li>
              <li>ตั้งชื่อเว็บแอป เช่น <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">SurveyApp</code> แล้วกด Register app</li>
              <li>คัดลอกค่า <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">firebaseConfig</code> นำไปแทนที่ในไฟล์ <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">survey.html</code> และ <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">dashboard.html</code></li>
            </ul>
          </div>

          {/* Step 5 */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                5
              </span>
              <h3 className="font-bold text-slate-800 text-base">Deploy ฟรีได้ทันที (3 ช่องทางแนะนำ)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-10 mt-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">GitHub Pages (แนะนำ)</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  สร้าง repo แล้วอัปโหลดทั้ง 2 ไฟล์ จากนั้นเปิด GitHub Pages ในแท็บ Settings &gt; Pages
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Netlify Drop</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  นำไฟล์ใส่โฟลเดอร์แล้วลากไปวางที่ netlify.com/drop รับ URL ใช้งานได้ทันทีใน 10 วินาที
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Firebase Hosting</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  ใช้คำสั่ง <code className="bg-slate-100 px-1 rounded">firebase deploy</code> ผูกกับโปรเจกต์เดียวกันได้ทันที
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
