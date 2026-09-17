// ========================================
// Imports
// ========================================

const express = require("express");
const path = require("path");
const multer = require("multer");
const OpenAI = require("openai");
require("dotenv").config();

const {
  generateSimpleFormTemplate,
} = require("./templates/simple-form-template");

const {
  generateSurveyTemplate,
} = require("./templates/survey-template");

const {
  generatePlainPageTemplate,
} = require("./templates/plain-page-template");

// ========================================
// App Setup
// ========================================

const app = express();
const PORT = 3000;

console.log(process.env.OPENAI_API_KEY ? "API key loaded" : "No API key");

// ========================================
// OpenAI Client
// ========================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test-openai", async (req, res) => {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: "Say OpenAI connection successful",
    });

    res.json({
      success: true,
      response: response.output_text,
    });
  } 
  // catch (error) {
  //   // console.error(error);
  //   console.error("OpenAI Error:", {
  //     message: error.message,
  //     status: error.status,
  //     code: error.code,
  //     type: error.type,
  //   });
  //   res.status(500).json({
  //     success: false,
  //     error: error.message,
  //   });
  // }
  catch (error) {
  console.error("OpenAI Error:", {
    message: error.message,
    status: error.status,
    code: error.code,
    type: error.type,
    causeMessage: error.cause?.message,
    causeCode: error.cause?.code,
  });

  res.status(500).json({
    success: false,
    error: error.message,
    cause: error.cause?.message,
    causeCode: error.cause?.code,
  });
}
});

// ========================================
// File Upload Setup
// Uploaded files are stored in /uploads
// ========================================

const upload = multer({
  dest: "uploads/",
});

// ========================================
// Home Route
// Loads Builder UI
// ========================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================================
// Analyze Design Route
// Handles uploaded design/functionality files.
// For now, this returns dummy analysis.
// Later, this route can call OpenAI for real design detection.
// ========================================

app.post(
  "/analyze-design",

  upload.fields([
    {
      name: "designFiles",
      maxCount: 10,
    },
    {
      name: "functionalityFiles",
      maxCount: 10,
    },
  ]),

  (req, res) => {
    const { projectName, inputSource, webpageUrl, requirements } = req.body;

    const designFiles = req.files.designFiles || [];
    const functionalityFiles = req.files.functionalityFiles || [];

    res.json({
      success: true,
      message: "Design received successfully.",

      analysis: {
        projectName,
        inputSource,
        webpageUrl,
        requirements,

        designFiles: designFiles.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),

        functionalityFiles: functionalityFiles.map((file) => ({
          originalName: file.originalname,
          fileName: file.filename,
          mimeType: file.mimetype,
          size: file.size,
        })),

        detectedItems: [
          "Header / logo area",
          "Main content section",
          "Possible form section",
          "Footer area",
        ],

        nextQuestions: [
          "Should fields be required?",
          "Do you need success popup?",
          "Should popup contain SVG tick?",
          "Should Bootstrap assets be local?",
          "What data should be logged in console?",
        ],
      },
    });
  },
);

// ========================================
// Generate Page Route
// Creates final generated CloudPage HTML.
// Important: generated CloudPage JS remains inline
// so SFMC can read window.cloudPageSubmittedData directly.
// ========================================

app.post("/generate-page", (req, res) => {
  const {
    projectName,
    requirements,
    fields,
    successTitle,
    successMessage,
    showSuccessIcon,
    templateType,
  } = req.body;

  const templateData = {
    projectName,
    requirements,
    fields,
    successTitle,
    successMessage,
    showSuccessIcon,
  };

  let generatedHtml;

  switch (templateType) {
    case "plain-page":
      generatedHtml = generatePlainPageTemplate(templateData);
      break;

    case "survey-form":
      generatedHtml = generateSurveyTemplate(templateData);
      break;

    case "simple-form":
    default:
      generatedHtml = generateSimpleFormTemplate(templateData);
      break;
  }

  res.json({
    success: true,
    html: generatedHtml,
  });
});

// ========================================
// Start Server
// Auto-opens browser
// ========================================

app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;

  console.log(`Server running on ${url}`);

  const open = await import("open");
  await open.default(url);
});
