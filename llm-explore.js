// LLM Annotation Explorer - adapted for LLM data with model information
class LLMAnnotationExplorer {
    constructor() {
        this.currentAnnotation = null;
        this.activeSpan = null;
        this.tooltip = null;
        this.isInitialized = false;
        
        // Error tracking
        this.errors = [];
        
        try {
            this.init();
        } catch (error) {
            this.handleCriticalError('Failed to initialize LLMAnnotationExplorer', error);
        }
    }

    init() {
        try {
            // Validate required DOM elements
            this.validateRequiredElements();
            
            // Validate data
            this.validateData();
            
            // Initialize components
            this.tooltip = document.getElementById('tooltip');
            this.populateAnnotationSelector();
            this.bindEvents();
            this.loadAnnotation(0); // Load first annotation by default
            
            this.isInitialized = true;
            console.log('LLMAnnotationExplorer initialized successfully');
            
        } catch (error) {
            this.handleCriticalError('Initialization failed', error);
        }
    }

    validateRequiredElements() {
        const requiredElements = [
            'annotation-select',
            'source-content', 
            'summary-content',
            'tooltip',
            'model-info'
        ];
        
        const missingElements = [];
        
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missingElements.push(id);
            }
        });
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
    }

    validateData() {
        if (typeof llmAnnotationsData === 'undefined') {
            throw new Error('llmAnnotationsData is not defined. Make sure llm-data.js is loaded.');
        }
        
        if (!Array.isArray(llmAnnotationsData) || llmAnnotationsData.length === 0) {
            throw new Error('llmAnnotationsData must be a non-empty array');
        }
        
        // Validate each annotation structure
        llmAnnotationsData.forEach((annotation, index) => {
            this.validateAnnotation(annotation, index);
        });
    }

    validateAnnotation(annotation, index) {
        const requiredFields = ['id', 'title', 'model', 'source', 'summary', 'spans'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!(field in annotation)) {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            throw new Error(`LLM Annotation ${index} missing required fields: ${missingFields.join(', ')}`);
        }
        
        if (!Array.isArray(annotation.spans)) {
            throw new Error(`LLM Annotation ${index} spans must be an array`);
        }
        
        // Validate spans
        annotation.spans.forEach((span, spanIndex) => {
            this.validateSpan(span, index, spanIndex);
        });
    }

    validateSpan(span, annotationIndex, spanIndex) {
        const requiredFields = ['id', 'text', 'startIndex', 'endIndex', 'verifiability', 'plausibility', 'innocuity'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!(field in span)) {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            this.logError(`LLM Annotation ${annotationIndex}, Span ${spanIndex} missing fields: ${missingFields.join(', ')}`);
        }
        
        // Validate continuous rating values (0.0 - 1.0)
        ['verifiability', 'plausibility', 'innocuity'].forEach(rating => {
            if (span[rating] !== undefined) {
                if (typeof span[rating] !== 'number' || span[rating] < 0 || span[rating] > 1) {
                    this.logError(`LLM Annotation ${annotationIndex}, Span ${spanIndex}: ${rating} must be between 0.0 and 1.0, got ${span[rating]}`);
                }
            }
        });
        
        // Validate indices
        if (span.startIndex >= span.endIndex) {
            this.logError(`LLM Annotation ${annotationIndex}, Span ${spanIndex}: startIndex must be less than endIndex`);
        }
    }

    populateAnnotationSelector() {
        try {
            const selector = document.getElementById('annotation-select');
            if (!selector) {
                throw new Error('Annotation selector not found');
            }
            
            // Clear existing options
            selector.innerHTML = '';
            
            llmAnnotationsData.forEach((annotation, index) => {
                try {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${annotation.title} (${annotation.model})` || `LLM Annotation ${index + 1}`;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for LLM annotation ${index}`, error);
                }
            });
            
        } catch (error) {
            this.handleError('Failed to populate annotation selector', error);
        }
    }

    bindEvents() {
        try {
            const selector = document.getElementById('annotation-select');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    try {
                        const index = parseInt(e.target.value);
                        if (isNaN(index) || index < 0 || index >= llmAnnotationsData.length) {
                            throw new Error(`Invalid annotation index: ${e.target.value}`);
                        }
                        this.loadAnnotation(index);
                    } catch (error) {
                        this.handleError('Failed to handle annotation selection', error);
                    }
                });
            }

            // Hide tooltip when clicking outside
            document.addEventListener('click', (e) => {
                try {
                    if (!e.target.closest('.annotation-span')) {
                        this.hideTooltip();
                        this.clearActiveSpan();
                    }
                } catch (error) {
                    this.logError('Error in click handler', error);
                }
            });
            
        } catch (error) {
            this.handleError('Failed to bind events', error);
        }
    }

    loadAnnotation(index) {
        try {
            if (index < 0 || index >= llmAnnotationsData.length) {
                throw new Error(`Invalid annotation index: ${index}`);
            }
            
            this.currentAnnotation = llmAnnotationsData[index];
            
            // Render components with error handling
            this.safeRender(() => this.renderSource(), 'source');
            this.safeRender(() => this.renderSummary(), 'summary');
            this.safeRender(() => this.renderModelInfo(), 'model info');
            
            this.hideTooltip();
            this.clearActiveSpan();
            
        } catch (error) {
            this.handleError(`Failed to load annotation ${index}`, error);
        }
    }

    safeRender(renderFunction, componentName) {
        try {
            renderFunction();
        } catch (error) {
            this.handleError(`Failed to render ${componentName}`, error);
            // Show fallback content
            this.showFallbackContent(componentName);
        }
    }

    showFallbackContent(componentName) {
        const elementId = `${componentName.replace(' ', '-')}-content`;
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<p style="color: #dc2626; font-style: italic;">Error loading ${componentName} content. Please try refreshing the page.</p>`;
        }
    }

    renderSource() {
        const sourceContent = document.getElementById('source-content');
        if (!sourceContent) {
            throw new Error('Source content element not found');
        }
        
        if (!this.currentAnnotation?.source) {
            throw new Error('No source content available');
        }
        
        sourceContent.innerHTML = `<p>${this.escapeHtml(this.currentAnnotation.source)}</p>`;
    }

    renderModelInfo() {
        const modelInfo = document.getElementById('model-info');
        if (!modelInfo) {
            return; // Optional element
        }
        
        if (this.currentAnnotation?.model) {
            modelInfo.innerHTML = `
                <div style="margin-bottom: 16px; padding: 12px; background: var(--background-secondary); border-radius: var(--radius); border: 1px solid var(--border-light);">
                    <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                        LLM Model
                    </div>
                    <div style="font-size: 14px; font-weight: 500; color: var(--primary-color);">
                        ${this.escapeHtml(this.currentAnnotation.model)}
                    </div>
                </div>
            `;
        } else {
            modelInfo.innerHTML = '';
        }
    }

    renderSummary() {
        const summaryContent = document.getElementById('summary-content');
        if (!summaryContent) {
            throw new Error('Summary content element not found');
        }
        
        if (!this.currentAnnotation?.summary) {
            throw new Error('No summary content available');
        }
        
        let summaryText = this.currentAnnotation.summary;
        
        // Validate spans exist
        if (!this.currentAnnotation.spans || this.currentAnnotation.spans.length === 0) {
            summaryContent.innerHTML = `<p>${this.escapeHtml(summaryText)}</p>`;
            return;
        }
        
        try {
            // Create an array to track text segments and spans
            const segments = [];
            let lastIndex = 0;
            
            // Sort spans by start index and validate
            const sortedSpans = [...this.currentAnnotation.spans]
                .filter(span => span.startIndex >= 0 && span.endIndex <= summaryText.length)
                .sort((a, b) => a.startIndex - b.startIndex);
            
            // Process each span
            sortedSpans.forEach((span, index) => {
                try {
                    // Validate span indices
                    if (span.startIndex < lastIndex) {
                        this.logError(`Overlapping spans detected at span ${index}`);
                        return; // Skip overlapping span
                    }
                    
                    // Add text before this span
                    if (span.startIndex > lastIndex) {
                        segments.push({
                            type: 'text',
                            content: summaryText.substring(lastIndex, span.startIndex)
                        });
                    }
                    
                    // Add the span
                    const spanText = summaryText.substring(span.startIndex, span.endIndex);
                    if (spanText.trim()) { // Only add non-empty spans
                        segments.push({
                            type: 'span',
                            content: spanText,
                            spanId: span.id
                        });
                    }
                    
                    lastIndex = span.endIndex;
                } catch (error) {
                    this.logError(`Error processing span ${index}`, error);
                }
            });
            
            // Add remaining text after last span
            if (lastIndex < summaryText.length) {
                segments.push({
                    type: 'text',
                    content: summaryText.substring(lastIndex)
                });
            }
            
            // Build the final HTML - using red for hallucinations
            let html = '';
            segments.forEach(segment => {
                if (segment.type === 'text') {
                    html += this.escapeHtml(segment.content);
                } else if (segment.type === 'span') {
                    // Apply red highlighting for hallucinations
                    html += `<span class="annotation-span" data-span-id="${segment.spanId}" style="background: linear-gradient(120deg, #fecaca 0%, #f87171 100%); color: #dc2626; font-weight: 500; padding: 2px 4px; border-radius: 4px; border-left: 3px solid #dc2626; cursor: pointer;">${this.escapeHtml(segment.content)}</span>`;
                }
            });
            
            summaryContent.innerHTML = `<p>${html}</p>`;
            
            // Bind click events to spans
            this.bindSpanEvents();
            
        } catch (error) {
            this.logError('Error building summary HTML', error);
            // Fallback to plain text
            summaryContent.innerHTML = `<p>${this.escapeHtml(summaryText)}</p>`;
        }
    }

    bindSpanEvents() {
        try {
            const spans = document.querySelectorAll('.annotation-span');
            spans.forEach((span, index) => {
                try {
                    span.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const spanId = parseInt(span.getAttribute('data-span-id'));
                        if (isNaN(spanId)) {
                            this.logError(`Invalid span ID: ${span.getAttribute('data-span-id')}`);
                            return;
                        }
                        this.showSpanDetails(spanId, span);
                    });

                    span.addEventListener('mouseenter', (e) => {
                        if (!span.classList.contains('active')) {
                            span.style.transform = 'translateY(-1px)';
                            span.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                        }
                    });

                    span.addEventListener('mouseleave', (e) => {
                        if (!span.classList.contains('active')) {
                            span.style.transform = 'translateY(0)';
                            span.style.boxShadow = 'none';
                        }
                    });
                } catch (error) {
                    this.logError(`Failed to bind events for span ${index}`, error);
                }
            });
        } catch (error) {
            this.handleError('Failed to bind span events', error);
        }
    }

    showSpanDetails(spanId, spanElement) {
        try {
            const span = this.currentAnnotation.spans.find(s => s.id === spanId);
            if (!span) {
                throw new Error(`Span with ID ${spanId} not found`);
            }

            // Clear previous active span
            this.clearActiveSpan();

            // Set new active span - darker red for active state
            this.activeSpan = spanElement;
            spanElement.classList.add('active');
            spanElement.style.background = 'linear-gradient(120deg, #dc2626 0%, #b91c1c 100%)';
            spanElement.style.color = 'white';

            // Show tooltip
            this.showTooltip(span, spanElement);
            
        } catch (error) {
            this.handleError('Failed to show span details', error);
        }
    }

    showTooltip(span, element) {
        try {
            if (!this.tooltip) {
                throw new Error('Tooltip element not found');
            }
            
            const rect = element.getBoundingClientRect();
            
            // Create tooltip content with hallucination severity ratings
            const verifiability = this.validateRating(span.verifiability) ? span.verifiability : 0;
            const plausibility = this.validateRating(span.plausibility) ? span.plausibility : 0;
            const innocuity = this.validateRating(span.innocuity) ? span.innocuity : 0;
            
            this.tooltip.innerHTML = `
                <div class="tooltip-header">Hallucination Severity</div>
                <div class="tooltip-content">
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="tooltip-label" style="min-width: 80px;">Verifiability:</span>
                        ${this.createRatingBar(verifiability, 'Verifiability')}
                    </div>
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="tooltip-label" style="min-width: 80px;">Plausibility:</span>
                        ${this.createRatingBar(plausibility, 'Plausibility')}
                    </div>
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span class="tooltip-label" style="min-width: 80px;">Innocuity:</span>
                        ${this.createRatingBar(innocuity, 'Innocuity')}
                    </div>
                    <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #374151;">
                        <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 4px;">Precise Values:</div>
                        <div style="font-size: 0.75rem; color: #d1d5db;">
                            Verifiability: ${verifiability.toFixed(2)} | Plausibility: ${plausibility.toFixed(2)} | Innocuity: ${innocuity.toFixed(2)}
                        </div>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.8rem; color: #9ca3af;">
                        Text: "${this.escapeHtml(span.text || 'No text available')}"
                    </div>
                    <div style="margin-top: 8px; font-size: 0.75rem; color: #dc2626; font-weight: 500;">
                        Model: ${this.escapeHtml(this.currentAnnotation.model)}
                    </div>
                </div>
            `;
    
            // Position tooltip safely
            this.positionTooltip(rect);
            
        } catch (error) {
            this.handleError('Failed to show tooltip', error);
        }
    }

    positionTooltip(elementRect) {
        try {
            const tooltip = this.tooltip;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Get tooltip dimensions (approximate)
            tooltip.style.visibility = 'hidden';
            tooltip.classList.add('show');
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.visibility = 'visible';

            let left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
            let top = elementRect.top - tooltipRect.height - 10;

            // Adjust if tooltip goes off screen
            if (left < 10) left = 10;
            if (left + tooltipRect.width > viewportWidth - 10) {
                left = viewportWidth - tooltipRect.width - 10;
            }
            if (top < 10) {
                top = elementRect.bottom + 10;
            }

            tooltip.style.left = `${Math.max(0, left)}px`;
            tooltip.style.top = `${Math.max(0, top)}px`;
            
        } catch (error) {
            this.logError('Failed to position tooltip', error);
        }
    }

    validateRating(rating) {
        return typeof rating === 'number' && rating >= 0 && rating <= 1;
    }

    hideTooltip() {
        try {
            if (this.tooltip) {
                this.tooltip.classList.remove('show');
            }
        } catch (error) {
            this.logError('Failed to hide tooltip', error);
        }
    }

    clearActiveSpan() {
        try {
            if (this.activeSpan) {
                this.activeSpan.classList.remove('active');
                // Reset to red styling for hallucinations
                this.activeSpan.style.background = 'linear-gradient(120deg, #fecaca 0%, #f87171 100%)';
                this.activeSpan.style.color = '#dc2626';
                this.activeSpan.style.transform = 'translateY(0)';
                this.activeSpan.style.boxShadow = 'none';
                this.activeSpan = null;
            }
        } catch (error) {
            this.logError('Failed to clear active span', error);
        }
    }

    createRatingBar(rating, label) {
        try {
            const validRating = this.validateRating(rating) ? rating : 0;
            const percentage = Math.round(validRating * 100);
            
            // Color coding for hallucination severity ratings
            let barColor = '#ef4444'; // Default red
            
            if (label === 'Verifiability') {
                // For verifiability: green = high verifiability (good), red = low verifiability (bad)
                if (validRating >= 0.7) barColor = '#10b981'; // Green for high verifiability
                else if (validRating >= 0.4) barColor = '#f59e0b'; // Orange for medium
                else barColor = '#ef4444'; // Red for low verifiability
            } else if (label === 'Plausibility') {
                // For plausibility: green = high plausibility (less concerning), red = low plausibility (very concerning)
                if (validRating >= 0.7) barColor = '#10b981'; // Green for high plausibility
                else if (validRating >= 0.4) barColor = '#f59e0b'; // Orange for medium
                else barColor = '#ef4444'; // Red for low plausibility
            } else if (label === 'Innocuity') {
                // For innocuity: green = high innocuity (harmless), red = low innocuity (harmful)
                if (validRating >= 0.7) barColor = '#10b981'; // Green for high innocuity
                else if (validRating >= 0.4) barColor = '#f59e0b'; // Orange for medium
                else barColor = '#ef4444'; // Red for low innocuity (harmful)
            }
            
            return `
                <div style="display: flex; align-items: center; gap: 8px; width: 120px;">
                    <div style="flex: 1; height: 12px; background: #374151; border-radius: 6px; overflow: hidden;">
                        <div style="height: 100%; background: ${barColor}; width: ${percentage}%; transition: width 0.3s ease; border-radius: 6px;"></div>
                    </div>
                    <span style="font-size: 0.75rem; color: #9ca3af; min-width: 35px;">${percentage}%</span>
                </div>
            `;
        } catch (error) {
            this.logError('Failed to create rating bar', error);
            return '<span style="color: #dc2626;">Error</span>';
        }
    }

    escapeHtml(text) {
        try {
            if (typeof text !== 'string') {
                return String(text || '');
            }
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        } catch (error) {
            this.logError('Failed to escape HTML', error);
            return String(text || '');
        }
    }

    // Error handling methods (same as human explorer)
    logError(message, error = null) {
        const errorInfo = {
            message,
            error: error?.message || error,
            timestamp: new Date().toISOString(),
            stack: error?.stack
        };
        
        this.errors.push(errorInfo);
        console.error(`[LLMAnnotationExplorer] ${message}`, error);
        
        // Keep only last 50 errors
        if (this.errors.length > 50) {
            this.errors = this.errors.slice(-50);
        }
    }

    handleError(message, error = null) {
        this.logError(message, error);
        this.showUserError(`Something went wrong: ${message}`);
    }

    handleCriticalError(message, error = null) {
        this.logError(`CRITICAL: ${message}`, error);
        console.error('Critical error in LLMAnnotationExplorer:', error);
        this.showCriticalError(message);
    }

    showUserError(message) {
        let errorDiv = document.getElementById('user-error-display');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'user-error-display';
            errorDiv.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: #fee2e2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #dc2626;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1001;
                max-width: 300px;
            `;
            document.body.appendChild(errorDiv);
        }
        
        errorDiv.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Error</div>
            <div>${this.escapeHtml(message)}</div>
            <button onclick="this.parentElement.remove()" style="margin-top: 0.5rem; background: #dc2626; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;">Dismiss</button>
        `;
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 10000);
    }

    showCriticalError(message) {
        const errorHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 500px; text-align: center;">
                    <h2 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h2>
                    <p style="margin-bottom: 1rem;">${this.escapeHtml(message)}</p>
                    <p style="font-size: 0.9rem; color: #6b7280; margin-bottom: 1rem;">Please refresh the page to try again.</p>
                    <button onclick="window.location.reload()" style="background: #4f46e5; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    getErrorLogs() {
        return this.errors;
    }

    healthCheck() {
        const issues = [];
        
        if (!this.isInitialized) issues.push('Not initialized');
        if (!this.currentAnnotation) issues.push('No current annotation');
        if (!document.getElementById('tooltip')) issues.push('Tooltip element missing');
        if (typeof llmAnnotationsData === 'undefined') issues.push('Data not loaded');
        
        return {
            healthy: issues.length === 0,
            issues,
            errorCount: this.errors.length
        };
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if required dependencies are loaded
        if (typeof llmAnnotationsData === 'undefined') {
            console.error('llmAnnotationsData not found. Make sure llm-data.js is loaded before llm-explore.js');
            return;
        }
        
        // Initialize with global error handling
        window.llmAnnotationExplorer = new LLMAnnotationExplorer();
        
        // Global error handler for unhandled errors
        window.addEventListener('error', (event) => {
            if (window.llmAnnotationExplorer) {
                window.llmAnnotationExplorer.logError('Unhandled error', event.error);
            }
        });
        
    } catch (error) {
        console.error('Failed to initialize LLMAnnotationExplorer:', error);
        document.body.insertAdjacentHTML('beforeend', `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fee2e2; color: #dc2626; padding: 2rem; border-radius: 8px; text-align: center; z-index: 9999;">
                <h2>Application Failed to Start</h2>
                <p>Please refresh the page and try again.</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Refresh</button>
            </div>
        `);
    }
});