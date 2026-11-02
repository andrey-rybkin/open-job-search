#!/usr/bin/env node

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.superjob.ru/2.0/vacancies/';
const ALLOWED_PERIODS = new Set(['0', '1', '3', '7']);

export function normalizeVacancy(item) {
  if (!item || !Number.isInteger(Number(item.id)) || Number(item.id) < 1) throw new Error('в вакансии нет корректного id');
  const salary = [item.payment_from, item.payment_to]
    .filter((value) => Number.isFinite(value) && value > 0);
  const salaryText = salary.length
    ? `${salary.length === 2 ? `${salary[0]}–${salary[1]}` : salary[0]} ${item.currency ?? ''}`.trim()
    : item.agreement ? 'по договорённости' : null;

  return {
    source: 'superjob',
    id: String(item.id),
    title: item.profession ?? null,
    company: item.firm_name ?? null,
    location: item.town?.title ?? item.address ?? null,
    remote: item.place_of_work?.id === 2 || item.place_of_work?.title === 'на дому',
    salary: salaryText,
    url: item.link ?? null,
    publishedAt: item.date_published ?? null,
    description: [item.work, item.candidat, item.compensation].filter(Boolean).join('\n\n'),
  };
}

function parseArgs(argv) {
  const options = { page: '0', count: '20', period: '7' };
  const names = new Map([
    ['--keyword', 'keyword'], ['--page', 'page'], ['--count', 'count'], ['--period', 'period'],
    ['--town', 'town'], ['--payment-from', 'payment_from'], ['--payment-to', 'payment_to'],
  ]);

  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--remote') {
      options.place_of_work = '2';
      continue;
    }
    const key = names.get(flag);
    if (!key || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error(`неизвестный или неполный параметр: ${flag}`);
    options[key] = argv[++i];
  }

  if (!options.keyword?.trim()) throw new Error('укажите --keyword');
  if (!/^\d+$/.test(options.page) || Number(options.page) > 500) throw new Error('--page должен быть от 0 до 500');
  if (!/^\d+$/.test(options.count) || Number(options.count) < 1 || Number(options.count) > 100) throw new Error('--count должен быть от 1 до 100');
  if (!ALLOWED_PERIODS.has(options.period)) throw new Error('--period должен быть 0, 1, 3 или 7');
  for (const field of ['payment_from', 'payment_to']) {
    if (options[field] !== undefined && (!/^\d+$/.test(options[field]) || Number(options[field]) < 0)) {
      throw new Error(`--${field.replace('_', '-')} должен быть неотрицательным числом`);
    }
  }
  return options;
}

export async function searchVacancies(options, appId, fetchImpl = fetch) {
  if (!appId) throw new Error('задайте SUPERJOB_APP_ID в переменных окружения');
  const url = new URL(API);
  for (const [key, value] of Object.entries(options)) url.searchParams.set(key, key === 'keyword' ? value.trim() : value);

  const response = await fetchImpl(url, {
    headers: { 'X-Api-App-Id': appId, accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`SuperJob API вернул HTTP ${response.status}; автоматический повтор отключён`);
  const data = await response.json();
  if (!Array.isArray(data.objects)) throw new Error('неожиданный ответ SuperJob API: нет массива objects');
  return {
    source: 'superjob',
    total: data.total ?? null,
    more: Boolean(data.more),
    jobs: data.objects.map(normalizeVacancy),
  };
}

async function selfTest() {
  const job = normalizeVacancy({
    id: 123,
    profession: 'Support Engineer',
    firm_name: 'Example',
    payment_from: 100000,
    payment_to: 150000,
    currency: 'rub',
    place_of_work: { id: 2, title: 'на дому' },
    town: { title: 'Москва' },
    link: 'https://www.superjob.ru/vacancies/example-123.html',
    work: 'Support web services',
  });
  if (job.id !== '123' || job.salary !== '100000–150000 rub' || !job.remote || job.description !== 'Support web services') {
    throw new Error('self-test failed: vacancy normalization');
  }
  const options = parseArgs(['--keyword', 'support engineer', '--remote', '--count', '2']);
  let requestedUrl;
  const result = await searchVacancies(options, 'test-secret', async (url, init) => {
    requestedUrl = new URL(url);
    if (init.headers['X-Api-App-Id'] !== 'test-secret') throw new Error('self-test failed: API app header');
    return { ok: true, json: async () => ({ total: 1, more: false, objects: [{ id: 123, profession: 'Support Engineer' }] }) };
  });
  if (requestedUrl.searchParams.get('keyword') !== 'support engineer' || requestedUrl.searchParams.get('place_of_work') !== '2' || result.jobs[0].id !== '123') {
    throw new Error('self-test failed: API query and normalization');
  }
  let rejectedInvalidCount = false;
  try { parseArgs(['--keyword', 'test', '--count', '101']); } catch { rejectedInvalidCount = true; }
  if (!rejectedInvalidCount) throw new Error('self-test failed: count validation');
  console.log('self-test: ok');
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 1 && argv[0] === '--self-test') return selfTest();
  try {
    const result = await searchVacancies(parseArgs(argv), process.env.SUPERJOB_APP_ID);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await main();
