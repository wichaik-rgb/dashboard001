import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QUESTIONS, SurveyResponse, getInterpretation } from '../types';
import {
  Users,
  Star,
  Download,
  QrCode,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  PlusCircle,
  Trash2,
  Sparkles,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface DashboardViewProps {
  responses: SurveyResponse[];
  onSeedData: () => Promise<void>;
  onClearData: () => Promise<void>;
  surveyUrl: string;
}

export default function DashboardView({
  responses,
  onSeedData,
  onClearData,
  surveyUrl
}: DashboardViewProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const prevCountRef = useRef(responses.length);

  // Generate QR Code image for the survey URL
  useEffect(() => {
    QRCode.toDataURL(surveyUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [surveyUrl]);

  // Play audio chime when response count increments
  useEffect(() => {
    if (responses.length > prevCountRef.current) {
      if (soundEnabled) {
        playChimeSound();
      }
    }
    prevCountRef.current = responses.length;
  }, [responses.length, soundEnabled]);

  // Compute statistics
  const count = responses.length;

  const questionAverages = QUESTIONS.map((_, qIdx) => {
    if (count === 0) return 0;
    const sum = responses.reduce((acc, r) => acc + (r.ratings[qIdx] || 0), 0);
    return Number((sum / count).toFixed(2));
  });

  const grandAverage =
    count === 0
      ? 0
      : Number(
          (
            questionAverages.reduce((acc, curr) => acc + curr, 0) /
            QUESTIONS.length
          ).toFixed(2)
        );

  const interpretation = getInterpretation(grandAverage);

  // Satisfaction Percentage (ratings 4 or 5)
  const satisfiedCount = responses.filter((r) => {
    const avg = r.ratings.reduce((a, b) => a + b, 0) / 5;
    return avg >= 3.51;
  }).length;
  const satisfiedPercent = count === 0 ? 0 : Math.round((satisfiedCount / count) * 100);

  // Frequency distribution for selected or overall questions
  const getScoreDistribution = (qIdx?: number) => {
    const dist = [0, 0, 0, 0, 0]; // count of score 1, 2, 3, 4, 5
    responses.forEach((r) => {
      if (qIdx !== undefined) {
        const val = r.ratings[qIdx];
        if (val >= 1 && val <= 5) dist[val - 1]++;
      } else {
        r.ratings.forEach((val) => {
          if (val >= 1 && val <= 5) dist[val - 1]++;
        });
      }
    });
    return dist;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Export CSV with UTF-8 BOM
  const handleExportCSV = () => {
    if (responses.length === 0) {
      alert('ยังไม่มีข้อมูลการตอบแบบประเมินสำหรับส่งออก');
      return;
    }

    const headers = [
      'ลำดับ',
      'วันเวลาที่ตอบ',
      'ข้อ 1: วิทยากร (เต็ม 5)',
      'ข้อ 2: เนื้อหา (เต็ม 5)',
      'ข้อ 3: การนำไปใช้ (เต็ม 5)',
      'ข้อ 4: สถานที่/อุปกรณ์ (เต็ม 5)',
      'ข้อ 5: ภาพรวม (เต็ม 5)',
      'คะแนนเฉลี่ยรายบุคคล',
      'ข้อเสนอแนะเพิ่มเติม'
    ];

    const rows = responses.map((r, index) => {
      const avg = (r.ratings.reduce((a, b) => a + b, 0) / 5).toFixed(2);
      const cleanSuggestion = (r.suggestion || '').replace(/"/g, '""');
      return [
        index + 1,
        `"${r.createdAt || new Date(r.timestamp).toLocaleString('th-TH')}"`,
        r.ratings[0],
        r.ratings[1],
        r.ratings[2],
        r.ratings[3],
        r.ratings[4],
        avg,
        `"${cleanSuggestion}"`
      ].join(',');
    });

    // Summary header line
    const summaryHeader = [
      'สรุปผลภาพรวม',
      `จำนวนผู้ตอบ: ${count} คน`,
      `เฉลี่ยข้อ 1: ${questionAverages[0]}`,
      `เฉลี่ยข้อ 2: ${questionAverages[1]}`,
      `เฉลี่ยข้อ 3: ${questionAverages[2]}`,
      `เฉลี่ยข้อ 4: ${questionAverages[3]}`,
      `เฉลี่ยข้อ 5: ${questionAverages[4]}`,
      `เฉลี่ยรวม: ${grandAverage} (${interpretation.label})`,
      ''
    ].join(',');

    const csvContent =
      '\uFEFF' +
      summaryHeader +
      '\r\n\r\n' +
      headers.join(',') +
      '\r\n' +
      rows.join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ผลการประเมินความพึงพอใจ_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSeed = async () => {
    setActionLoading('seed');
    try {
      await onSeedData();
    } finally {
      setActionLoading(null);
    }
  };

  const handleClear = async () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลการประเมินทั้งหมดเพื่อเริ่มใหม่?')) {
      setActionLoading('clear');
      try {
        await onClearData();
      } finally {
        setActionLoading(null);
      }
    }
  };

  // Filter valid suggestions
  const validSuggestions = responses.filter(
    (r) => r.suggestion && r.suggestion.trim().length > 0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      {/* Top Projector Action Bar */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Live Evaluation Dashboard
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                เรียลไทม์
              </span>
            </div>
            <p className="text-xs text-slate-400">
              ผลการประเมินความพึงพอใจโครงการฝึกอบรม • จอสำหรับผู้จัดอบรม / โปรเจกเตอร์
            </p>
          </div>
        </div>

        {/* Presenter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'ปิดเสียงเตือน' : 'เปิดเสียงเตือนเมื่อมีคนตอบ'}
            className={`p-2.5 rounded-xl border transition ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                : 'bg-slate-800/50 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            title="ขยายเต็มหน้าจอโปรเจกเตอร์"
            className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Expand QR Modal */}
          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code ตอบแบบสอบถาม</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/25 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด CSV</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Respondents */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">จำนวนผู้ตอบทั้งหมด</span>
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-white tracking-tight">
                {count}
              </span>
              <span className="text-slate-400 text-sm font-medium">คน</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>อัปเดตแบบเรียลไทม์ทันที</span>
            </div>
          </div>

          {/* Card 2: Grand Average */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">คะแนนเฉลี่ยรวม</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold text-blue-400 tracking-tight">
                {count === 0 ? '0.00' : grandAverage.toFixed(2)}
              </span>
              <span className="text-slate-400 text-sm font-medium">/ 5.00</span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              ค่าเฉลี่ยสถิติจากคำถามทั้ง 5 ด้าน
            </div>
          </div>

          {/* Card 3: Interpretation */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase">ระดับความพึงพอใจ</span>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="mt-1">
              <span
                className={`inline-block text-xl font-bold px-3.5 py-1.5 rounded-xl border ${
                  count === 0
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : `${interpretation.badgeClass}`
                }`}
              >
                {count === 0 ? 'ยังไม่มีข้อมูล' : `${interpretation.emoji} ${interpretation.label}`}
              </span>
            </div>
            <div className="mt-3 text-xs text-slate-400">
              เกณฑ์: {grandAverage >= 4.51 ? '4.51 - 5.00' : grandAverage >= 3.51 ? '3.51 - 4.50' : 'ตามเกณฑ์ 5 ระดับ'}
            </div>
          </div>

          {/* Card 4: Quick QR Scan on Screen */}
          <div className="bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-900/60 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                สแกนเพื่อร่วมประเมิน
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-2">
                ผู้เข้าอบรมสแกน QR Code นี้เพื่อเปิดแบบสอบถามบนมือถือ
              </p>
              <button
                onClick={() => setShowQrModal(true)}
                className="text-xs text-indigo-300 hover:text-white font-semibold underline flex items-center gap-1"
              >
                ขยายใหญ่เต็มจอ &rarr;
              </button>
            </div>
            <div
              onClick={() => setShowQrModal(true)}
              className="bg-white p-2 rounded-2xl shadow-lg shrink-0 cursor-pointer hover:scale-105 transition"
              title="คลิกเพื่อขยาย QR Code"
            >
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="w-18 h-18 sm:w-20 sm:h-20" />
              ) : (
                <div className="w-20 h-20 bg-slate-200 animate-pulse rounded" />
              )}
            </div>
          </div>
        </div>

        {/* Charts and Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Bar Chart: 5 Questions (2 Columns) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  คะแนนเฉลี่ยรายข้อ (สเกล 1 - 5)
                </h2>
                <p className="text-xs text-slate-400">
                  คลิกที่แต่ละแท่งเพื่อดูรายละเอียดการกระจายตัวของคะแนน
                </p>
              </div>
              <div className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto">
                ความพึงพอใจระดับสูง (4-5 ดาว): <strong className="text-emerald-400">{satisfiedPercent}%</strong>
              </div>
            </div>

            {/* Custom High-Contrast Projector Bars */}
            <div className="space-y-4">
              {QUESTIONS.map((q, idx) => {
                const avg = questionAverages[idx];
                const percent = (avg / 5) * 100;
                const isSelected = selectedQuestionIndex === idx;

                // Color based on score
                let barColor = 'from-emerald-500 to-teal-400';
                if (avg < 2.5) barColor = 'from-rose-500 to-red-400';
                else if (avg < 3.5) barColor = 'from-amber-500 to-yellow-400';
                else if (avg < 4.5) barColor = 'from-blue-500 to-cyan-400';

                return (
                  <div
                    key={q.id}
                    onClick={() =>
                      setSelectedQuestionIndex(isSelected ? null : idx)
                    }
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 ring-2 ring-blue-500/30'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-slate-200">
                        {q.title}
                      </span>
                      <div className="flex items-baseline gap-1.5 shrink-0 ml-2">
                        <span className="text-lg font-extrabold text-white">
                          {avg.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-400">/ 5.00</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-700/50">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 shadow-sm`}
                        style={{ width: `${Math.max(percent, count === 0 ? 0 : 4)}%` }}
                      />
                    </div>

                    {/* Score Distribution Breakdown (expanded on click) */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-700/70 grid grid-cols-5 gap-2 text-center text-xs animate-in fade-in duration-200">
                        {getScoreDistribution(idx).map((scoreCount, starIdx) => {
                          const starNum = starIdx + 1;
                          const starPercent =
                            count === 0 ? 0 : Math.round((scoreCount / count) * 100);
                          return (
                            <div
                              key={starNum}
                              className="bg-slate-900/90 p-2 rounded-xl border border-slate-700"
                            >
                              <div className="text-slate-400 text-[10px]">
                                {starNum} ดาว
                              </div>
                              <div className="text-sm font-bold text-white my-0.5">
                                {scoreCount} คน
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {starPercent}%
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Standard Criteria Legend Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="font-semibold text-slate-300">เกณฑ์แปลผลมาตรฐาน:</div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  4.51 - 5.00 (มากที่สุด)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  3.51 - 4.50 (มาก)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  2.51 - 3.50 (ปานกลาง)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  1.51 - 2.50 (น้อย)
                </span>
              </div>
            </div>
          </div>

          {/* Live Feed: Participant Suggestions (1 Column) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">ข้อเสนอแนะล่าสุด</h2>
              </div>
              <span className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                {validSuggestions.length} ข้อความ
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 flex-1">
              {validSuggestions.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้เข้าอบรม
                </div>
              ) : (
                validSuggestions.map((item) => {
                  const avg = (item.ratings.reduce((a, b) => a + b, 0) / 5).toFixed(1);
                  return (
                    <div
                      key={item.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 transition hover:border-slate-700 shadow-sm"
                    >
                      <p className="text-sm text-slate-200 leading-relaxed font-normal">
                        "{item.suggestion}"
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {avg} ดาว
                        </span>
                        <span>{item.createdAt || 'ไม่ระบุเวลา'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Demo / Testing Utilities Bar */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">เครื่องมือสำหรับทดสอบ (Demo Tools):</span>
            <span>จำลองคนตอบเพื่อทดสอบการแสดงผลบนจอ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeed}
              disabled={actionLoading !== null}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>+ เพิ่มข้อมูลตัวอย่าง 5 รายการ</span>
            </button>
            <button
              onClick={handleClear}
              disabled={actionLoading !== null || count === 0}
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 font-medium px-3 py-1.5 rounded-lg border border-slate-700 hover:border-rose-900/50 transition cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างข้อมูลทั้งหมด</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Big QR Code Modal for Projector Screen */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-10 max-w-lg w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white text-2xl font-bold w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center"
            >
              &times;
            </button>

            <span className="inline-block bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              สแกนเพื่อร่วมประเมิน
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              เปิดกล้องมือถือแล้วสแกน QR Code
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              ผู้เข้าอบรมสามารถประเมินได้ทันทีผ่านมือถือ ไม่ต้องดาวน์โหลดแอป และไม่ต้องล็อกอิน
            </p>

            {/* Giant QR Code box */}
            <div className="bg-white p-5 rounded-3xl inline-block shadow-2xl mb-6 mx-auto">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="Survey QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                />
              )}
            </div>

            {/* URL Display with 1-Click Copy */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2.5 rounded-xl max-w-md mx-auto mb-6">
              <span className="text-xs text-slate-400 truncate font-mono text-left flex-1 pl-2">
                {surveyUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3.5 rounded-xl transition cursor-pointer"
            >
              ปิดหน้าต่าง (กลับสู่หน้า Dashboard)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
