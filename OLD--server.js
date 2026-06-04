// ========================================
// Imports
// ========================================

const express = require("express");
const path = require("path");
const multer = require("multer");

// ========================================
// App Setup
// ========================================

const app = express();
const PORT = 3000;

// ========================================
// File Upload Setup
// Uploaded files are stored in /uploads
// ========================================

const upload = multer({
  dest: "uploads/",
});

// ========================================
// Middleware
// ========================================

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// Home Route
// ========================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================================
// Analyze Design Route
// For now this returns dummy analysis.
// Later this will be replaced with OpenAI analysis.
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
// Creates final generated CloudPage HTML
// ========================================
function generateSurveyTemplate({ projectName, requirements, successTitle }) {
  return `<!doctype html> <html lang="en"> <head> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <title>PCP Survey</title> <link href="./assets/css/bootstrap.min.css" rel="stylesheet" /> <style> body { background: #ffffff; color: #001965; } .card { border-radius: 0.75rem; } .option { cursor: pointer; } .free-text { margin-top: 0.5rem; display: none; } .err-text { color: #dc3545; display: none; margin-top: 0.5rem; font-size: 14px; } .page-header { display: flex; align-items: center; justify-content: flex-end; gap: 1rem; padding: 15px 0; } .page-header img { max-height: 75px; width: auto; } .top-card-text, .top-card-text p { color: #001965; font-size: clamp(16px, 2.5vw, 25px); font-style: italic; margin-bottom: 20px; font-weight: 700; } footer.site-footer { padding: 18px 12px; background: #fff; font-size: 13px; color: #001965; } .form-check { position: relative; padding-left: 34px; } .form-check-input { position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; margin: 0; opacity: 0; pointer-events: none; } .form-check-label::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 22px; height: 22px; border: 2px solid #001965; background: #fff; border-radius: 4px; box-shadow: 0 0 0 0 rgba(11, 94, 215, 0.12); transition: background 0.12s ease, box-shadow 0.12s ease; } .form-check-input:checked+.form-check-label::before { background: #001965; box-shadow: 0 0 0 4px rgba(11, 94, 215, 0.12); } .form-check-label::after { content: ""; position: absolute; left: 6px; top: 50%; transform: translateY(-50%) scale(0); width: 6px; height: 10px; border: solid #fff; border-width: 0 2px 2px 0; transform-origin: center; rotate: 45deg; } .form-check-input:checked+.form-check-label::after { transform: translateY(-65%) translateX(-50%) scale(1) rotate(4deg); } #surveyForm .form-control, #surveyForm .free-text { border: 2px solid #001965; border-radius: 6px; padding: 0.5rem 0.6rem; box-shadow: none; color: #001965; transition: box-shadow 0.12s ease, border-color 0.12s ease, transform 0.08s ease; } #surveyForm .form-control:focus, #surveyForm .free-text:focus { outline: none; box-shadow: 0 0 0 5px rgba(0, 25, 101, 0.1); border-color: #001965; transform: translateY(-0.5px); } #surveyForm label { color: #001965; font-weight: 600; } .submitBtn { background-color: #001965; border: 2px solid #001965; color: #fff; } .submitBtn:hover, .submitBtn:focus { background-color: #fff; border: 2px solid #001965; color: #001965; } .success-check { display: block; margin: 0 auto; } .success-circle { stroke: #198754; stroke-width: 5; stroke-dasharray: 252; stroke-dashoffset: 252; animation: drawCircle 0.7s ease forwards; } .success-tick { stroke: #198754; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 60; stroke-dashoffset: 60; animation: drawTick 0.45s ease forwards 0.65s; } @keyframes drawCircle { to { stroke-dashoffset: 0; } } @keyframes drawTick { to { stroke-dashoffset: 0; } } </style> </head> <body> <div class="container"> <header class="page-header"> <a href="http://www.novonordisk.com.sa/" target="_blank" rel="noopener noreferrer"> <img src="./assets/images/nn-logo.png" alt="Novo Nordisk logo" class="img-fluid" /> </a> </header> <div class="card top-card-text mt-4" style="border:none;"> <p>We know your time is precious. That's why we want to make sure that the scientific content and educational resources we share with you are genuinely meaningful — relevant to your daily practice, your patients, and your areas of clinical interest.</p> <p class="mb-0">This brief survey (approximately 3 minutes) asks a few questions about your clinical background, practice setting, and engagement preferences. Your answers will directly guide how we engage with you — from the topics we prioritize, to the formats we use, and the frequency we reach out. Your input matters. Together, we can build a more personalized and impactful scientific partnership.</p> </div> <div class="card" style="border: none;"> <div class="card-body"> <!-- ========================================================== QUESTION CONFIGURATION ========================================================== Use data attributes on each question container. Single Choice Question: ------------------------------------------ <div class="mb-4" data-q="2" data-type="single"> Result: - Only 1 option can be selected. - Validation requires exactly 1 answer. Multi Choice Question: ------------------------------------------ <div class="mb-4" data-q="1" data-type="multi" data-min="1" data-max="3"> Result: - User can select up to 3 answers. - Validation requires at least 1 answer. Multi Choice (No Maximum): ------------------------------------------ <div class="mb-4" data-q="11" data-type="multi" data-min="1"> Result: - User can select unlimited answers. - Validation requires at least 1 answer. Other Text Field: ------------------------------------------ Checkbox value MUST be: value="other" Free text field ID MUST match: id="q1-free" Examples: q1 -> q1-free q4 -> q4-free q11 -> q11-free ========================================================== --> <form id="surveyForm" novalidate> <div class="mb-4" data-q="1" data-type="single"> <label class="form-label fw-bold pb-2">1. How many years have you been practicing as a PCP?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q1a" name="q1" value="0-7 years"><label class="form-check-label" for="q1a">0-7 years</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q1b" name="q1" value="8-15 years"><label class="form-check-label" for="q1b">8-15 years</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q1c" name="q1" value="16+ years"><label class="form-check-label" for="q1c">16+ years</label></div> </div> </div> <div class="err-text" id="err-q1">test q</div> </div> <div class="mb-4" data-q="2" data-type="single"> <label class="form-label fw-bold pb-2">2. Which of the following options best describes your academic background incl. any additional certifications/training in diabetes, obesity, cardio, renal or liver disease?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2a" name="q2" value="GP, no additional certification/training"><label class="form-check-label" for="q2a">GP, no additional certification/training</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2b" name="q2" value="GP with additional certification/training"><label class="form-check-label" for="q2b">GP with additional certification/training</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2c" name="q2" value="FM, no additional certification/training"><label class="form-check-label" for="q2c">FM, no additional certification/training</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2d" name="q2" value="FM with additional certification/training"><label class="form-check-label" for="q2d">FM with additional certification/training</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2e" name="q2" value="IM, no additional diploma"><label class="form-check-label" for="q2e">IM, no additional diploma</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q2f" name="q2" value="IM with additional diploma"><label class="form-check-label" for="q2f">IM with additional diploma</label></div> </div> </div> <div class="err-text" id="err-q2"></div> </div> <div class="mb-4" data-q="3" data-type="single"> <label class="form-label fw-bold pb-2">3. In which healthcare setting do you primarily practice?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q3a" name="q3" value="Private"><label class="form-check-label" for="q3a">Private</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q3b" name="q3" value="Public"><label class="form-check-label" for="q3b">Public</label></div> </div> </div> <div class="err-text" id="err-q3"></div> </div> <div class="mb-4" data-q="4" data-type="single"> <label class="form-label fw-bold pb-2">4. In which of these institutions do you spend most of your clinical practice time?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q4a" name="q4" value="Hospital (either private or public)"><label class="form-check-label" for="q4a">Hospital (either private or public)</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q4b" name="q4" value="GP-only setting (Polyclinic)"><label class="form-check-label" for="q4b">GP-only setting (Polyclinic)</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q4c" name="q4" value="other"><label class="form-check-label" for="q4c">Other</label></div><input type="text" id="q4-free" class="form-control free-text" placeholder="Please specify"> </div> </div> <div class="err-text" id="err-q4"></div> </div> <div class="mb-4" data-q="5" data-type="single"> <label class="form-label fw-bold pb-2">5. Approximately how many T2D/obesity patients do you actively manage, as % of your total patient base?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q5a" name="q5" value="<10%"><label class="form-check-label" for="q5a">&lt;10%</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q5b" name="q5" value="10-19%"><label class="form-check-label" for="q5b">10-19%</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q5c" name="q5" value="20-34%"><label class="form-check-label" for="q5c">20-34%</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q5d" name="q5" value="35-49%"><label class="form-check-label" for="q5d">35-49%</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q5e" name="q5" value=">=50%"><label class="form-check-label" for="q5e">≥50%</label></div> </div> </div> <div class="err-text" id="err-q5"></div> </div> <div class="mb-4" data-q="6" data-type="single"> <label class="form-label fw-bold pb-2">6. When you suspect a cardiometabolic condition, what best describes your typical diagnostic approach?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q6a" name="q6" value="I mainly rely on my clinical judgement and testing varies case-by-case"><label class="form-check-label" for="q6a">I mainly rely on my clinical judgement and testing varies case-by-case</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q6b" name="q6" value="I generally follow my personal routine (e.g., my own checklist)"><label class="form-check-label" for="q6b">I generally follow my personal routine (e.g., my own checklist)</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q6c" name="q6" value="I follow the protocol and internal pathways of the institution where I work"><label class="form-check-label" for="q6c">I follow the protocol and internal pathways of the institution where I work</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q6d" name="q6" value="I align my decisions with recognized clinical routines and guidelines"><label class="form-check-label" for="q6d">I align my decisions with recognized clinical routines and guidelines</label></div> </div> </div> <div class="err-text" id="err-q6"></div> </div> <div class="mb-4" data-q="7" data-type="single"> <label class="form-label fw-bold pb-2">7. For at-risk patients, what best describes your attitude towards screening of kidney/heart/liver complications?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q7a" name="q7" value="I conduct testing mostly when symptoms arise"><label class="form-check-label" for="q7a">I conduct testing mostly when symptoms arise</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q7b" name="q7" value="I screen when risk is high or at specific milestones (e.g., annual reassessment, tx change)"><label class="form-check-label" for="q7b">I screen when risk is high or at specific milestones (e.g., annual reassessment, tx change)</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q7c" name="q7" value="I systematically screen any T2D/obese patient"><label class="form-check-label" for="q7c">I systematically screen any T2D/obese patient</label></div> </div> </div> <div class="err-text" id="err-q7"></div> </div> <div class="mb-4" data-q="8" data-type="single"> <label class="form-label fw-bold pb-2">8. In your practice, at what point do you usually consider obesity pharmacotherapy?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q8a" name="q8" value="BMI >=40, or BMI >35 with significant complications, typically after lifestyle attempts"><label class="form-check-label" for="q8a">BMI ≥40, or BMI &gt;35 with significant complications, typically after lifestyle attempts</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q8b" name="q8" value="BMI >=35, or BMI >30 with at least one weight-related comorbidity (e.g., T2D)"><label class="form-check-label" for="q8b">BMI ≥35, or BMI &gt;30 with at least one weight-related comorbidity (e.g., T2D)</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q8c" name="q8" value="BMI >=30, even without major complications, or in high-risk patients to prevent progression"><label class="form-check-label" for="q8c">BMI ≥30, even without major complications, or in high-risk patients to prevent progression</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q8d" name="q8" value="BMI 27-29.9 with comorbidity"><label class="form-check-label" for="q8d">BMI 27-29.9 with comorbidity</label></div> </div> </div> <div class="err-text" id="err-q8"></div> </div> <div class="mb-4" data-q="9" data-type="single"> <label class="form-label fw-bold pb-2">9. For patients with T2D/obesity and related complications, which best matches your usual pathway?</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q9a" name="q9" value="I take fully care of these patients; referrals are relatively uncommon and typically limited to advanced/complex cases"><label class="form-check-label" for="q9a">I take fully care of these patients; referrals are relatively uncommon and typically limited to advanced/complex cases</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q9b" name="q9" value="Pathway varies by case; I refer some patients and others are managed depending on clinical factors and specialist access"><label class="form-check-label" for="q9b">Pathway varies by case; I refer some patients and others are managed depending on clinical factors and specialist access</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q9c" name="q9" value="I follow a planned escalation approach: I involve specialists at defined points or when predefined triggers are met, and ensure ongoing follow-up"><label class="form-check-label" for="q9c">I follow a planned escalation approach: I involve specialists at defined points or when predefined triggers are met, and ensure ongoing follow-up</label></div> </div> </div> <div class="err-text" id="err-q9"></div> </div> <div class="mb-4" data-q="10" data-type="single"> <label class="form-label fw-bold pb-2">10. When a new treatment becomes available, what typically needs to happen before you start using it? Select the statement that best resonates with your approach.</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q10a" name="q10" value="I start using the treatment when it becomes common locally, and I see real-world experience"><label class="form-check-label" for="q10a">I start using the treatment when it becomes common locally, and I see real-world experience</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q10b" name="q10" value="I start using treatment when it is endorsed in guidelines"><label class="form-check-label" for="q10b">I start using treatment when it is endorsed in guidelines</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q10c" name="q10" value="I start using treatment when the evidence from studies is convincing"><label class="form-check-label" for="q10c">I start using treatment when the evidence from studies is convincing</label></div> </div> </div> <div class="err-text" id="err-q10"></div> </div> <div class="mb-4" data-q="11" data-type="single"> <label class="form-label fw-bold pb-2">11. How do you typically keep up to date on cardiometabolic care? Select the statement that best resonates with your approach.</label> <div class="row gx-2 gy-2"> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q11a" name="q11" value="I mostly rely on everyday practice exposure and brief updates (e.g., colleagues, rep visits, summaries, social media), and I look things up when a specific case comes up"><label class="form-check-label" for="q11a">I mostly rely on everyday practice exposure and brief updates (e.g., colleagues, rep visits, summaries, social media), and I look things up when a specific case comes up</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q11b" name="q11" value="I use a mix of quick updates and occasional deeper sources (e.g., clinical summaries, local guidance, selected webinars/articles) when I feel it’s relevant"><label class="form-check-label" for="q11b">I use a mix of quick updates and occasional deeper sources (e.g., clinical summaries, local guidance, selected webinars/articles) when I feel it’s relevant</label></div> </div> <div class="col-12"> <div class="form-check option"><input class="form-check-input" type="checkbox" id="q11c" name="q11" value="I regularly use a defined set of reference sources (e.g., guidelines updates, peer-reviewed journals, accredited CME), complemented by quick updates"><label class="form-check-label" for="q11c">I regularly use a defined set of reference sources (e.g., guidelines updates, peer-reviewed journals, accredited CME), complemented by quick updates</label> </div> </div> </div> <div class="err-text" id="err-q11"></div> </div> <div class="d-flex align-items-center gap-3"> <button id="submitBtn" type="button" class="btn submitBtn px-5">Submit</button> </div> </form> </div> </div> <footer class="site-footer">SA26DI00001</footer> </div> <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false"> <div class="modal-dialog modal-dialog-centered"> <div class="modal-content"> <div class="modal-success-body text-center p-5" style="color:#001965;"> <svg class="success-check" width="90" height="90" viewBox="0 0 90 90"> <circle class="success-circle" cx="45" cy="45" r="40" fill="none" /> <path class="success-tick" fill="none" d="M26 46 L39 59 L65 31" /> </svg> <div class="mt-3 fw-bold">Thank you for your responses!</div> </div> </div> </div> </div> <script src="./assets/js/bootstrap.bundle.min.js"></script> <script> (function () { const submitBtn = document.getElementById("submitBtn"); const ERROR_TEXTS = { singleRequired: "Please select one answer.", multiRequired: "Please select at least one answer.", freeRequired: "Please fill in this field." }; const CUSTOM_ERRORS = { // q1: "test Q1.", // q11: "error for Q11." }; function showError(qId, msg) { const el = document.getElementById("err-q" + qId); if (el) { el.textContent = msg; el.style.display = "block"; } } function hideError(qId) { const el = document.getElementById("err-q" + qId); if (el) { el.style.display = "none"; } } function collectCheckboxValues(name) { return Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (i) { return i.value; }); } function getRule(questionBlock) { const type = questionBlock && questionBlock.dataset.type ? questionBlock.dataset.type : "single"; const min = questionBlock && questionBlock.dataset.min ? Number(questionBlock.dataset.min) : 1; const max = questionBlock && questionBlock.dataset.max ? Number(questionBlock.dataset.max) : null; return { type: type, min: min, max: max }; } // function getErrorMessage(rule) { // if (rule.type === "single") { // return ERROR_TEXTS.singleRequired; // } // if (rule.max) { // return "Please select between " + rule.min + " and " + rule.max + " answers."; // } // return ERROR_TEXTS.multiRequired; // } function getErrorMessage(qName, rule) { if (CUSTOM_ERRORS[qName]) { return CUSTOM_ERRORS[qName]; } if (rule.type === "single") { return "Please select one answer."; } if (rule.max) { return "Please select between " + rule.min + " and " + rule.max + " answers."; } return "Please select at least one answer."; } function updateOtherField(inp) { if (!inp || inp.value !== "other") return; const name = inp.name; const qnum = name.replace("q", ""); const freeEl = document.getElementById(name + "-free"); if (!freeEl) return; if (inp.checked) { freeEl.style.display = "block"; freeEl.focus(); } else { freeEl.value = ""; freeEl.style.display = "none"; hideError(qnum); } } function onCheckboxToggled(inp) { if (!inp || !inp.name) return; const name = inp.name; const qnum = name.replace("q", ""); const questionBlock = inp.closest("[data-q]"); const rule = getRule(questionBlock); const qName = name; hideError(qnum); if (rule.type === "single" && inp.checked) { document.querySelectorAll('input[name="' + name + '"]').forEach(function (other) { if (other !== inp && other.checked) { other.checked = false; updateOtherField(other); } }); } if (rule.type === "multi" && inp.checked && rule.max) { const selected = collectCheckboxValues(name); if (selected.length > rule.max) { inp.checked = false; showError(qnum, getErrorMessage(qName, rule)); } } updateOtherField(inp); } function validateAndCollect() { const result = {}; let valid = true; document.querySelectorAll("[data-q]").forEach(function (questionBlock) { const qnum = questionBlock.getAttribute("data-q"); const qName = "q" + qnum; const rule = getRule(questionBlock); const sel = collectCheckboxValues(qName); if (rule.type === "single") { if (sel.length !== 1) { showError(qnum, getErrorMessage(qName, rule)); valid = false; } else { hideError(qnum); } } if (rule.type === "multi") { if (sel.length < rule.min) { showError(qnum, getErrorMessage(qName, rule)); valid = false; } else if (rule.max && sel.length > rule.max) { showError(qnum, getErrorMessage(qName, rule)); valid = false; } else { hideError(qnum); } } const freeEl = document.getElementById(qName + "-free"); if (freeEl && freeEl.style.display !== "none") { const freeVal = freeEl.value.trim(); if (freeVal === "") { showError(qnum, ERROR_TEXTS.freeRequired); valid = false; result[qName] = { selected: sel }; } else { result[qName] = { selected: sel, freeText: freeVal }; } } else { result[qName] = { selected: sel }; } }); return { valid: valid, result: result }; } submitBtn.addEventListener("click", function () { const data = validateAndCollect(); if (!data.valid) { const firstErr = document.querySelector('.err-text[style*="display: block"]'); if (firstErr) { firstErr.scrollIntoView({ behavior: "smooth", block: "center" }); } return; } window.cloudPageSubmittedData = data.result;

console.log("Submitted CloudPage Data JSON:");
console.log(JSON.stringify(window.cloudPageSubmittedData, null, 2)); const successModalEl = document.getElementById("successModal"); if (successModalEl) { const modal = new bootstrap.Modal(successModalEl, { backdrop: "static", keyboard: false }); modal.show(); } }); document.querySelectorAll('input[type="checkbox"]').forEach(function (inp) { inp.addEventListener("change", function () { onCheckboxToggled(inp); }); }); document.querySelectorAll(".free-text").forEach(function (f) { f.addEventListener("input", function () { const match = (f.id || "").match(/^q(\d+)-free$/); if (match) hideError(match[1]); }); }); (function initOther() { document.querySelectorAll("[data-q]").forEach(function (questionBlock) { const q = questionBlock.getAttribute("data-q"); const otherCheckbox = questionBlock.querySelector('input[type="checkbox"][value="other"]'); const freeInput = document.getElementById("q" + q + "-free"); if (!otherCheckbox || !freeInput) return; freeInput.style.display = otherCheckbox.checked ? "block" : "none"; }); })(); })(); </script> </body> </html>`;
}
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

  // ========================================
  // Dynamic Field HTML Generator
  // ========================================

  const fieldRowsHtml = (fields || [])
    .map((field, index) => {
      const fieldId = `field_${index + 1}`;

      const label = field.label || `Field ${index + 1}`;

      const type = field.type || "text";

      const required = field.required || "no";

      const errorMessage = field.errorMessage || "This field cannot be blank.";

      // Textarea
      if (type === "textarea") {
        return `
          <div class="mb-3">
            <label class="form-label" for="${fieldId}">
              ${label}
            </label>

            <textarea
              class="form-control cloudpage-field"
              id="${fieldId}"
              data-label="${label}"
              data-type="textarea"
              data-required="${required}"
              data-error="${errorMessage}"
              rows="4"
            ></textarea>

            <div class="error-message" id="${fieldId}_error"></div>
          </div>
        `;
      }

      // Checkbox with Other textarea
      if (type === "checkbox-other") {
        return `
          <div
            class="mb-3 checkbox-other-group"
            data-group="${fieldId}"
            data-label="${label}"
            data-required="${required}"
            data-error="${errorMessage}"
          >
            <label class="form-label">
              ${label}
            </label>

            <div class="form-check">
              <input
                class="form-check-input cloudpage-checkbox"
                type="checkbox"
                id="${fieldId}_option_1"
                value="Option 1"
                data-group="${fieldId}"
              >

              <label class="form-check-label" for="${fieldId}_option_1">
                Option 1
              </label>
            </div>

            <div class="form-check">
              <input
                class="form-check-input cloudpage-checkbox other-checkbox"
                type="checkbox"
                id="${fieldId}_other"
                value="Other"
                data-group="${fieldId}"
              >

              <label class="form-check-label" for="${fieldId}_other">
                Other
              </label>
            </div>

            <div class="other-wrap d-none" id="${fieldId}_other_wrap">
              <textarea
                class="form-control other-textarea mt-2"
                id="${fieldId}_other_text"
                rows="4"
                placeholder="Please specify"
              ></textarea>
            </div>

            <div class="error-message" id="${fieldId}_error"></div>
          </div>
        `;
      }

      // Text / Email
      return `
        <div class="mb-3">
          <label class="form-label" for="${fieldId}">
            ${label}
          </label>

          <input
            type="${type === "email" ? "email" : "text"}"
            class="form-control cloudpage-field"
            id="${fieldId}"
            data-label="${label}"
            data-type="${type}"
            data-required="${required}"
            data-error="${errorMessage}"
          >

          <div class="error-message" id="${fieldId}_error"></div>
        </div>
      `;
    })
    .join("");


  if (templateType === "survey-form") {
    const generatedHtml = generateSurveyTemplate({
      projectName,
      requirements,
      successTitle,
    });

    return res.json({
      success: true,
      html: generatedHtml,
    });
  }

  // ========================================
  // Final Generated HTML
  // ========================================

  const generatedHtml = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>
    ${projectName || "CloudPage"}
  </title>

  <link
    href="assets/css/bootstrap.min.css"
    rel="stylesheet"
  >

  <style>
    body {
      background: #f3f4f6;
      font-family: Arial, Helvetica, sans-serif;
      color: #001965;
    }

    .cloudpage-wrapper {
      max-width: 760px;
      margin: 0 auto;
      padding: 40px 14px;
    }

    .cloudpage-card {
      background: #ffffff;
      padding: 32px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
    }

    .error-message {
      display: none;
      color: #dc3545;
      font-size: 14px;
      font-weight: 700;
      margin-top: 6px;
    }

    .error-message.show {
      display: block;
    }

    .success-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.45);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .success-overlay.show {
      display: flex;
    }

    .success-popup {
      width: min(650px, 100%);
      background: #ffffff;
      color: #001965;
      border: 2px solid #001965;
      padding: 32px 24px;
      text-align: center;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .success-icon svg {
      width: 72px;
      height: 72px;
      margin-bottom: 18px;
    }

    .success-circle {
      fill: none;
      stroke: #28a745;
      stroke-width: 4;
      stroke-dasharray: 151;
      stroke-dashoffset: 151;
      animation: drawCircle 0.6s ease forwards;
    }

    .success-check {
      fill: none;
      stroke: #28a745;
      stroke-width: 5;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 36;
      stroke-dashoffset: 36;
      animation: drawCheck 0.35s ease forwards 0.55s;
    }

    @keyframes drawCircle {
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes drawCheck {
      to {
        stroke-dashoffset: 0;
      }
    }
  </style>
</head>

<body>

  <main class="cloudpage-wrapper">
    <section class="cloudpage-card">

      <h1>
        ${projectName || "Generated CloudPage"}
      </h1>

      <p>
        ${requirements || "No requirements added."}
      </p>

      <form id="cloudPageForm" novalidate>
        ${fieldRowsHtml}

        <button type="submit" class="btn btn-primary">
          Submit
        </button>
      </form>

    </section>
  </main>

  <div class="success-overlay" id="successOverlay">
    <div class="success-popup" id="successPopup">

      ${showSuccessIcon
      ? `
      <div class="success-icon">
        <svg viewBox="0 0 52 52" aria-hidden="true">
          <circle class="success-circle" cx="26" cy="26" r="24"></circle>
          <path class="success-check" d="M14 27 L22 35 L38 17"></path>
        </svg>
      </div>
      `
      : ""
    }

      <h2>
        ${successTitle || "Thank you!"}
      </h2>

      <p>
        ${successMessage || "Your response has been submitted successfully."}
      </p>

    </div>
  </div>

  <script>
    // ========================================
    // SFMC Team:
    // Submitted values are stored globally here.
    // Access from console:
    // window.cloudPageSubmittedData
    // ========================================

    window.cloudPageSubmittedData = {
      fields: {},
      isValid: false
    };

    const cloudPageForm =
      document.getElementById('cloudPageForm');

    const successOverlay =
      document.getElementById('successOverlay');

    const otherCheckboxes =
      document.querySelectorAll('.other-checkbox');


    // ========================================
    // Show / Hide Other textarea
    // ========================================

    otherCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        const groupId =
          checkbox.getAttribute('data-group');

        const otherWrap =
          document.getElementById(groupId + '_other_wrap');

        const otherText =
          document.getElementById(groupId + '_other_text');

        const errorElement =
          document.getElementById(groupId + '_error');

        if (checkbox.checked) {
          otherWrap.classList.remove('d-none');
        } else {
          otherWrap.classList.add('d-none');
          otherText.value = '';
          errorElement.textContent = '';
          errorElement.classList.remove('show');
        }
      });
    });


    // ========================================
    // Form Submit
    // ========================================

    cloudPageForm.addEventListener('submit', function (event) {
      event.preventDefault();

      let isValid = true;

      const submittedFields = {};


      // ========================================
      // Validate normal text/email/textarea fields
      // ========================================

      const normalFields =
        document.querySelectorAll('.cloudpage-field');

      normalFields.forEach(function (field) {
        const label =
          field.getAttribute('data-label');

        const required =
          field.getAttribute('data-required');

        const errorMessage =
          field.getAttribute('data-error');

        const errorElement =
          document.getElementById(field.id + '_error');

        const value =
          field.value.trim();

        submittedFields[label] = value;

        errorElement.textContent = '';
        errorElement.classList.remove('show');

        if (required === 'yes' && !value) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }
      });


      // ========================================
      // Validate checkbox groups with Other textarea
      // ========================================

      const checkboxGroups =
        document.querySelectorAll('.checkbox-other-group');

      checkboxGroups.forEach(function (group) {
        const groupId =
          group.getAttribute('data-group');

        const label =
          group.getAttribute('data-label');

        const required =
          group.getAttribute('data-required');

        const errorMessage =
          group.getAttribute('data-error');

        const errorElement =
          document.getElementById(groupId + '_error');

        const checkedBoxes =
          group.querySelectorAll('.cloudpage-checkbox:checked');

        const otherCheckbox =
          document.getElementById(groupId + '_other');

        const otherTextarea =
          document.getElementById(groupId + '_other_text');

        const selectedOptions =
          Array.from(checkedBoxes).map(function (checkbox) {
            return checkbox.value;
          });

        errorElement.textContent = '';
        errorElement.classList.remove('show');

        if (required === 'yes' && selectedOptions.length === 0) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }

        if (
          otherCheckbox.checked &&
          !otherTextarea.value.trim()
        ) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }

        submittedFields[label] = {
          selectedOptions: selectedOptions,
          otherText: otherCheckbox.checked
            ? otherTextarea.value.trim()
            : ''
        };
      });


      // ========================================
      // Store submitted value globally
      // ========================================

      window.cloudPageSubmittedData = {
        fields: submittedFields,
        isValid: isValid
      };

      console.log('Submitted CloudPage Data JSON:');

      console.log(
        JSON.stringify(
          window.cloudPageSubmittedData,
          null,
          2
        )
      );

      if (!isValid) {
        return;
      }

      successOverlay.classList.add('show');
    });
  </script>

  <script src="assets/js/bootstrap.bundle.min.js"></script>

</body>
</html>
`;

  res.json({
    success: true,
    html: generatedHtml,
  });
});

// ========================================
// Start Server
// ========================================

app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;

  console.log(`Server running on ${url}`);
  const open = await import("open");
  await open.default(url);
});
