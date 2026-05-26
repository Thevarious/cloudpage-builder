// ========================================
// Main Builder Elements
// ========================================

const form = document.getElementById('builderForm');

const inputSource =
    document.getElementById('inputSource');

const fileInputWrap =
    document.getElementById('fileInputWrap');

const urlInputWrap =
    document.getElementById('urlInputWrap');

const analysisPanel =
    document.getElementById('analysisPanel');

const analysisOutput =
    document.getElementById('analysisOutput');

const generateBtn =
    document.getElementById('generateBtn');

const designFilesInput =
    document.getElementById('designFiles');

const functionalityFilesInput =
    document.getElementById('functionalityFiles');

const fieldConfigPanel =
    document.getElementById('fieldConfigPanel');

const fieldRows =
    document.getElementById('fieldRows');

const addFieldBtn =
    document.getElementById('addFieldBtn');
const generatedOutputPanel =
    document.getElementById('generatedOutputPanel');

const generatedHtmlOutput =
    document.getElementById('generatedHtmlOutput');

const copyHtmlBtn =
    document.getElementById('copyHtmlBtn');

const downloadHtmlBtn =
    document.getElementById('downloadHtmlBtn');


// ========================================
// Utility:
// Log uploaded files in console
// ========================================

function logSelectedFiles(input, label) {

    if (!input.files.length) {
        return;
    }

    console.log(`\n${label}:`);

    Array.from(input.files).forEach(file => {

        console.log({
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`
        });

    });

}


// ========================================
// Toggle upload field or URL field
// ========================================

inputSource.addEventListener(
    'change',
    function () {

        const selectedSource =
            inputSource.value;

        fileInputWrap.classList.add('d-none');
        urlInputWrap.classList.add('d-none');

        if (
            selectedSource === 'pdf' ||
            selectedSource === 'docx' ||
            selectedSource === 'image'
        ) {
            fileInputWrap.classList.remove('d-none');
        }

        if (selectedSource === 'url') {
            urlInputWrap.classList.remove('d-none');
        }

    }
);


// ========================================
// Dynamic Form Field Builder
// ========================================

function addFieldRow(fieldName = '') {

    const row =
        document.createElement('div');

    row.className =
        'border rounded p-3 mb-3';

    row.innerHTML = `
    <div class="mb-3">

      <label class="form-label">
        Question / Field Label
      </label>

      <input
        type="text"
        class="form-control field-label"
        value="${fieldName}"
      >

    </div>

    <div class="mb-3">
  <label class="form-label">
    Field Type
  </label>

  <select class="form-select field-type">
    <option value="text">Text</option>
    <option value="email">Email</option>
    <option value="textarea">Textarea</option>
    <option value="checkbox-other">Checkbox with Other textarea</option>
  </select>
</div>

<div class="mb-3">
  <label class="form-label">
    Required?
  </label>

      <select class="form-select field-required">
        <option value="no">
          No
        </option>

        <option value="yes">
          Yes
        </option>
      </select>

    </div>

    <div class="mb-3">

      <label class="form-label">
        Error Message
      </label>

      <input
        type="text"
        class="form-control field-error"
        placeholder="This field cannot be blank."
      >

    </div>

    <button
      type="button"
      class="btn btn-sm btn-outline-danger remove-field"
    >
      Remove
    </button>
  `;

    // Remove row
    row
        .querySelector('.remove-field')
        .addEventListener(
            'click',
            function () {
                row.remove();
            }
        );

    fieldRows.appendChild(row);

}


// ========================================
// Add New Field Button
// ========================================

addFieldBtn.addEventListener(
    'click',
    function () {
        addFieldRow();
    }
);


// ========================================
// Analyze Design Submit
// ========================================

form.addEventListener(
    'submit',
    async function (event) {

        event.preventDefault();

        const formData =
            new FormData(form);

        // Console file log
        logSelectedFiles(
            designFilesInput,
            'Design Files'
        );

        logSelectedFiles(
            functionalityFilesInput,
            'Functionality Files'
        );

        // Send files to backend
        const response =
            await fetch(
                '/analyze-design',
                {
                    method: 'POST',
                    body: formData
                }
            );

        const result =
            await response.json();

        // Show panels
        analysisPanel.classList.remove('d-none');

        fieldConfigPanel.classList.remove('d-none');

        // Reset old fields
        fieldRows.innerHTML = '';

        // Temporary sample fields
        addFieldRow('Name');
        addFieldRow('Email');
        addFieldRow('Other');

        // Show analysis
        analysisOutput.textContent =
            JSON.stringify(
                result.analysis,
                null,
                2
            );

        console.log(
            'Design Analysis JSON:'
        );

        console.log(
            JSON.stringify(
                result.analysis,
                null,
                2
            )
        );

    }
);


// ========================================
// Generate Sample Page
// ========================================

generateBtn.addEventListener(
    'click',
    async function () {

        const projectName =
            document.getElementById('projectName').value;

        const requirements =
            document.getElementById('requirements').value;

        const successTitle =
            document.getElementById('successTitle').value;

        const successMessage =
            document.getElementById('successMessage').value;

        const showSuccessIcon =
            document.getElementById('showSuccessIcon').checked;

        // Collect dynamic fields
        const fields = [];

        document
            .querySelectorAll('#fieldRows > div')
            .forEach(row => {

                fields.push({
                    label: row.querySelector('.field-label').value,
                    type: row.querySelector('.field-type').value,
                    required: row.querySelector('.field-required').value,
                    errorMessage: row.querySelector('.field-error').value
                });

            });

        // Send to backend
        const response =
            await fetch(
                '/generate-page',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        projectName,
                        requirements,
                        fields,
                        successTitle,
                        successMessage,
                        showSuccessIcon
                    })
                }
            );

        const result =
            await response.json();

        console.log(
            'Generated CloudPage HTML:'
        );

        console.log(result.html);

        // alert(
        //     'Sample page generated. Check console.'
        // );
        generatedOutputPanel.classList.remove('d-none');

        generatedHtmlOutput.value = result.html;

    }

);
// ========================================
// Download Generated HTML
// ========================================

downloadHtmlBtn.addEventListener(
    'click',
    function () {

        const blob =
            new Blob(
                [generatedHtmlOutput.value],
                { type: 'text/html' }
            );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement('a');

        link.href = url;

        link.download =
            'generated-cloudpage.html';

        link.click();

        URL.revokeObjectURL(url);

    }
);
// ========================================
// Copy Generated HTML
// ========================================

copyHtmlBtn.addEventListener(
    'click',
    async function () {

        await navigator.clipboard.writeText(
            generatedHtmlOutput.value
        );

        alert('HTML copied.');

    }
);