'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MODEL_FILE = process.env.MODEL_FILE || path.join(__dirname, 'v4.json');
function stripAccents(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function normalizeText(text) {
  return stripAccents(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  return normalized.split(' ').filter(Boolean);
}

function argMax(values) {
  let bestIndex = 0;
  let bestValue = values[0];
  for (let i = 1; i < values.length; i++) {
    if (values[i] > bestValue) {
      bestValue = values[i];
      bestIndex = i;
    }
  }
  return bestIndex;
}

function softmax(logits) {
  let max = -Infinity;
  for (const v of logits) if (v > max) max = v;
  const exps = new Array(logits.length);
  let sum = 0;
  for (let i = 0; i < logits.length; i++) {
    const e = Math.exp(logits[i] - max);
    exps[i] = e;
    sum += e;
  }
  const probs = new Array(logits.length);
  for (let i = 0; i < logits.length; i++) probs[i] = exps[i] / sum;
  return probs;
}
class NeuralNetwork {
  constructor(obj) {
    this.inputSize = obj.inputSize;
    this.hiddenSize = obj.hiddenSize;
    this.outputSize = obj.outputSize;
    this.W1 = obj.W1;
    this.b1 = obj.b1;
    this.W2 = obj.W2;
    this.b2 = obj.b2;
  }

  forward(x) {
    const z1 = new Array(this.hiddenSize).fill(0);
    for (let i = 0; i < this.inputSize; i++) {
      const xi = x[i];
      if (xi === 0) continue;
      const row = this.W1[i];
      for (let h = 0; h < this.hiddenSize; h++) z1[h] += xi * row[h];
    }
    for (let h = 0; h < this.hiddenSize; h++) z1[h] += this.b1[h];

    const a1 = new Array(this.hiddenSize);
    for (let h = 0; h < this.hiddenSize; h++) a1[h] = z1[h] > 0 ? z1[h] : 0;

    const logits = new Array(this.outputSize).fill(0);
    for (let h = 0; h < this.hiddenSize; h++) {
      const ah = a1[h];
      if (ah === 0) continue;
      const row = this.W2[h];
      for (let o = 0; o < this.outputSize; o++) logits[o] += ah * row[o];
    }
    for (let o = 0; o < this.outputSize; o++) logits[o] += this.b2[o];

    return softmax(logits);
  }

  predict(x) {
    const probs = this.forward(x);
    const index = argMax(probs);
    return { index, confidence: probs[index], probs };
  }
}
function loadModel(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Modelo não encontrado: ${filePath}\nVerifique se o arquivo v4.json existe na mesma pasta.`);
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);

  if (!data.network || !data.labels || !data.vocab) {
    throw new Error('Arquivo de modelo inválido (faltam network/labels/vocab)');
  }

  const vocab = new Map(data.vocab);
  const labels = data.labels;
  const intensityScore = data.intensityScore || { leve: 1, medio: 2, pesado: 3, extremo: 4 };
  const network = new NeuralNetwork(data.network);

  return {
    network,
    vocab,
    labels,
    intensityScore
  };
}

function vectorize(text, vocab) {
  const vector = new Array(vocab.size).fill(0);
  const tokens = tokenize(text);
  if (tokens.length === 0) return vector;

  for (const token of tokens) {
    const idx = vocab.get(token);
    if (idx !== undefined) vector[idx] += 1;
  }

  let norm = 0;
  for (let i = 0; i < vector.length; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < vector.length; i++) vector[i] /= norm;
  return vector;
}
function classify(model, text) {
  const x = vectorize(text, model.vocab);
  const pred = model.network.predict(x);
  const categoria = model.labels[pred.index] || '?';
  const score = model.intensityScore[categoria] || 0;
  const julgamento = score >= 3 ? 'Ruim' : 'Tranquilo';

  return {
    categoria,
    score,
    confianca: Math.round(pred.confidence * 1000) / 10,
    julgamento,
  };
}
function showBanner() {
  console.clear();
  console.log(`
  __   __   _  _   
  \\ \\ / /  | || |  
   \\ V /   | || |_ 
    \\_/    |__   _|
              |_|  

  [ M O D E L O   V 4   C A R R E G A D O ]
  =========================================
  Digite sua frase para testar.
  Digite "sair" ou "exit" para fechar.
  `);
}

function startChat(model) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  showBanner();
  rl.prompt();

  rl.on('line', (line) => {
    const text = line.trim();
    
    if (text.toLowerCase() === 'sair' || text.toLowerCase() === 'exit') {
      console.log('- Encerrando v4...');
      process.exit(0);
    }

    if (text) {
      const result = classify(model, text);
      console.log(`- [Categoria: ${result.categoria}] (Score: ${result.score}/4) | Julgamento: ${result.julgamento} | Confiança: ${result.confianca}%`);
    }
    
    rl.prompt();
  }).on('close', () => {
    console.log('\n- Encerrando v4...');
    process.exit(0);
  });
}
function main() {
  let model;
  try {
    model = loadModel(MODEL_FILE);
  } catch (e) {
    console.error('❌', e.message);
    process.exit(1);
  }

  startChat(model);
}

main();
