import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const leadsPath = path.join(__dirname, 'data', 'leads.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

async function ensureLeadsFile() {
  try {
    await fs.access(leadsPath);
  } catch (_) {
    await fs.writeFile(leadsPath, JSON.stringify([], null, 2), 'utf8');
  }
}

async function appendLead(lead) {
  await ensureLeadsFile();
  let existing = [];

  try {
    const raw = await fs.readFile(leadsPath, 'utf8');
    existing = JSON.parse(raw);
    if (!Array.isArray(existing)) {
      existing = [];
    }
  } catch (error) {
    existing = [];
  }

  existing.push(lead);
  await fs.writeFile(leadsPath, JSON.stringify(existing, null, 2), 'utf8');
}

app.post('/api/leads', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    state,
    diabetesType,
    insuranceProvider,
    physician,
    supplyNeeds,
    coverageStart,
    contactMethod,
    notes
  } = req.body;

  if (!firstName || !lastName || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, email, and phone so we can follow up quickly.'
    });
  }

  const leadRecord = {
    firstName,
    lastName,
    email,
    phone,
    state: state || '',
    diabetesType: diabetesType || '',
    insuranceProvider: insuranceProvider || '',
    physician: physician || '',
    supplyNeeds: Array.isArray(supplyNeeds) ? supplyNeeds : supplyNeeds ? [supplyNeeds] : [],
    coverageStart: coverageStart || '',
    contactMethod: contactMethod || '',
    notes: notes || '',
    submittedAt: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || ''
  };

  try {
    await appendLead(leadRecord);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({
      success: false,
      message: 'We hit a snag saving your details. Please try again in a moment.'
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`America's Affordable Medical lead funnel listening on port ${PORT}`);
});

