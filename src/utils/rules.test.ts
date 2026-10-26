import test from 'node:test';
import assert from 'node:assert/strict';
import { parseLocally } from './nlp';

test('Dental NLP parser extracts tooth 46 and lower right region', () => {
  const note = 'Patient reports pain in the lower right molar for three days. Pain increases while chewing. Review tooth 46 and arrange follow-up.';
  const result = parseLocally(note);

  assert.ok(result.toothNumbers.includes('46'), 'Expected tooth 46 in extracted tooth numbers');
  assert.match(result.region.toLowerCase(), /lower right/i, 'Expected lower right quadrant');
  assert.ok(result.symptoms.some(s => s.toLowerCase().includes('chewing')), 'Expected chewing pain symptom');
  assert.match(result.duration.toLowerCase(), /three days/i, 'Expected three days duration');
  assert.match(result.followUp.toLowerCase(), /follow/i, 'Expected follow-up recommendation');
});

test('Dental NLP parser extracts prescribed medicines and dosages correctly', () => {
  const note = 'Severe toothache. Advise RCT on tooth 24. Prescribe Amoxicillin 500mg and Ibuprofen 400mg twice daily for 5 days.';
  const result = parseLocally(note);

  assert.ok(result.medicines.some(m => m.name === 'Amoxicillin'), 'Expected Amoxicillin in medicines list');
  assert.ok(result.medicines.some(m => m.name === 'Ibuprofen'), 'Expected Ibuprofen in medicines list');
  assert.ok(result.toothNumbers.includes('24'), 'Expected tooth 24 in extracted teeth');
});

test('Dental NLP parser handles healthy or general consultation', () => {
  const note = 'Routine scaling completed. No caries observed. Healthy gingiva.';
  const result = parseLocally(note);

  assert.ok(result.symptoms.length > 0, 'Expected non-empty symptoms or general observation');
  assert.ok(result.confidence >= 0.8, 'Expected reasonable model confidence score');
});
