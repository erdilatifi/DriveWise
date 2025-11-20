'use server';

import crypto from 'crypto';

export interface PayseraConfig {
  projectId: string;
  signPassword: string;
  testMode: boolean;
  baseUrl: string;
  appBaseUrl: string;
  frontendBaseUrl: string;
}

export function getPayseraConfig(): PayseraConfig {
  const projectId = process.env.PAYSERA_PROJECT_ID;
  const signPassword = process.env.PAYSERA_SIGN_PASSWORD;
  const testModeEnv = process.env.PAYSERA_TEST_MODE ?? '1';
  const baseUrl = process.env.PAYSERA_BASE_URL || 'https://www.paysera.com/pay/';
  const appBaseUrl = process.env.APP_BASE_URL;
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL;

  if (!projectId || !signPassword || !appBaseUrl || !frontendBaseUrl) {
    throw new Error('Paysera configuration is missing required environment variables.');
  }

  return {
    projectId,
    signPassword,
    testMode: testModeEnv === '1',
    baseUrl,
    appBaseUrl,
    frontendBaseUrl,
  };
}

function encodeParams(params: Record<string, string | number>): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    usp.append(key, String(value));
  }
  const query = usp.toString();
  const b64 = Buffer.from(query, 'utf8').toString('base64');
  return b64.replace(/\//g, '_').replace(/\+/g, '-');
}

function decodeData(data: string): URLSearchParams {
  const restored = data.replace(/_/g, '/').replace(/-/g, '+');
  const decoded = Buffer.from(restored, 'base64').toString('utf8');
  return new URLSearchParams(decoded);
}

function signData(data: string, password: string): string {
  return crypto.createHash('md5').update(data + password).digest('hex');
}

export interface PayseraRequestPayload {
  data: string;
  sign: string;
}

export interface PayseraOrderRequestInput {
  orderId: string;
  amountCents: number;
  currency: string;
  acceptUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  test?: boolean;
}

export function buildPayseraRequest(
  input: PayseraOrderRequestInput,
  config: PayseraConfig,
): PayseraRequestPayload {
  const testFlag = input.test !== undefined ? input.test : config.testMode;

  const params: Record<string, string | number> = {
    projectid: config.projectId,
    orderid: input.orderId,
    accepturl: input.acceptUrl,
    cancelurl: input.cancelUrl,
    callbackurl: input.callbackUrl,
    amount: input.amountCents,
    currency: input.currency,
    test: testFlag ? 1 : 0,
  };

  const data = encodeParams(params);
  const sign = signData(data, config.signPassword);
  return { data, sign };
}

export function buildPayseraRedirectUrl(
  payload: PayseraRequestPayload,
  config: PayseraConfig,
): string {
  const url = new URL(config.baseUrl);
  url.searchParams.set('data', payload.data);
  url.searchParams.set('sign', payload.sign);
  return url.toString();
}

export interface PayseraCallbackData {
  orderId: string;
  status: string;
  amountCents: number;
  currency: string;
  test: string | null;
  raw: Record<string, string>;
}

export function parsePayseraCallback(
  data: string,
  sign: string,
  config: PayseraConfig,
): PayseraCallbackData {
  const expected = signData(data, config.signPassword);
  if (expected !== sign) {
    throw new Error('Invalid Paysera signature');
  }

  const params = decodeData(data);
  const raw: Record<string, string> = {};
  params.forEach((value, key) => {
    raw[key] = value;
  });

  const orderId = params.get('orderid') || '';
  const status = params.get('status') || '';
  const amountStr = params.get('amount') || params.get('payamount') || '0';
  const currency = params.get('currency') || params.get('paycurrency') || 'EUR';
  const test = params.get('test');

  const amountCents = parseInt(amountStr, 10);
  if (!orderId || Number.isNaN(amountCents)) {
    throw new Error('Invalid Paysera callback payload');
  }

  return {
    orderId,
    status,
    amountCents,
    currency,
    test,
    raw,
  };
}

export function isPayseraStatusSuccessful(status: string): boolean {
  return status === '1' || status === '3';
}
