document.addEventListener("DOMContentLoaded", () => {
    setupCodeViewers();
    setupDownloadButtons();
    setupCopyButtons();
});

// Set up code viewer
function setupCodeViewers() {
    const viewCodeButtons = document.querySelectorAll(".view-code-btn");
    viewCodeButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const card = this.closest(".code-card");
            const codeViewer = card.querySelector(".code-viewer");
            const isVisible = codeViewer.classList.contains("visible");
            if (isVisible) {
                codeViewer.classList.remove("visible");
                this.innerHTML = '👁️ View Code';
            } else {
                codeViewer.classList.add("visible");
                this.innerHTML = '🔼 Hide Code';
                if (window.Prism) {
                    Prism.highlightAllUnder(codeViewer);
                }
            }
            document.querySelectorAll(".code-viewer.visible").forEach((viewer) => {
                if (viewer !== codeViewer) {
                    viewer.classList.remove("visible");
                    const otherButton = otherCard.querySelector(".view-code-btn");
                    otherButton.innerHTML = '👁️ View Code';
                }
            });
        });
    });
}

// Set up download buttons
function setupDownloadButtons() {
    const downloadButtons = document.querySelectorAll(".download-code-btn");
    downloadButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const card = this.closest(".code-card");
            const fileName = card.querySelector(".file-name").textContent.trim();
            const codeContent = card.querySelector("code").textContent;
            downloadFile(fileName, codeContent);
            const originalContent = this.innerHTML;
            this.innerHTML = '✅ Downloaded!';
            this.disabled = true;
            setTimeout(() => {
                this.innerHTML = originalContent;
                this.disabled = false;
            }, 2000);
        });
    });
}

// Set up copy buttons
function setupCopyButtons() {
    const copyButtons = document.querySelectorAll(".copy-code-btn");
    copyButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const codeContent = this.closest(".code-viewer").querySelector("code").textContent;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(codeContent).then(() => {
                    showCopyFeedback(this);
                }).catch(err => {
                    showError("Async copy failed, falling back:" + err);
                    fallbackCopyTextToClipboard(codeContent, this);
                });
            } else {
                fallbackCopyTextToClipboard(codeContent, this);
            }
        });
    });
}

// Show error notification
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-notification';
    errorEl.textContent = message;
    errorEl.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(errorEl);
    setTimeout(() => {
        errorEl.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => errorEl.remove(), 300);
    }, 3000);
}

// Show feedback after copying
function showCopyFeedback(button) {
    const originalContent = button.textContent;
    button.textContent = "✅";
    button.style.color = "var(--accent-green)";
    setTimeout(() => {
        button.textContent = originalContent;
        button.style.color = "";
    }, 2000);
}

// Download file utility
function downloadFile(filename, content) {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
}

// Fallback copy to clipboard for older browsers
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand("copy");
        showCopyFeedback(button);
    } 
    catch (err) {
        showError("Fallback copy failed:" + err);
    }
    document.body.removeChild(textArea);
}
