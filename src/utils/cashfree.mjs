// src/utils/cashfree.mjs
import dotenv from 'dotenv';
dotenv.config();
import { Cashfree } from 'cashfree-pg';

const cf = new Cashfree(
  Cashfree.SANDBOX, // (SANDBOX or PRODUCTION)
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

console.log('Client ID:', process.env.CASHFREE_CLIENT_ID);
console.log('Client Secret:', process.env.CASHFREE_CLIENT_SECRET);
console.log('Env:', process.env.CASHFREE_ENV);

export default cf;
