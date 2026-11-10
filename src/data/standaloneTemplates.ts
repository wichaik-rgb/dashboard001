export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Firebase App & Database (Compat CDN - ใช้งานง่ายในไฟล์เดียว) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; -webkit-tap-highlight-color: transparent; }
    .rating-btn.active {
      background-color: #2563eb;
      color: #ffffff;
      border-color: #1d4ed8;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
      transform: translateY(-2px);
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-12">

  <!-- Header -->
  <header class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 px-4 shadow-lg sticky top-0 z-20">
    <div class="max-w-md mx-auto text-center">
      <div class="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-2">
        <svg class="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold tracking-tight">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-xs text-blue-100 mt-1">ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาครั้งถัดไป</p>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-md mx-auto px-4 mt-6">

    <!-- Already Submitted Card (Hidden by default) -->
    <div id="already-submitted" class="hidden bg-white rounded-2xl p-6 shadow-md border border-slate-100 text-center">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 class="text-xl font-bold text-slate-800 mb-2">ท่านได้ส่งแบบประเมินเรียบร้อยแล้ว</h2>
      <p class="text-slate-600 text-sm mb-6">ระบบบันทึกความคิดเห็นของท่านแล้ว ขอขอบพระคุณเป็นอย่างสูงสำหรับการร่วมประเมิน</p>
      <button onclick="resetSubmission()" class="text-xs text-blue-600 underline font-medium hover:text-blue-800">
        (สำหรับทดสอบ: ล้างข้อมูลเครื่องเพื่อลองตอบใหม่)
      </button>
    </div>

    <!-- Survey Form -->
    <form id="survey-form" class="space-y-6">
      
      <!-- Guidance Card -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
        <p class="font-semibold mb-1">เกณฑ์การให้คะแนน (สเกล 1 - 5):</p>
        <div class="grid grid-cols-5 gap-1 text-center font-medium mt-2">
          <div class="bg-white/80 py-1 rounded">1 = น้อยสุด</div>
          <div class="bg-white/80 py-1 rounded">2 = น้อย</div>
          <div class="bg-white/80 py-1 rounded">3 = ปานกลาง</div>
          <div class="bg-white/80 py-1 rounded">4 = มาก</div>
          <div class="bg-white/80 py-1 rounded">5 = มากสุด</div>
        </div>
      </div>

      <!-- Question 1 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800 text-base">1. วิทยากรและวิธีการถ่ายทอด</h3>
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">ข้อ 1/5</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">อธิบายชัดเจน ตรงประเด็น บรรยากาศเป็นกันเอง ตอบคำถามเข้าใจง่าย</p>
        <div class="grid grid-cols-5 gap-2 rating-group" data-q="0">
          <button type="button" data-val="1" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">1</button>
          <button type="button" data-val="2" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">2</button>
          <button type="button" data-val="3" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">3</button>
          <button type="button" data-val="4" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">4</button>
          <button type="button" data-val="5" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">5</button>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800 text-base">2. เนื้อหาหลักสูตรและประโยชน์</h3>
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">ข้อ 2/5</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">เนื้อหาทันสมัย ครบถ้วนตามเป้าหมาย มีตัวอย่างชัดเจน</p>
        <div class="grid grid-cols-5 gap-2 rating-group" data-q="1">
          <button type="button" data-val="1" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">1</button>
          <button type="button" data-val="2" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">2</button>
          <button type="button" data-val="3" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">3</button>
          <button type="button" data-val="4" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">4</button>
          <button type="button" data-val="5" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">5</button>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800 text-base">3. การนำความรู้ไปประยุกต์ใช้</h3>
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">ข้อ 3/5</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">สามารถนำความรู้/ทักษะไปปรับใช้กับงานจริงได้ทันที</p>
        <div class="grid grid-cols-5 gap-2 rating-group" data-q="2">
          <button type="button" data-val="1" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">1</button>
          <button type="button" data-val="2" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">2</button>
          <button type="button" data-val="3" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">3</button>
          <button type="button" data-val="4" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">4</button>
          <button type="button" data-val="5" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">5</button>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800 text-base">4. สถานที่ อุปกรณ์ และโสตทัศนูปกรณ์</h3>
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">ข้อ 4/5</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">จอภาพ เครื่องเสียง ความเร็วอินเทอร์เน็ต และบรรยากาศโดยรอบ</p>
        <div class="grid grid-cols-5 gap-2 rating-group" data-q="3">
          <button type="button" data-val="1" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">1</button>
          <button type="button" data-val="2" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">2</button>
          <button type="button" data-val="3" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">3</button>
          <button type="button" data-val="4" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">4</button>
          <button type="button" data-val="5" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">5</button>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div class="flex items-start justify-between mb-2">
          <h3 class="font-semibold text-slate-800 text-base">5. ความพึงพอใจในภาพรวม</h3>
          <span class="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">ข้อ 5/5</span>
        </div>
        <p class="text-xs text-slate-500 mb-4">ความคุ้มค่าและความประทับใจตลอดการฝึกอบรมในวันนี้</p>
        <div class="grid grid-cols-5 gap-2 rating-group" data-q="4">
          <button type="button" data-val="1" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">1</button>
          <button type="button" data-val="2" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">2</button>
          <button type="button" data-val="3" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">3</button>
          <button type="button" data-val="4" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">4</button>
          <button type="button" data-val="5" class="rating-btn border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 text-lg transition active:scale-95">5</button>
        </div>
      </div>

      <!-- Suggestion Box (Optional) -->
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <label for="suggestion" class="block font-semibold text-slate-800 text-base mb-1">
          ข้อเสนอแนะเพิ่มเติม <span class="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
        </label>
        <p class="text-xs text-slate-500 mb-3">สิ่งที่ชื่นชอบ หรืออยากให้ปรับปรุงในครั้งต่อไป</p>
        <textarea id="suggestion" rows="3" class="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="พิมพ์ข้อเสนอแนะหรือความประทับใจที่นี่..."></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submit-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 text-base flex items-center justify-center gap-2 active:scale-98">
        <span>ส่งแบบประเมินความพึงพอใจ</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </button>

      <p id="error-msg" class="text-center text-xs text-rose-500 font-medium hidden">กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่ง</p>
    </form>

  </main>

  <script>
    // -------------------------------------------------------------
    // 1. กำหนดค่าคอนฟิก Firebase Realtime Database ของคุณ
    // (คัดลอกจาก Firebase Console > Project settings)
    // -------------------------------------------------------------
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // เริ่มต้น Firebase (ตรวจสอบเพื่อไม่ให้ error หากยังไม่ได้ใส่ config)
    let db = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
      }
    } catch (e) {
      console.warn("Firebase not configured yet:", e);
    }

    // เก็บค่าคะแนน 5 ข้อ [q0, q1, q2, q3, q4]
    const selectedRatings = [null, null, null, null, null];

    // ตรวจสอบการตอบซ้ำจาก LocalStorage
    const SUBMIT_KEY = 'training_eval_submitted_v1';
    function checkDuplicate() {
      if (localStorage.getItem(SUBMIT_KEY)) {
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('already-submitted').classList.remove('hidden');
      }
    }
    checkDuplicate();

    function resetSubmission() {
      localStorage.removeItem(SUBMIT_KEY);
      location.reload();
    }

    // จัดการการกดปุ่มสเกลคะแนน
    document.querySelectorAll('.rating-group').forEach(group => {
      const qIndex = parseInt(group.dataset.q, 10);
      const buttons = group.querySelectorAll('.rating-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedRatings[qIndex] = parseInt(btn.dataset.val, 10);
          document.getElementById('error-msg').classList.add('hidden');
        });
      });
    });

    // ส่งฟอร์ม
    document.getElementById('survey-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // ตรวจสอบว่าเลือกครบทั้ง 5 ข้อ
      const allSelected = selectedRatings.every(r => r !== null && r >= 1 && r <= 5);
      if (!allSelected) {
        const errorEl = document.getElementById('error-msg');
        errorEl.classList.remove('hidden');
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const suggestion = document.getElementById('suggestion').value.trim();
      const submitBtn = document.getElementById('submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'กำลังบันทึกข้อมูล...';

      const payload = {
        timestamp: Date.now(),
        createdAt: new Date().toLocaleString('th-TH'),
        ratings: selectedRatings,
        suggestion: suggestion
      };

      try {
        if (db) {
          // บันทึกลง Firebase Realtime Database ที่โหนด 'responses'
          await db.ref('responses').push(payload);
        } else {
          // Fallback ในกรณีทดสอบแบบ Local
          console.log('Submitted payload (Demo Mode):', payload);
          // หากรันบนเซิร์ฟเวอร์ Express ให้ส่ง API ไปด้วย
          try {
            await fetch('/api/responses', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
          } catch(err){}
        }

        // บันทึกป้องกันการตอบซ้ำในอุปกรณ์นี้
        localStorage.setItem(SUBMIT_KEY, 'true');

        // แสดงหน้าสำเร็จ
        document.getElementById('survey-form').classList.add('hidden');
        document.getElementById('already-submitted').classList.remove('hidden');

      } catch (err) {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'ส่งแบบประเมินความพึงพอใจ';
      }
    });
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard ผลการประเมินความพึงพอใจ (Real-time)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <!-- Chart.js สำหรับกราฟสวยงาม -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- QRCode.js สำหรับสร้าง QR Code ให้ผู้เข้าอบรมสแกน -->
  <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
  <!-- Firebase App & Database (Compat CDN) -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .pulse-dot {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .4; transform: scale(1.15); }
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">

  <!-- Top Bar สำหรับ Projector -->
  <header class="bg-slate-800/90 border-b border-slate-700/80 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-emerald-400 pulse-dot"></div>
        <div>
          <h1 class="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            📊 Live Dashboard ผลการประเมินความพึงพอใจ
            <span class="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-normal">เรียลไทม์</span>
          </h1>
          <p class="text-xs text-slate-400">อัปเดตผลทันทีเมื่อมีผู้ส่งแบบประเมิน • ไม่ต้องรีเฟรชหน้าจอ</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <button onclick="toggleQRModal()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
          <span>QR Code ตอบแบบสอบถาม</span>
        </button>
        <button onclick="exportToCSV()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition shadow">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          <span>ดาวน์โหลด CSV</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Content Grid -->
  <main class="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

    <!-- KPI Highlight Cards (ขนาดใหญ่ มองเห็นชัดบนโปรเจกเตอร์) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      <!-- Total Respondents -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div class="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">จำนวนผู้ตอบทั้งหมด</div>
        <div class="flex items-baseline gap-2">
          <span id="kpi-count" class="text-4xl md:text-5xl font-extrabold text-white">0</span>
          <span class="text-slate-400 text-sm">คน</span>
        </div>
        <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400"></span> Live Listener Active
        </div>
      </div>

      <!-- Overall Average -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div class="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">คะแนนเฉลี่ยรวม (เต็ม 5)</div>
        <div class="flex items-baseline gap-2">
          <span id="kpi-avg" class="text-4xl md:text-5xl font-extrabold text-blue-400">0.00</span>
          <span class="text-slate-400 text-sm">/ 5.00</span>
        </div>
        <div class="text-xs text-slate-400 mt-2">คำนวณจากทุกข้อรวมกัน</div>
      </div>

      <!-- Interpretation Level -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div class="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">การแปลผลความพึงพอใจ</div>
        <div class="mt-1">
          <span id="kpi-level" class="inline-block text-xl md:text-2xl font-bold px-3 py-1 rounded-xl bg-slate-700 text-slate-300">
            -
          </span>
        </div>
        <div id="kpi-range" class="text-xs text-slate-400 mt-2">เกณฑ์มาตรฐาน 5 ระดับ</div>
      </div>

      <!-- QR Quick Box -->
      <div class="bg-gradient-to-br from-indigo-900/60 to-slate-800 border border-indigo-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <div class="text-indigo-300 text-xs font-bold uppercase mb-1">สแกนเพื่อตอบ</div>
          <div class="text-xs text-slate-300">เปิดกล้องมือถือสแกนเพื่อร่วมทำแบบประเมิน</div>
        </div>
        <div id="mini-qrcode" class="bg-white p-1.5 rounded-xl shadow shrink-0"></div>
      </div>

    </div>

    <!-- Charts & Feed Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Bar Chart (2 Cols) -->
      <div class="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            📈 ค่าเฉลี่ยความพึงพอใจรายข้อ (สเกล 1 - 5)
          </h2>
          <span class="text-xs text-slate-400">คะแนนเต็ม 5.00</span>
        </div>
        <div class="relative h-72 md:h-80 w-full">
          <canvas id="ratingsChart"></canvas>
        </div>
      </div>

      <!-- Live Suggestions Stream (1 Col) -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            💬 ข้อเสนอแนะล่าสุด
          </h2>
          <span id="suggestion-count-badge" class="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">0 ข้อความ</span>
        </div>
        
        <div id="suggestions-list" class="space-y-3 overflow-y-auto max-h-[320px] pr-1 flex-1">
          <div class="text-center text-slate-500 text-sm py-12">ยังไม่มีข้อเสนอแนะเพิ่มเติม</div>
        </div>
      </div>

    </div>

    <!-- Rating Standard Criteria Reference -->
    <div class="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-xs text-slate-300">
      <span class="font-bold text-white">เกณฑ์การแปลผลคะแนนเฉลี่ย:</span>
      <span class="inline-block mx-2 text-emerald-400">4.51 - 5.00 มากที่สุด</span> |
      <span class="inline-block mx-2 text-cyan-400">3.51 - 4.50 มาก</span> |
      <span class="inline-block mx-2 text-amber-400">2.51 - 3.50 ปานกลาง</span> |
      <span class="inline-block mx-2 text-orange-400">1.51 - 2.50 น้อย</span> |
      <span class="inline-block mx-2 text-rose-400">1.00 - 1.50 น้อยที่สุด</span>
    </div>

  </main>

  <!-- Big QR Code Modal (เหมาะกับเปิดบนจอโปรเจกเตอร์ให้คนทั้งห้องสแกน) -->
  <div id="qr-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
      <button onclick="toggleQRModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-2xl font-bold">&times;</button>
      <div class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">สแกนเพื่อร่วมประเมิน</div>
      <h3 class="text-2xl font-bold text-slate-800 mb-2">เปิดกล้องมือถือแล้วสแกน</h3>
      <p class="text-sm text-slate-500 mb-6">ผู้เข้าร่วมอบรมสามารถตอบแบบประเมินได้ทันทีโดยไม่ต้องล็อกอิน</p>
      
      <div class="flex justify-center mb-6">
        <div id="big-qrcode" class="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-inner inline-block"></div>
      </div>

      <div class="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 break-all font-mono mb-4" id="modal-url-display">
        -
      </div>

      <button onclick="toggleQRModal()" class="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 rounded-xl transition">
        ปิดหน้าต่าง
      </button>
    </div>
  </div>

  <script>
    // -------------------------------------------------------------
    // 1. คอนฟิก Firebase Realtime Database
    // -------------------------------------------------------------
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];
    const questionTitles = [
      '1. วิทยากร/การถ่ายทอด',
      '2. เนื้อหา/ประโยชน์',
      '3. การนำไปใช้จริง',
      '4. สถานที่/อุปกรณ์',
      '5. ภาพรวมการอบรม'
    ];

    // สร้าง QR Code สำหรับหน้า Dashboard
    const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
    document.getElementById('modal-url-display').innerText = surveyUrl;

    new QRCode(document.getElementById("mini-qrcode"), {
      text: surveyUrl,
      width: 68,
      height: 68,
      colorDark : "#0f172a",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.M
    });

    new QRCode(document.getElementById("big-qrcode"), {
      text: surveyUrl,
      width: 220,
      height: 220,
      colorDark : "#0f172a",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });

    function toggleQRModal() {
      const modal = document.getElementById('qr-modal');
      modal.classList.toggle('hidden');
    }

    // สร้าง Chart.js Bar Chart
    const ctx = document.getElementById('ratingsChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: questionTitles,
        datasets: [{
          label: 'คะแนนเฉลี่ย',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(59, 130, 246, 0.85)',
            'rgba(14, 165, 233, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(139, 92, 246, 0.85)'
          ],
          borderColor: [
            '#2563eb', '#0284c7', '#059669', '#d97706', '#7c3aed'
          ],
          borderWidth: 1.5,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => \`คะแนนเฉลี่ย: \${ctx.raw.toFixed(2)} / 5.00\`
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
              color: '#94a3b8',
              font: { family: 'Prompt', size: 12 }
            },
            grid: { color: 'rgba(51, 65, 85, 0.5)' }
          },
          x: {
            ticks: {
              color: '#cbd5e1',
              font: { family: 'Prompt', size: 11 }
            },
            grid: { display: false }
          }
        }
      }
    });

    // ฟังก์ชันคำนวณและแปลผล
    function getInterpretation(score) {
      if (score >= 4.51) return { text: 'มากที่สุด 🌟', class: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' };
      if (score >= 3.51) return { text: 'มาก 👍', class: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' };
      if (score >= 2.51) return { text: 'ปานกลาง 👌', class: 'bg-amber-500/20 text-amber-300 border border-amber-500/30' };
      if (score >= 1.51) return { text: 'น้อย ⚠️', class: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' };
      return { text: 'น้อยที่สุด ❗', class: 'bg-rose-500/20 text-rose-300 border border-rose-500/30' };
    }

    // ประมวลผลข้อมูลใหม่ทุกครั้งที่ได้รับข้อมูล
    function renderData(dataList) {
      allResponses = dataList;
      const count = dataList.length;
      document.getElementById('kpi-count').innerText = count;

      if (count === 0) {
        document.getElementById('kpi-avg').innerText = '0.00';
        document.getElementById('kpi-level').innerText = 'ยังไม่มีข้อมูล';
        document.getElementById('kpi-level').className = 'inline-block text-xl font-bold px-3 py-1 rounded-xl bg-slate-700 text-slate-400';
        chart.data.datasets[0].data = [0, 0, 0, 0, 0];
        chart.update();
        return;
      }

      // คำนวณค่าเฉลี่ยรายข้อ 5 ข้อ
      const sumPerQ = [0, 0, 0, 0, 0];
      dataList.forEach(item => {
        if (Array.isArray(item.ratings)) {
          item.ratings.forEach((val, i) => {
            if (i < 5) sumPerQ[i] += Number(val) || 0;
          });
        }
      });

      const avgPerQ = sumPerQ.map(s => Number((s / count).toFixed(2)));
      const grandAvg = Number((avgPerQ.reduce((a, b) => a + b, 0) / 5).toFixed(2));

      // อัปเดตกราฟ
      chart.data.datasets[0].data = avgPerQ;
      chart.update();

      // อัปเดต KPI Cards
      document.getElementById('kpi-avg').innerText = grandAvg.toFixed(2);
      const levelInfo = getInterpretation(grandAvg);
      const levelEl = document.getElementById('kpi-level');
      levelEl.innerText = levelInfo.text;
      levelEl.className = 'inline-block text-xl md:text-2xl font-bold px-3 py-1 rounded-xl ' + levelInfo.class;

      // อัปเดตรายการข้อเสนอแนะล่าสุด
      const suggestionsContainer = document.getElementById('suggestions-list');
      const validSuggestions = dataList.filter(d => d.suggestion && d.suggestion.trim() !== '');
      document.getElementById('suggestion-count-badge').innerText = validSuggestions.length + ' ข้อความ';

      if (validSuggestions.length === 0) {
        suggestionsContainer.innerHTML = '<div class="text-center text-slate-500 text-sm py-12">ยังไม่มีข้อเสนอแนะเพิ่มเติม</div>';
      } else {
        suggestionsContainer.innerHTML = validSuggestions.slice().reverse().map(item => \`
          <div class="bg-slate-700/60 border border-slate-600/60 rounded-xl p-3 text-sm">
            <p class="text-slate-200 leading-relaxed">\${item.suggestion.replace(/</g, "&lt;")}</p>
            <div class="text-[11px] text-slate-400 mt-2 flex justify-between">
              <span>คะแนนเฉลี่ยผู้ตอบ: \${(item.ratings.reduce((a,b)=>a+b,0)/5).toFixed(1)} ⭐</span>
              <span>\${item.createdAt || 'ไม่ระบุเวลา'}</span>
            </div>
          </div>
        \`).join('');
      }
    }

    // -------------------------------------------------------------
    // เชื่อมต่อ Firebase Realtime Database แบบ Real-time
    // -------------------------------------------------------------
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        // Listener ทำงานทันทีที่มีข้อมูลเพิ่มหรือเปลี่ยนแปลง
        db.ref('responses').on('value', (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
            renderData(list);
          } else {
            renderData([]);
          }
        });
      } else {
        // Fallback: ดึงจาก API หรือ Mock
        console.log("Firebase not configured. Listening to local backend stream...");
        const evt = new EventSource('/api/stream');
        evt.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.responses) renderData(data.responses);
          } catch(err){}
        };
      }
    } catch(err) {
      console.error(err);
    }

    // -------------------------------------------------------------
    // ฟังก์ชันดาวน์โหลดผลการประเมินเป็นไฟล์ CSV (รองรับภาษาไทย)
    // -------------------------------------------------------------
    function exportToCSV() {
      if (!allResponses || allResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }

      const headers = ['ลำดับ', 'วันเวลาที่ตอบ', 'ข้อ 1 (วิทยากร)', 'ข้อ 2 (เนื้อหา)', 'ข้อ 3 (การนำไปใช้)', 'ข้อ 4 (สถานที่/อุปกรณ์)', 'ข้อ 5 (ภาพรวม)', 'เฉลี่ยรายบุคคล', 'ข้อเสนอแนะ'];
      const rows = allResponses.map((item, idx) => {
        const r = item.ratings || [0,0,0,0,0];
        const avg = (r.reduce((a,b) => a+b, 0) / 5).toFixed(2);
        const cleanSugg = (item.suggestion || '').replace(/"/g, '""');
        return [
          idx + 1,
          \`"\${item.createdAt || ''}"\`,
          r[0], r[1], r[2], r[3], r[4],
          avg,
          \`"\${cleanSugg}"\`
        ].join(',');
      });

      // รวมหัวตารางและ BOM (\\uFEFF) เพื่อให้เปิดใน Microsoft Excel ภาษาไทยได้ไม่เพี้ยน
      const csvContent = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', \`training_evaluation_\${new Date().toISOString().slice(0,10)}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  </script>
</body>
</html>`;

export const FIREBASE_SETUP_GUIDE_MD = `# คู่มือการตั้งค่า Firebase Realtime Database และ Deploy ทีละขั้นตอน (100% ฟรี)

ระบบนี้ออกแบบมาเพื่อใช้งานร่วมกับ **Firebase Realtime Database (Spark Plan - ฟรีตลอดชีพ)** ทำให้เมื่อผู้เข้าอบรมกดส่งแบบประเมินจากสมาร์ตโฟน ผลจะเด้งขึ้นหน้าจอ Dashboard บนโปรเจกเตอร์ของผู้จัดอบรมทันทีโดยไม่ต้องรีเฟรช

---

## ขั้นตอนที่ 1: สร้าง Firebase Project (ฟรี)
1. เข้าไปที่ [Firebase Console](https://console.firebase.google.com/) แล้วเข้าสู่ระบบด้วยบัญชี Google
2. คลิกปุ่ม **"Add project"** (เพิ่มโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น \`training-survey-2026\`
4. ในส่วน Google Analytics สามารถเลือก **Disable** หรือ Enable ก็ได้ จากนั้นกด **Create Project**
5. รอสักครู่จนโปรเจกต์สร้างเสร็จ แล้วกด **Continue**

---

## ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database
1. ในแถบเมนูด้านซ้าย เลือก **Build** > **Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. เลือกตำแหน่งเซิร์ฟเวอร์ (Realtime Database Location):
   - แนะนำเลือก **Singapore (asia-southeast1)** เพื่อความรวดเร็วสูงสุดสำหรับผู้ใช้งานในประเทศไทย
4. ในหน้า Security Rules เลือก **"Start in test mode"** แล้วกด **Enable**

---

## ขั้นตอนที่ 3: ตั้งค่าความปลอดภัย Security Rules (ให้ผู้ประเมินส่งข้อมูลได้โดยไม่ต้องล็อกอิน)
1. คลิกแท็บ **"Rules"** ที่ด้านบนของ Realtime Database
2. แก้ไขโค้ด Rules เป็นดังนี้ (อนุญาตให้อ่านและบันทึกข้อมูลโหนด \`responses\` ได้อย่างปลอดภัย):

\`\`\`json
{
  "rules": {
    "responses": {
      ".read": true,
      ".write": true,
      "$response_id": {
        ".validate": "newData.hasChildren(['ratings', 'timestamp'])"
      }
    }
  }
}
\`\`\`

3. คลิกปุ่ม **"Publish"** (เผยแพร่)

---

## ขั้นตอนที่ 4: คัดลอก Firebase Config มาใส่ในโค้ด
1. ไปที่เมนูรูปเฟือง **Project Settings** (การตั้งค่าโปรเจกต์) มุมซ้ายบน
2. เลื่อนลงมาล่างสุดที่หัวข้อ **"Your apps"** แล้วคลิกไอคอนเว็บ **</>** (Web App)
3. ตั้งชื่อแอป เช่น \`Evaluation Web App\` แล้วกด **Register app**
4. คุณจะเห็นโค้ดคอนฟิก \`firebaseConfig\` หน้าตาประมาณนี้:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "training-survey-xxxx.firebaseapp.com",
  databaseURL: "https://training-survey-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-survey-xxxx",
  storageBucket: "training-survey-xxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxx"
};
\`\`\`

5. คัดลอกค่าคอนฟิกนี้ไปแทนที่ในไฟล์:
   - \`survey.html\` (บรรทัดที่กำหนด \`firebaseConfig\`)
   - \`dashboard.html\` (บรรทัดที่กำหนด \`firebaseConfig\`)

---

## ขั้นตอนที่ 5: วิธีนำขึ้นใช้งาน (Deploy ฟรี 3 วิธีเลือกได้ตามสะดวก)

### วิธีที่ ก: ใช้งานบน GitHub Pages (แนะนำ ง่ายและเร็วที่สุด)
1. สร้าง GitHub Repository ใหม่ (เช่น \`training-evaluation\`)
2. อัปโหลด 2 ไฟล์: \`survey.html\` และ \`dashboard.html\`
3. ไปที่ **Settings** > **Pages**
4. ในหัวข้อ **Branch** เลือก \`main\` โฟลเดอร์ \`/(root)\` แล้วกด **Save**
5. คุณจะได้ URL เช่น:
   - หน้าผู้เข้าอบรม: \`https://username.github.io/training-evaluation/survey.html\`
   - หน้าขึ้นจอโปรเจกเตอร์: \`https://username.github.io/training-evaluation/dashboard.html\`

### วิธีที่ ข: ใช้งานผ่าน Firebase Hosting (ฟรีในตัว)
1. ติดตั้ง Firebase CLI: \`npm install -g firebase-tools\`
2. สั่งคำสั่ง:
   \`firebase login\`
   \`firebase init hosting\`
   \`firebase deploy\`

### วิธีที่ ค: Drag & Drop บน Netlify / Vercel
1. ใส่ไฟล์ทั้งสองไว้ในโฟลเดอร์เดียวกัน
2. ลากโฟลเดอร์ไปวางที่ [Netlify Drop](https://app.netlify.com/drop) เพื่อรับ URL ใช้งานได้ทันทีใน 10 วินาที

---

## ขั้นตอนการใช้งานจริงในวันอบรม
1. ผู้จัดอบรมเปิดหน้า **\`dashboard.html\`** บนเครื่องคอมพิวเตอร์ที่ต่อเข้าจอโปรเจกเตอร์
2. กดปุ่ม **"QR Code ตอบแบบสอบถาม"** ขึ้นจอขนาดใหญ่
3. ผู้เข้าร่วมอบรมเปิดกล้องสมาร์ตโฟนสแกน QR Code เพื่อเปิดหน้า **\`survey.html\`** และตอบแบบประเมิน 5 ข้อ
4. กราฟแท่งและตัวเลขค่าเฉลี่ยบนจอ Dashboard จะขยับขึ้นทันทีแบบ Real-time ตามที่มีคนส่ง
5. เมื่องานอบรมเสร็จสิ้น ผู้จัดคลิกปุ่ม **"ดาวน์โหลด CSV"** เพื่อนำไฟล์สถิติไปจัดทำรายงานสรุปใน Excel ได้ทันที!
`;
