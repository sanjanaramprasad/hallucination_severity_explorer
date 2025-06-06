// Explore page functionality
class AnnotationExplorer {
    constructor() {
        this.currentAnnotation = null;
        this.activeSpan = null;
        this.tooltip = document.getElementById('tooltip');
        this.init();
    }

    init() {
        this.populateAnnotationSelector();
        this.bindEvents();
        this.loadAnnotation(0); // Load first annotation by default
    }

    populateAnnotationSelector() {
        const selector = document.getElementById('annotation-select');
        annotationsData.forEach((annotation, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = annotation.title;
            selector.appendChild(option);
        });
    }

    bindEvents() {
        const selector = document.getElementById('annotation-select');
        selector.addEventListener('change', (e) => {
            this.loadAnnotation(parseInt(e.target.value));
        });

        // Hide tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.annotation-span')) {
                this.hideTooltip();
                this.clearActiveSpan();
            }
        });
    }

    loadAnnotation(index) {
        this.currentAnnotation = annotationsData[index];
        this.renderSource();
        this.renderSummary();
        this.hideTooltip();
        this.clearActiveSpan();
    }

    renderSource() {
        const sourceContent = document.getElementById('source-content');
        sourceContent.innerHTML = `<p>${this.escapeHtml(this.currentAnnotation.source)}</p>`;
    }

    renderSummary() {
        const summaryContent = document.getElementById('summary-content');
        let summaryText = this.currentAnnotation.summary;
        
        // Sort spans by start index in descending order to avoid index shifting
        const sortedSpans = [...this.currentAnnotation.spans].sort((a, b) => b.startIndex - a.startIndex);
        
        // Insert span elements
        sortedSpans.forEach(span => {
            const beforeText = summaryText.substring(0, span.startIndex);
            const spanText = summaryText.substring(span.startIndex, span.endIndex);
            const afterText = summaryText.substring(span.endIndex);
            
            const spanElement = `<span class="annotation-span" data-span-id="${span.id}">${this.escapeHtml(spanText)}</span>`;
            summaryText = beforeText + spanElement + afterText;
        });

        summaryContent.innerHTML = `<p>${summaryText}</p>`;
        
        // Bind click events to spans
        this.bindSpanEvents();
    }

    bindSpanEvents() {
        const spans = document.querySelectorAll('.annotation-span');
        spans.forEach(span => {
            span.addEventListener('click', (e) => {
                e.stopPropagation();
                const spanId = parseInt(span.getAttribute('data-span-id'));
                this.showSpanDetails(spanId, span);
            });

            span.addEventListener('mouseenter', (e) => {
                if (!span.classList.contains('active')) {
                    span.style.transform = 'translateY(-1px)';
                }
            });

            span.addEventListener('mouseleave', (e) => {
                if (!span.classList.contains('active')) {
                    span.style.transform = 'translateY(0)';
                }
            });
        });
    }

    showSpanDetails(spanId, spanElement) {
        const span = this.currentAnnotation.spans.find(s => s.id === spanId);
        if (!span) return;

        // Clear previous active span
        this.clearActiveSpan();

        // Set new active span
        this.activeSpan = spanElement;
        spanElement.classList.add('active');

        // Show tooltip
        this.showTooltip(span, spanElement);
    }

    showTooltip(span, element) {
        const tooltip = this.tooltip;
        const rect = element.getBoundingClientRect();
        
        // Create tooltip content
        tooltip.innerHTML = `
            <div class="tooltip-header">Annotation Details</div>
            <div class="tooltip-content">
                <div class="tooltip-row">
                    <span class="tooltip-label">Evidence:</span>
                    <div class="rating-dots">
                        ${this.createRatingDots(span.evidence)}
                    </div>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Likelihood:</span>
                    <div class="rating-dots">
                        ${this.createRatingDots(span.likelihood)}
                    </div>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Consequence:</span>
                    <div class="rating-dots">
                        ${this.createRatingDots(span.consequence)}
                    </div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: #9ca3af;">
                    Text: "${span.text}"
                </div>
            </div>
        `;

        // Position tooltip
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.top - tooltipRect.height - 10;

        // Adjust if tooltip goes off screen
        if (left < 10) left = 10;
        if (left + tooltipRect.width > viewportWidth - 10) {
            left = viewportWidth - tooltipRect.width - 10;
        }
        if (top < 10) {
            top = rect.bottom + 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.classList.add('show');
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    clearActiveSpan() {
        if (this.activeSpan) {
            this.activeSpan.classList.remove('active');
            this.activeSpan = null;
        }
    }

    createRatingDots(rating) {
        let dots = '';
        for (let i = 1; i <= 3; i++) {
            const isActive = i <= rating;
            dots += `<span class="dot ${isActive ? 'active' : ''}"></span>`;
        }
        return dots;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the explorer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AnnotationExplorer();
});