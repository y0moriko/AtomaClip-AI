// AtomaClip AI - PDF Detection and Clipping Module
// This script extends content_script.js for PDF handling

class AtomaClipPDF {
  constructor() {
    this.isPDF = false;
    this.pdfViewer = null;
    this.selection = null;
    this.highlights = [];
    this.apiUrl = "https://atomaclip-ai.onrender.com";
    
    this.init();
  }

  async init() {
    // Check if this is a PDF URL
    const url = window.location.href.toLowerCase();
    const pdfPatterns = [
      /\.pdf$/i,
      /docs\.google\.com\/viewer/i,
      /drive\.google\.com\/file/i,
      /arxiv\.org\/pdf/i,
      /researchgate\.net\/publication/i,
      /sci-hub/i,
      /jstor\.org/i,
      /springer\.com\/article/i
    ];

    this.isPDF = pdfPatterns.some(pattern => pattern.test(url));

    if (this.isPDF) {
      console.log("AtomaClip: PDF detected - enabling PDF mode");
      await this.setupPDFMode();
    }
  }

  async setupPDFMode() {
    // Wait for PDF.js to load if available
    if (typeof pdfjsLib !== 'undefined') {
      await this.enableNativePDFCapture();
    } else if (this.isGoogleDocsViewer()) {
      await this.enableGoogleDocsPDFCapture();
    } else {
      // For other PDFs, try to inject PDF.js
      await this.injectPDFJS();
    }
  }

  isGoogleDocsViewer() {
    return window.location.href.includes('docs.google.com/viewer');
  }

  async enableNativePDFCapture() {
    console.log("AtomaClip: Native PDF capture enabled");
    
    // PDF.js is loaded, set up text layer capture
    document.addEventListener('mouseup', (e) => this.handlePDFSelection(e));
  }

  async enableGoogleDocsPDFCapture() {
    console.log("AtomaClip: Google Docs PDF viewer detected");
    
    // Google Docs viewer - capture from text layer
    const checkInterval = setInterval(() => {
      const textLayer = document.querySelector('.textLayer');
      if (textLayer) {
        clearInterval(checkInterval);
        this.setupTextLayerCapture(textLayer);
      }
    }, 1000);

    // Timeout after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
  }

  setupTextLayerCapture(textLayer) {
    console.log("AtomaClip: Text layer found, enabling capture");
    
    // Use MutationObserver to watch for text selection changes
    const observer = new MutationObserver(() => {
      // Text layer mutated
    });

    document.addEventListener('mouseup', (e) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      
      if (selectedText.length > 10) {
        console.log("AtomaClip: PDF text selected:", selectedText.substring(0, 50) + "...");
        // Trigger capture via message to background
        this.triggerCapture(selectedText);
      }
    });
  }

  async injectPDFJS() {
    // Load PDF.js from CDN
    const pdfjsLib = document.createElement('script');
    pdfjsLib.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    pdfjsLib.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      this.setupPDFJSCapture();
    };
    document.head.appendChild(pdfjsLib);
  }

  async setupPDFJSCapture() {
    console.log("AtomaClip: PDF.js loaded, setting up capture");
    
    try {
      const loadingTask = pdfjsLib.getDocument(window.location.href);
      const pdf = await loadingTask.promise;
      
      console.log(`AtomaClip: Loaded PDF with ${pdf.numPages} pages`);
      
      // For now, set up global capture
      document.addEventListener('mouseup', (e) => this.handlePDFSelection(e));
      
      // Add a floating capture hint
      this.showPDFHint();
      
    } catch (error) {
      console.error("AtomaClip: Failed to load PDF:", error);
    }
  }

  showPDFHint() {
    // Don't show if already exists
    if (document.getElementById('atomaclip-pdf-hint')) return;
    
    const hint = document.createElement('div');
    hint.id = 'atomaclip-pdf-hint';
    hint.innerHTML = `
      <style>
        #atomaclip-pdf-hint {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          z-index: 999999;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: atomaclip-hint-in 0.3s ease;
        }
        @keyframes atomaclip-hint-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        #atomaclip-pdf-hint svg {
          width: 16px;
          height: 16px;
        }
      </style>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      AtomaClip: Select text in PDF to capture
    `;
    document.body.appendChild(hint);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.5s';
      setTimeout(() => hint.remove(), 500);
    }, 5000);
  }

  handlePDFSelection(event) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // Ignore very short selections
    if (selectedText.length < 5) return;
    
    // Ignore if clicking on UI elements
    const target = event.target;
    if (target.closest('#atomaclip-popup') || target.closest('#atomaclip-pdf-hint')) return;
    
    console.log("AtomaClip: PDF selection:", selectedText.substring(0, 100) + "...");
    
    // Get context around selection
    const context = this.getPDFContext(selectedText);
    
    // Trigger capture
    this.triggerCapture(selectedText, context);
  }

  getPDFContext(selectedText) {
    // Try to get page number
    let pageNumber = 'Unknown';
    
    // For Google Docs viewer
    const pageIndicator = document.querySelector('.page-label');
    if (pageIndicator) {
      pageNumber = pageIndicator.textContent;
    }
    
    // Try to get chapter/section
    let section = '';
    const headings = document.querySelectorAll('h1, h2, h3, [role="heading"]');
    if (headings.length > 0) {
      section = headings[0].textContent || '';
    }
    
    return {
      page: pageNumber,
      section: section,
      source: window.location.href
    };
  }

  async triggerCapture(text, context = {}) {
    // Send message to background to trigger capture
    chrome.runtime.sendMessage({
      action: "CAPTURE_FROM_PDF",
      data: {
        content: text,
        context_before: context.before || '',
        context_after: context.after || '',
        source_url: window.location.href,
        page_title: document.title,
        source_type: 'pdf',
        metadata: {
          page: context.page,
          section: context.section
        }
      }
    }, (response) => {
      if (response && response.success) {
        this.showCaptureSuccess();
      }
    });
  }

  showCaptureSuccess() {
    const toast = document.createElement('div');
    toast.id = 'atomaclip-pdf-toast';
    toast.innerHTML = `
      <style>
        #atomaclip-pdf-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          z-index: 9999999;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: atomaclip-toast-in 0.3s ease;
        }
        @keyframes atomaclip-toast-in {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        #atomaclip-pdf-toast svg {
          width: 16px;
          height: 16px;
        }
      </style>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Atom Captured!
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s';
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.atomaclipPDF = new AtomaClipPDF();
});

// Also try immediately in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  window.atomaclipPDF = new AtomaClipPDF();
}
