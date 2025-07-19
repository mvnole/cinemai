import dotenv from "dotenv";
dotenv.config();

console.log("B2_KEY_ID =", process.env.B2_KEY_ID);
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(process.env); // Ca să vezi TOT ce e încărcat