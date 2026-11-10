import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SurveySubmission {
  id: string;
  timestamp: number;
  createdAt: string;
  ratings: [number, number, number, number, number];
  suggestion: string;
  clientId?: string;
}

// In-memory responses store
let responses: SurveySubmission[] = [
  {
    id: 'demo-1',
    timestamp: Date.now() - 1000 * 60 * 25,
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toLocaleString('th-TH'),
    ratings: [5, 5, 4, 5, 5],
    suggestion: 'วิทยากรอธิบายเข้าใจง่ายมาก มีกรณีศึกษาให้เห็นภาพชัดเจน',
    clientId: 'seed-1'
  },
  {
    id: 'demo-2',
    timestamp: Date.now() - 1000 * 60 * 18,
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toLocaleString('th-TH'),
    ratings: [5, 4, 5, 4, 5],
    suggestion: 'เนื้อหาเข้มข้น นำกลับไปใช้ปรับปรุงงานในแผนกได้จริงครับ',
    clientId: 'seed-2'
  },
  {
    id: 'demo-3',
    timestamp: Date.now() - 1000 * 60 * 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toLocaleString('th-TH'),
    ratings: [4, 4, 4, 3, 4],
    suggestion: 'ห้องอบรมแอร์ค่อนข้างเย็นนิดหน่อย แต่การบรรยายยอดเยี่ยมมากครับ',
    clientId: 'seed-3'
  },
  {
    id: 'demo-4',
    timestamp: Date.now() - 1000 * 60 * 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toLocaleString('th-TH'),
    ratings: [5, 5, 5, 4, 5],
    suggestion: 'อยากให้จัดหลักสูตรขั้นสูง (Advanced) ต่อเนื่องอีกรอบค่ะ',
    clientId: 'seed-4'
  }
];

// Active SSE client response handles
const sseClients = new Set<express.Response>();

function broadcastUpdate() {
  const payload = JSON.stringify({
    type: 'UPDATE',
    responses,
    count: responses.length,
    timestamp: Date.now()
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API endpoints
  app.get('/api/responses', (_req, res) => {
    res.json({
      success: true,
      data: responses,
      count: responses.length
    });
  });

  app.post('/api/responses', (req, res) => {
    const { ratings, suggestion, clientId } = req.body;

    if (!Array.isArray(ratings) || ratings.length !== 5) {
      return res.status(400).json({ error: 'ratings must be an array of 5 numbers' });
    }

    const isValid = ratings.every((r) => typeof r === 'number' && r >= 1 && r <= 5);
    if (!isValid) {
      return res.status(400).json({ error: 'each rating must be between 1 and 5' });
    }

    // Check duplicate clientId if provided
    if (clientId) {
      const alreadySubmitted = responses.some((r) => r.clientId === clientId);
      if (alreadySubmitted) {
        return res.status(409).json({ error: 'คุณได้ส่งแบบประเมินจากเครื่องนี้ไปแล้ว' });
      }
    }

    const newResponse: SurveySubmission = {
      id: 'resp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      createdAt: new Date().toLocaleString('th-TH'),
      ratings: ratings as [number, number, number, number, number],
      suggestion: typeof suggestion === 'string' ? suggestion.trim().slice(0, 1000) : '',
      clientId: clientId || undefined
    };

    responses.unshift(newResponse);
    broadcastUpdate();

    res.json({ success: true, data: newResponse });
  });

  // SSE Stream
  app.get('/api/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send initial snapshot
    res.write(`data: ${JSON.stringify({ type: 'INIT', responses, count: responses.length })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  // Reset or clear responses
  app.delete('/api/responses', (_req, res) => {
    responses = [];
    broadcastUpdate();
    res.json({ success: true, message: 'ล้างข้อมูลเรียบร้อย' });
  });

  // Seed responses for demonstration
  app.post('/api/seed', (req, res) => {
    const sampleSuggestions = [
      'วิทยากรถ่ายทอดได้เข้าใจง่าย สนุก ไม่น่าเบื่อเลย',
      'เนื้อหามีประโยชน์มาก นำไปปรับใช้กับการทำงานได้จริง',
      'อยากให้มีเวลาทำ Workshop เพิ่มขึ้นอีกนิดครับ',
      'การจัดสถานที่ โสตทัศนูปกรณ์ และอาหารว่างดีมาก',
      'มีตัวอย่างประกอบชัดเจน คุ้มค่าที่ได้มาเข้าร่วม',
      'เอกสารประกอบการบรรยายทำมาดีมาก อ่านทบทวนได้ง่าย',
      'ประทับใจการตอบคำถามของวิทยากร อธิบายละเอียดและตรงประเด็น',
      'อยากให้เปิดคอร์สต่อเนื่องในหัวข้ออื่นๆ อีก'
    ];

    const count = Number(req.body.count) || 10;
    const newItems: SurveySubmission[] = [];

    for (let i = 0; i < count; i++) {
      // Generate realistic high ratings for training evaluation (mostly 4-5)
      const r1 = Math.min(5, Math.max(3, Math.floor(4 + Math.random() * 1.5)));
      const r2 = Math.min(5, Math.max(3, Math.floor(4 + Math.random() * 1.5)));
      const r3 = Math.min(5, Math.max(3, Math.floor(4 + Math.random() * 1.5)));
      const r4 = Math.min(5, Math.max(2, Math.floor(3.8 + Math.random() * 1.6)));
      const r5 = Math.min(5, Math.max(3, Math.floor(4.2 + Math.random() * 1.4)));
      const hasSuggestion = Math.random() > 0.4;

      const offsetMinutes = Math.floor(Math.random() * 45) + 1;
      newItems.push({
        id: 'seed-' + Date.now() + '-' + i,
        timestamp: Date.now() - offsetMinutes * 60 * 1000,
        createdAt: new Date(Date.now() - offsetMinutes * 60 * 1000).toLocaleString('th-TH'),
        ratings: [r1, r2, r3, r4, r5],
        suggestion: hasSuggestion ? sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)] : '',
        clientId: 'seed-' + Math.random().toString(36).substring(2, 9)
      });
    }

    responses = [...newItems, ...responses];
    broadcastUpdate();
    res.json({ success: true, count: responses.length });
  });

  // Mount Vite development middlewares in dev
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
