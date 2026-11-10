import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS, RATING_SCALE_DESCRIPTIONS, SurveyResponse } from '../types';
import { CheckCircle2, AlertCircle, Send, RefreshCw, Smartphone, Award } from 'lucide-react';

interface SurveyViewProps {
  onSuccessSubmit?: (response: SurveyResponse) => void;
  surveyUrl?: string;
}

const STORAGE_KEY = 'eval_survey_device_submitted';
const DEVICE_ID_KEY = 'eval_survey_client_id';

export default function SurveyView({ onSuccessSubmit, surveyUrl }: SurveyViewProps) {
  const [ratings, setRatings] = useState<(number | null)[]>([null, null, null, null, null]);
  const [suggestion, setSuggestion] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ ratings: number[]; suggestion: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check duplicate submission on mount
  useEffect(() => {
    const isSubmitted = localStorage.getItem(STORAGE_KEY);
    if (isSubmitted) {
      setHasSubmitted(true);
      try {
        const saved = localStorage.getItem('eval_survey_last_data');
        if (saved) setLastSubmission(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSelectScore = (questionIndex: number, score: number) => {
    setRatings((prev) => {
      const next = [...prev];
      next[questionIndex] = score;
      return next;
    });
    setErrorMessage('');
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('eval_survey_last_data');
    setHasSubmitted(false);
    setRatings([null, null, null, null, null]);
    setSuggestion('');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check if all 5 questions are rated
    const unansweredIndex = ratings.findIndex((r) => r === null || r < 1 || r > 5);
    if (unansweredIndex !== -1) {
      setErrorMessage(`กรุณาให้คะแนนข้อที่ ${unansweredIndex + 1} ให้ครบถ้วน`);
      // Scroll to the question
      const el = document.getElementById(`question-card-${unansweredIndex}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);

    let clientId = localStorage.getItem(DEVICE_ID_KEY);
    if (!clientId) {
      clientId = 'dev-' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem(DEVICE_ID_KEY, clientId);
    }

    const payload = {
      ratings: ratings as [number, number, number, number, number],
      suggestion: suggestion.trim(),
      clientId
    };

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }

      const resData = await res.json();
      
      // Save local device submission token
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem('eval_survey_last_data', JSON.stringify({ ratings, suggestion }));
      
      setLastSubmission({ ratings: ratings as number[], suggestion });
      setHasSubmitted(true);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      if (onSuccessSubmit && resData.data) {
        onSuccessSubmit(resData.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ไม่สามารถส่งแบบประเมินได้ โปรดลองอีกครั้ง';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const completedCount = ratings.filter((r) => r !== null).length;
  const progressPercent = (completedCount / 5) * 100;

  if (hasSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            บันทึกข้อมูลเรียบร้อยแล้ว
          </span>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">ขอบพระคุณเป็นอย่างยิ่ง</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            ความคิดเห็นของท่านถูกส่งเข้าสู่ระบบ Dashboard เรียลไทม์แล้ว เพื่อนำไปใช้ปรับปรุงและพัฒนาการจัดอบรมในครั้งต่อไป
          </p>

          {lastSubmission && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> สรุปคะแนนที่คุณส่ง
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center mb-3">
                {lastSubmission.ratings.map((score, i) => (
                  <div key={i} className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-medium">ข้อ {i + 1}</div>
                    <div className="text-base font-bold text-blue-600">{score} ⭐</div>
                  </div>
                ))}
              </div>
              {lastSubmission.suggestion && (
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-700">ข้อเสนอแนะ:</span> "{lastSubmission.suggestion}"
                </div>
              )}
            </div>
          )}

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              * ระบบจำกัดการส่ง 1 ครั้งต่ออุปกรณ์ เพื่อความถูกต้องของสถิติ
            </p>
            <button
              onClick={handleResetForTesting}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium py-1 px-3 rounded-lg hover:bg-blue-50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> สำหรับทดสอบระบบ: ล้างเครื่องเพื่อตอบใหม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-16">
      {/* Mobile Top Header Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-100 mb-3">
            <Smartphone className="w-3.5 h-3.5" /> แบบประเมินสำหรับสมาร์ตโฟน
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-1">
            แบบประเมินความพึงพอใจการอบรม
          </h1>
          <p className="text-xs text-blue-100 leading-relaxed">
            โปรดเลือกให้คะแนนความพึงพอใจตามระดับ 1-5 (ไม่ต้องระบุชื่อผู้ตอบ)
          </p>

          {/* Progress bar */}
          <div className="mt-4 pt-3 border-t border-white/15">
            <div className="flex justify-between text-xs text-blue-100 mb-1.5 font-medium">
              <span>ความคืบหน้า</span>
              <span>ตอบแล้ว {completedCount} / 5 ข้อ</span>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Background decorative circles */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-blue-400/20 blur-lg pointer-events-none" />
      </div>

      {/* Scale Guideline legend */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 mb-6">
        <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
          <span>เกณฑ์ระดับคะแนน (1 - 5)</span>
          <span className="text-[11px] text-slate-400 font-normal">กดเลือกตัวเลขในแต่ละข้อ</span>
        </div>
        <div className="grid grid-cols-5 gap-1 text-center">
          {RATING_SCALE_DESCRIPTIONS.map((item) => (
            <div key={item.score} className="p-1 rounded-lg bg-slate-50 border border-slate-100 text-[11px]">
              <div className="text-sm">{item.emoji}</div>
              <div className="font-bold text-slate-800">{item.score}</div>
              <div className="text-[10px] text-slate-500 truncate">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Survey Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {QUESTIONS.map((q, idx) => {
          const selected = ratings[idx];
          return (
            <div
              key={q.id}
              id={`question-card-${idx}`}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-200 ${
                selected !== null
                  ? 'border-blue-400 shadow-blue-50'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">
                  ข้อ {idx + 1}/5
                </span>
                <span className="text-xs font-medium text-slate-400">{q.category}</span>
              </div>

              <h2 className="text-base font-bold text-slate-800 leading-snug mb-1">
                {q.title}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {q.subtitle}
              </p>

              {/* Big, easy to tap rating buttons (Mobile-first 48px+ touch targets) */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isChecked = selected === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleSelectScore(idx, score)}
                      className={`flex flex-col items-center justify-center py-3.5 rounded-xl font-bold transition-all active:scale-95 touch-manipulation ${
                        isChecked
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-600 ring-offset-2'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-lg leading-none">{score}</span>
                      <span className="text-[10px] font-normal opacity-90 mt-1">
                        {score === 5 ? 'มากสุด' : score === 1 ? 'น้อยสุด' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Suggestion Box */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
          <label htmlFor="user-suggestion" className="block text-base font-bold text-slate-800 mb-1">
            ข้อเสนอแนะเพิ่มเติม <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 mb-3">
            สิ่งที่ท่านประทับใจ หรือสิ่งที่ต้องการให้ผู้จัดอบรมนำไปปรับปรุงในครั้งต่อไป
          </p>
          <textarea
            id="user-suggestion"
            rows={3}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="พิมพ์ความคิดเห็นหรือข้อเสนอแนะของคุณที่นี่..."
            className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-base flex items-center justify-center gap-2 active:scale-98 touch-manipulation cursor-pointer"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>กำลังบันทึกข้อมูล...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>ส่งแบบประเมินความพึงพอใจ</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 pt-1">
          ระบบจะไม่บันทึกข้อมูลส่วนบุคคล • ข้อมูลทั้งหมดจะถูกนำไปประมวลผลเป็นสถิติรวม
        </p>
      </form>
    </div>
  );
}
