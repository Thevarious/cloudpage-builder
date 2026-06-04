function generateSurveyTemplate({
  projectName,
  requirements,
  successTitle,
  successMessage,
  showSuccessIcon,
}) {
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${projectName || "Survey CloudPage"}</title>

  <link href="./assets/css/bootstrap.min.css" rel="stylesheet">

  <style>
    body {
      background: #ffffff;
      color: #001965;
    }

    .option {
      cursor: pointer;
    }

    .free-text {
      margin-top: 0.5rem;
      display: none;
    }

    .err-text {
      color: #dc3545;
      display: none;
      margin-top: 0.5rem;
      font-size: 14px;
      font-weight: 700;
    }

    .page-header {
      display: flex;
      justify-content: flex-end;
      padding: 15px 0;
    }

    .page-header img {
      max-height: 75px;
      width: auto;
    }

    .intro-text,
    .intro-text p {
      color: #001965;
      font-size: clamp(16px, 2.5vw, 25px);
      font-style: italic;
      font-weight: 700;
    }

    .submitBtn {
      background-color: #001965;
      border: 2px solid #001965;
      color: #ffffff;
    }

    .submitBtn:hover,
    .submitBtn:focus {
      background-color: #ffffff;
      color: #001965;
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
      to { stroke-dashoffset: 0; }
    }

    @keyframes drawCheck {
      to { stroke-dashoffset: 0; }
    }
  </style>
</head>

<body>
  <div class="container">

    <header class="page-header">
      <a href="http://www.novonordisk.com.sa/" target="_blank" rel="noopener noreferrer">
        <img src="./assets/images/nn-logo.png" alt="Novo Nordisk logo" class="img-fluid">
      </a>
    </header>

    <section class="intro-text mt-4">
      <p>
        ${requirements || "Please complete this short survey."}
      </p>
    </section>

    <form id="surveyForm" novalidate>

      <div class="mb-4" data-q="1" data-type="single">
        <label class="form-label fw-bold pb-2">
          1. Sample single choice question?
        </label>

        <div class="form-check option">
          <input class="form-check-input" type="checkbox" id="q1a" name="q1" value="Option 1">
          <label class="form-check-label" for="q1a">Option 1</label>
        </div>

        <div class="form-check option">
          <input class="form-check-input" type="checkbox" id="q1b" name="q1" value="Option 2">
          <label class="form-check-label" for="q1b">Option 2</label>
        </div>

        <div class="err-text" id="err-q1"></div>
      </div>

      <div class="mb-4" data-q="2" data-type="multi" data-min="1" data-max="3">
        <label class="form-label fw-bold pb-2">
          2. Sample multiple choice question?
        </label>

        <div class="form-check option">
          <input class="form-check-input" type="checkbox" id="q2a" name="q2" value="Choice 1">
          <label class="form-check-label" for="q2a">Choice 1</label>
        </div>

        <div class="form-check option">
          <input class="form-check-input" type="checkbox" id="q2b" name="q2" value="Choice 2">
          <label class="form-check-label" for="q2b">Choice 2</label>
        </div>

        <div class="form-check option">
          <input class="form-check-input" type="checkbox" id="q2c" name="q2" value="other">
          <label class="form-check-label" for="q2c">Other</label>
        </div>

        <textarea
          id="q2-free"
          class="form-control free-text"
          rows="4"
          placeholder="Please specify"
        ></textarea>

        <div class="err-text" id="err-q2"></div>
      </div>

      <button id="submitBtn" type="button" class="btn submitBtn px-5">
        Submit
      </button>

    </form>
  </div>

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

      <h2>${successTitle || "Thank you!"}</h2>

      <p>${successMessage || "Your response has been submitted successfully."}</p>
    </div>
  </div>

  <script src="assets/js/bootstrap.bundle.min.js"></script>

  <script>
    (function () {
      const submitBtn = document.getElementById("submitBtn");

      window.cloudPageSubmittedData = {};

      const ERROR_TEXTS = {
        singleRequired: "Please select one answer.",
        multiRequired: "Please select at least one answer.",
        freeRequired: "Please fill in this field."
      };

      function showError(qId, message) {
        const errorElement = document.getElementById("err-q" + qId);

        if (errorElement) {
          errorElement.textContent = message;
          errorElement.style.display = "block";
        }
      }

      function hideError(qId) {
        const errorElement = document.getElementById("err-q" + qId);

        if (errorElement) {
          errorElement.textContent = "";
          errorElement.style.display = "none";
        }
      }

      function collectCheckboxValues(name) {
        return Array.from(
          document.querySelectorAll('input[name="' + name + '"]:checked')
        ).map(function (input) {
          return input.value;
        });
      }

      function getRule(questionBlock) {
        return {
          type: questionBlock.dataset.type || "single",
          min: questionBlock.dataset.min ? Number(questionBlock.dataset.min) : 1,
          max: questionBlock.dataset.max ? Number(questionBlock.dataset.max) : null
        };
      }

      function getErrorMessage(rule) {
        if (rule.type === "single") {
          return ERROR_TEXTS.singleRequired;
        }

        if (rule.max) {
          return "Please select between " + rule.min + " and " + rule.max + " answers.";
        }

        return ERROR_TEXTS.multiRequired;
      }

      function updateOtherField(input) {
        if (!input || input.value !== "other") {
          return;
        }

        const questionName = input.name;
        const questionNumber = questionName.replace("q", "");
        const freeText = document.getElementById(questionName + "-free");

        if (!freeText) {
          return;
        }

        if (input.checked) {
          freeText.style.display = "block";
          freeText.focus();
        } else {
          freeText.value = "";
          freeText.style.display = "none";
          hideError(questionNumber);
        }
      }

      function onCheckboxToggled(input) {
        if (!input || !input.name) {
          return;
        }

        const questionName = input.name;
        const questionNumber = questionName.replace("q", "");
        const questionBlock = input.closest("[data-q]");
        const rule = getRule(questionBlock);

        hideError(questionNumber);

        if (rule.type === "single" && input.checked) {
          document
            .querySelectorAll('input[name="' + questionName + '"]')
            .forEach(function (otherInput) {
              if (otherInput !== input && otherInput.checked) {
                otherInput.checked = false;
                updateOtherField(otherInput);
              }
            });
        }

        if (rule.type === "multi" && input.checked && rule.max) {
          const selected = collectCheckboxValues(questionName);

          if (selected.length > rule.max) {
            input.checked = false;
            showError(questionNumber, getErrorMessage(rule));
          }
        }

        updateOtherField(input);
      }

      function validateAndCollect() {
        const result = {};
        let valid = true;

        document.querySelectorAll("[data-q]").forEach(function (questionBlock) {
          const questionNumber = questionBlock.getAttribute("data-q");
          const questionName = "q" + questionNumber;
          const rule = getRule(questionBlock);
          const selected = collectCheckboxValues(questionName);

          if (rule.type === "single" && selected.length !== 1) {
            showError(questionNumber, getErrorMessage(rule));
            valid = false;
          }

          if (rule.type === "multi") {
            if (selected.length < rule.min || (rule.max && selected.length > rule.max)) {
              showError(questionNumber, getErrorMessage(rule));
              valid = false;
            }
          }

          const freeText = document.getElementById(questionName + "-free");

          if (freeText && freeText.style.display !== "none") {
            const freeValue = freeText.value.trim();

            if (!freeValue) {
              showError(questionNumber, ERROR_TEXTS.freeRequired);
              valid = false;
              result[questionName] = { selected };
            } else {
              result[questionName] = {
                selected,
                freeText: freeValue
              };
            }
          } else {
            result[questionName] = { selected };
          }
        });

        return {
          valid,
          result
        };
      }

      submitBtn.addEventListener("click", function () {
        const data = validateAndCollect();

        if (!data.valid) {
          const firstError = document.querySelector('.err-text[style*="display: block"]');

          if (firstError) {
            firstError.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });
          }

          return;
        }

        window.cloudPageSubmittedData = data.result;

        console.log("Submitted CloudPage Data JSON:");
        console.log(JSON.stringify(window.cloudPageSubmittedData, null, 2));

        const successOverlay =
  document.getElementById("successOverlay");

if (successOverlay) {
  successOverlay.classList.add("show");
}
      });

      document.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
        input.addEventListener("change", function () {
          onCheckboxToggled(input);
        });
      });

      document.querySelectorAll(".free-text").forEach(function (freeText) {
        freeText.addEventListener("input", function () {
          const match = (freeText.id || "").match(/^q(\\d+)-free$/);

          if (match) {
            hideError(match[1]);
          }
        });
      });
    })();
  </script>
</body>
</html>
`;
}

module.exports = {
  generateSurveyTemplate,
};
