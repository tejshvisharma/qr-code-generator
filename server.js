import express from "express";

import QRCode from "qrcode";

import path from "path";

import { fileURLToPath } from "url";

import dotenv from "dotenv";
dotenv.config();

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    qrCode: null,
    error: null,
    formData: { text: "", size: 200, margin: 2 },
  });
});

app.post("/generate", async (req, res) => {
  try {
    const { text, size, margin } = req.body;

    if (!text) {
      return res.render("index", {
        qrCode: null,
        error: "Please enter some text or URL to generate QR code",
        formData: { text: "", size: size || 200, margin: margin || 2 },
      });
    }

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: size || 200,
      margin: margin || 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    res.render("index", {
      qrCode: qrCodeDataURL,
      error: null,
      formData: { text, size: size || 200, margin: margin || 2 },
    });
  } catch (error) {
    console.error("QR generation error:", error);
    res.render("index", {
      qrCode: null,
      error: "Failed to generate QR code. Please try again.",
      formData: {
        text: req.body.text || "",
        size: req.body.size || 200,
        margin: req.body.margin || 2,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${process.env.BASE_URL}:${PORT}`);
});
