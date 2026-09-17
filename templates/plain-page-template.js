// ========================================
// Plain / Content Page Template
// ========================================
//
// Purpose:
// Generates a responsive CloudPage without a form.
//
// Suitable for:
// - Landing pages
// - Educational/content pages
// - Informational pages
// - Image + text layouts
// - CTA pages
//
// Important:
// This is currently a generic template.
// Later, AI design analysis will provide the actual
// detected content, layout, images and styling.
// ========================================

function generatePlainPageTemplate({
  projectName,
  requirements,
}) {
  return `
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

  <!-- Local Bootstrap CSS -->
  <link
    href="assets/css/bootstrap.min.css"
    rel="stylesheet"
  >

  <style>
    /* ========================================
       Base Page Styles
       ======================================== */

    body {
      margin: 0;
      background: #ffffff;
      font-family: Arial, Helvetica, sans-serif;
      color: #001965;
    }

    /* ========================================
       Main Wrapper
       ======================================== */

    .page-wrapper {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    /* ========================================
       Header
       ======================================== */

    .page-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 20px 0;
    }

    .page-header img {
      width: auto;
      max-height: 75px;
    }

    /* ========================================
       Main Content
       ======================================== */

    .main-content {
      padding: 40px 0 60px;
    }

    .content-section {
      margin-bottom: 40px;
    }

    .page-title {
      margin-bottom: 24px;
      font-size: clamp(28px, 5vw, 48px);
      line-height: 1.2;
      font-weight: 700;
    }

    .page-copy {
      max-width: 900px;
      font-size: 18px;
      line-height: 1.6;
    }

    /* ========================================
       Optional Content Image
       ======================================== */

    .content-image {
      display: block;
      width: 100%;
      height: auto;
      margin-top: 30px;
    }

    /* ========================================
       CTA
       ======================================== */

    .page-cta {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 28px;
      background: #001965;
      border: 2px solid #001965;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 700;
      text-decoration: none;
      transition:
        background-color 0.15s ease,
        color 0.15s ease;
    }

    .page-cta:hover,
    .page-cta:focus {
      background: #ffffff;
      color: #001965;
    }

    /* ========================================
       Footer
       ======================================== */

    .page-footer {
      padding: 24px 0;
      border-top: 1px solid #dddddd;
      font-size: 13px;
    }

    /* ========================================
       Responsive
       ======================================== */

    @media (max-width: 767px) {
      .page-wrapper {
        padding: 0 16px;
      }

      .main-content {
        padding: 24px 0 40px;
      }

      .page-copy {
        font-size: 16px;
      }
    }
  </style>
</head>

<body>

  <div class="page-wrapper">

    <!-- ========================================
         Header
         ======================================== -->

    <header class="page-header">

      <a
        href="https://www.novonordisk.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="assets/images/nn-logo.png"
          alt="Novo Nordisk logo"
          class="img-fluid"
        >
      </a>

    </header>


    <!-- ========================================
         Main Content
         ======================================== -->

    <main class="main-content">

      <section class="content-section">

        <h1 class="page-title">
          ${projectName || "Generated CloudPage"}
        </h1>

        <div class="page-copy">

          <p>
            ${
              requirements ||
              "Page content will be generated here based on the supplied design and requirements."
            }
          </p>

        </div>

      </section>


      <!-- ========================================
           Future AI Generated Sections

           Later the AI design schema can insert:
           - headings
           - paragraphs
           - images
           - cards
           - buttons
           - columns
           - banners
           - disclaimers
           - footer content
           ======================================== -->

    </main>


    <!-- ========================================
         Footer
         ======================================== -->

    <footer class="page-footer">
      <p class="mb-0">
        © Novo Nordisk
      </p>
    </footer>

  </div>


  <!-- Local Bootstrap JS -->
  <script src="assets/js/bootstrap.bundle.min.js"></script>

</body>

</html>
`;
}


// ========================================
// Export Template
// ========================================

module.exports = {
  generatePlainPageTemplate,
};