// ========================================
// Simple Form Template
// Generates a basic CloudPage with text/email/textarea fields,
// checkbox + Other textarea logic, validation, success popup,
// and inline JS for SFMC usage.
// ========================================

function generateFieldRowsHtml(fields = []) {
  return fields
    .map((field, index) => {
      const fieldId = `field_${index + 1}`;
      const label = field.label || `Field ${index + 1}`;
      const type = field.type || "text";
      const required = field.required || "no";
      const errorMessage = field.errorMessage || "This field cannot be blank.";

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
}

function generateSimpleFormTemplate({
  projectName,
  requirements,
  fields,
  successTitle,
  successMessage,
  showSuccessIcon,
}) {
  const fieldRowsHtml = generateFieldRowsHtml(fields);

  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${projectName || "CloudPage"}</title>

  <link href="assets/css/bootstrap.min.css" rel="stylesheet">

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
      to { stroke-dashoffset: 0; }
    }

    @keyframes drawCheck {
      to { stroke-dashoffset: 0; }
    }
  </style>
</head>

<body>
  <main class="cloudpage-wrapper">
    <section class="cloudpage-card">
      <h1>${projectName || "Generated CloudPage"}</h1>

      <p>${requirements || "No requirements added."}</p>

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

      <h2>${successTitle || "Thank you!"}</h2>

      <p>${successMessage || "Your response has been submitted successfully."}</p>
    </div>
  </div>

  <script>
    window.cloudPageSubmittedData = {
      fields: {},
      isValid: false
    };

    const cloudPageForm = document.getElementById('cloudPageForm');
    const successOverlay = document.getElementById('successOverlay');
    const otherCheckboxes = document.querySelectorAll('.other-checkbox');

    otherCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', function () {
        const groupId = checkbox.getAttribute('data-group');
        const otherWrap = document.getElementById(groupId + '_other_wrap');
        const otherText = document.getElementById(groupId + '_other_text');
        const errorElement = document.getElementById(groupId + '_error');

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

    cloudPageForm.addEventListener('submit', function (event) {
      event.preventDefault();

      let isValid = true;
      const submittedFields = {};

      const normalFields = document.querySelectorAll('.cloudpage-field');

      normalFields.forEach(function (field) {
        const label = field.getAttribute('data-label');
        const required = field.getAttribute('data-required');
        const errorMessage = field.getAttribute('data-error');
        const errorElement = document.getElementById(field.id + '_error');
        const value = field.value.trim();

        submittedFields[label] = value;
        errorElement.textContent = '';
        errorElement.classList.remove('show');

        if (required === 'yes' && !value) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }
      });

      const checkboxGroups = document.querySelectorAll('.checkbox-other-group');

      checkboxGroups.forEach(function (group) {
        const groupId = group.getAttribute('data-group');
        const label = group.getAttribute('data-label');
        const required = group.getAttribute('data-required');
        const errorMessage = group.getAttribute('data-error');
        const errorElement = document.getElementById(groupId + '_error');
        const checkedBoxes = group.querySelectorAll('.cloudpage-checkbox:checked');
        const otherCheckbox = document.getElementById(groupId + '_other');
        const otherTextarea = document.getElementById(groupId + '_other_text');

        const selectedOptions = Array.from(checkedBoxes).map(function (checkbox) {
          return checkbox.value;
        });

        errorElement.textContent = '';
        errorElement.classList.remove('show');

        if (required === 'yes' && selectedOptions.length === 0) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }

        if (otherCheckbox.checked && !otherTextarea.value.trim()) {
          isValid = false;
          errorElement.textContent = errorMessage;
          errorElement.classList.add('show');
        }

        submittedFields[label] = {
          selectedOptions: selectedOptions,
          otherText: otherCheckbox.checked ? otherTextarea.value.trim() : ''
        };
      });

      window.cloudPageSubmittedData = {
        fields: submittedFields,
        isValid: isValid
      };

      console.log('Submitted CloudPage Data JSON:');
      console.log(JSON.stringify(window.cloudPageSubmittedData, null, 2));

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
}

module.exports = {
  generateSimpleFormTemplate,
};
