import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { AMR_DATASET } from './src/data/amrData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // API Route: Get all antibiotics dataset
  app.get('/api/antibiotics', (_req, res) => {
    res.json(AMR_DATASET);
  });

  // API Route: Lookup antibiotic by query (name, brand, class, organism)
  app.get('/api/antibiotics/search', (req, res) => {
    const q = (req.query.q as string || '').trim().toLowerCase();
    if (!q) {
      return res.json(AMR_DATASET);
    }
    const matches = AMR_DATASET.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.nameMr.includes(q) ||
        item.drugClass.toLowerCase().includes(q) ||
        item.microorganism.toLowerCase().includes(q) ||
        item.brandNames.some((b) => b.toLowerCase().includes(q)) ||
        item.alternativeAntibioticsRaw.toLowerCase().includes(q) ||
        item.resistanceGenes.toLowerCase().includes(q)
      );
    });
    return res.json(matches);
  });

  // API Route: AI-Assisted Clinical Guidance (using Server-Side Gemini API Key)
  app.post('/api/ai-clinical-guidance', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY is not configured in environment secrets.'
        });
      }

      const { antibioticName, clinicalQuestion, language = 'en' } = req.body;
      const drug = AMR_DATASET.find(
        (d) => d.name.toLowerCase() === (antibioticName || '').trim().toLowerCase()
      );

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an expert infectious disease clinical pharmacologist and Antimicrobial Stewardship (AMS) consultant.
You provide precise, evidence-based antimicrobial clinical guidance based on the user's AMR dataset and international WHO/CLSI guidelines.
Dataset record for this drug:
Name: ${drug?.name || antibioticName}
Class: ${drug?.drugClass || 'Unknown'}
Microorganism in Dataset: ${drug?.microorganism || 'Unknown'}
Documented Resistance Genes: ${drug?.resistanceGenes || 'Unknown'}
Documented Alternative Antibiotics: ${drug?.alternativeAntibioticsRaw || 'Unknown'}
Surveillance Resistance Cases: ${drug?.resistanceCases ? drug.resistanceCases.toLocaleString() : 'Under active surveillance'}
Diagnostic Test: ${drug?.diagnosticTest || 'Disc Diffusion'}

Respond clearly and clinically.
If the requested language is 'mr' (Marathi), provide the answer in Marathi (मराठी) with English drug names in brackets.
If 'en', provide the answer in concise, professional English.`;

      const prompt = `Question/Clinical Scenario: ${clinicalQuestion}
Target Antibiotic: ${antibioticName || 'General Antimicrobial Query'}
Explain potential resistance mechanisms, therapeutic alternatives from the dataset, and stewardship recommendations.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      return res.json({
        success: true,
        guidance: response.text,
      });
    } catch (err: any) {
      console.error('Error generating AI clinical guidance:', err);
      return res.status(500).json({
        error: err.message || 'Failed to generate clinical guidance'
      });
    }
  });

  // Serve Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
