// src/utils/cashfree.mjs
import dotenv from 'dotenv';
dotenv.config();
import { Cashfree } from 'cashfree-pg';

const cf = new Cashfree(
  Cashfree.SANDBOX, // (SANDBOX or PRODUCTION)
  process.env.CASHFREE_CLIENT_ID,
  process.env.CASHFREE_CLIENT_SECRET
);

export default cf;
