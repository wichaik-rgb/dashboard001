export interface SurveyQuestion {
  id: number;
  title: string;
  subtitle: string;
  category: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  createdAt: string;
  ratings: [number, number, number, number, number];
  suggestion: string;
  clientId?: string;
}

export interface RatingInterpretation {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeClass: string;
  emoji: string;
}

export const QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    title: '1. ความรู้ความเชี่ยวชาญและการถ่ายทอดของวิทยากร',
    subtitle: 'อธิบายชัดเจน เข้าใจง่าย ตอบข้อซักถามได้ตรงประเด็น',
    category: 'วิทยากร'
  },
  {
    id: 2,
    title: '2. ความเหมาะสมและประโยชน์ของเนื้อหาหลักสูตร',
    subtitle: 'เนื้อหาทันสมัย ตรงตามวัตถุประสงค์ ลำดับเนื้อหากระชับ',
    category: 'เนื้อหา'
  },
  {
    id: 3,
    title: '3. ความสามารถในการนำความรู้ไปประยุกต์ใช้งานจริง',
    subtitle: 'สามารถนำแนวคิด/ทักษะไปต่อยอดในงานหรือชีวิตประจำวันได้',
    category: 'การประยุกต์ใช้'
  },
  {
    id: 4,
    title: '4. ความเหมาะสมของสถานที่ อุปกรณ์ และโสตทัศนูปกรณ์',
    subtitle: 'สัญญาณภาพ เสียง บรรยากาศ และสิ่งอำนวยความสะดวก',
    category: 'สถานที่/ระบบ'
  },
  {
    id: 5,
    title: '5. ความพึงพอใจในภาพรวมของการจัดอบรมในครั้งนี้',
    subtitle: 'ความคุ้มค่าและความประทับใจโดยรวมต่อการฝึกอบรม',
    category: 'ภาพรวม'
  }
];

export const RATING_SCALE_DESCRIPTIONS = [
  { score: 5, label: 'มากที่สุด', emoji: '🤩', sub: 'ดีเยี่ยม / เกินความคาดหวัง' },
  { score: 4, label: 'มาก', emoji: '😊', sub: 'ดี / บรรลุตามเป้าหมาย' },
  { score: 3, label: 'ปานกลาง', emoji: '😐', sub: 'พอใช้ / เหมาะสมมาตรฐาน' },
  { score: 2, label: 'น้อย', emoji: '🙁', sub: 'ควรปรับปรุงบางจุด' },
  { score: 1, label: 'น้อยที่สุด', emoji: '😞', sub: 'ไม่ตรงตามที่คาดหวัง' }
];

export function getInterpretation(score: number): RatingInterpretation {
  if (score >= 4.51) {
    return {
      label: 'มากที่สุด (ดีเยี่ยม)',
      emoji: '🌟',
      color: '#10b981',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
  }
  if (score >= 3.51) {
    return {
      label: 'มาก (ระดับดี)',
      emoji: '👍',
      color: '#06b6d4',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      textColor: 'text-cyan-700',
      badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    };
  }
  if (score >= 2.51) {
    return {
      label: 'ปานกลาง (พอใช้)',
      emoji: '👌',
      color: '#f59e0b',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-700',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300'
    };
  }
  if (score >= 1.51) {
    return {
      label: 'น้อย (ควรปรับปรุง)',
      emoji: '⚠️',
      color: '#f97316',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300'
    };
  }
  return {
    label: 'น้อยที่สุด (ต้องเร่งแก้ไข)',
    emoji: '❗',
    color: '#ef4444',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-300'
  };
}
