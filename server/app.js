import express from "express";
import rateLimit from "express-rate-limit";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import xss from "xss";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* WHY: Prevent spam/abuse */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
});
app.use("/api/", limiter);

/* WHY: Use anon key for standard inserts */
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

/* WHY: improved sanitization against XSS */
const sanitize = (str) => xss(str).trim();

const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

app.post("/api/book", async (req, res) => {
  try {
    let { name, phone, date, time, guests } = req.body;

    name = sanitize(name);
    phone = sanitize(phone);

    if (!name || name.length < 2) {
      return res.status(400).json({ error: "Invalid name" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: "Invalid phone" });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    if (!date || new Date(date) < today) {
      return res.status(400).json({ error: "Invalid date" });
    }

    if (!time || !guests || parseInt(guests) <= 0) {
      return res.status(400).json({ error: "Invalid guests" });
    }

    const { error } = await supabase
      .from("reservations")
      .insert([{ name, phone, date, time, guests }]);

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: "You already have a reservation at this time." });
      }
      throw error;
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Backend error details:", err);
    res.status(500).json({ error: err.message || "Server error occurred" });
  }
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));