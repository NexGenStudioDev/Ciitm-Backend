// src/utils/cashfree.mjs
import dotenv from 'dotenv';
dotenv.config();
import { Cashfree, CFEnvironment } from 'cashfree-pg';

var cf = new Cashfree(
  Cashfree.SANDBOX, // (SANDBOX or PRODUCTION)
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

console.log('Client ID:', process.env.CASHFREE_CLIENT_ID);
console.log('Client Secret:', process.env.CASHFREE_CLIENT_SECRET);
console.log('Env:', process.env.CASHFREE_ENV);

export default cf;
