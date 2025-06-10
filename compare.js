// Compare Annotations JavaScript
class CompareAnnotations {
    constructor() {
        this.currentDataset = null;
        this.currentLLMModel = null;
        this.activeSpan = null;
        this.tooltip = null;
        this.errors = [];
        this.isInitialized = false;
        
        try {
            this.init();
        } catch (error) {
            this.handleCriticalError('Failed to initialize CompareAnnotations', error);
        }
    }

    init() {
        try {
            // Validate required DOM elements and data
            this.validateRequiredElements();
            this.validateData();
            
            // Initialize components
            this.tooltip = document.getElementById('tooltip');
            this.populateDatasetSelector();
            this.bindEvents();
            this.loadComparison(0);
            
            this.isInitialized = true;
            console.log('CompareAnnotations initialized successfully');
        } catch (error) {
            this.handleCriticalError('Initialization failed', error);
        }
    }

    validateRequiredElements() {
        const requiredElements = [
            'compare-select',
            'llm-model-select',
            'source-content', 
            'human-content',
            'llm-content',
            'tooltip'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
    }

    validateData() {
        if (typeof annotationsData === 'undefined') {
            throw new Error('annotationsData is not defined. Make sure data.js is loaded.');
        }
        
        if (typeof llmAnnotationsData === 'undefined') {
            throw new Error('llmAnnotationsData is not defined. Make sure llm-data.js is loaded.');
        }
        
        if (!Array.isArray(annotationsData) || annotationsData.length === 0) {
            throw new Error('annotationsData must be a non-empty array');
        }
        
        if (!Array.isArray(llmAnnotationsData) || llmAnnotationsData.length === 0) {
            throw new Error('llmAnnotationsData must be a non-empty array');
        }
        
        if (annotationsData.length !== llmAnnotationsData.length) {
            this.logError(`Dataset length mismatch: human=${annotationsData.length}, llm=${llmAnnotationsData.length}`);
        }

        // Validate new LLM structure
        llmAnnotationsData.forEach((dataset, index) => {
            if (!dataset.models || typeof dataset.models !== 'object') {
                throw new Error(`Dataset ${index} missing or invalid models structure`);
            }
            
            if (Object.keys(dataset.models).length === 0) {
                this.logError(`Dataset ${index} has no LLM models`);
            }
        });
    }

    populateDatasetSelector() {
        try {
            const selector = document.getElementById('compare-select');
            if (!selector) throw new Error('Dataset selector not found');
            
            selector.innerHTML = '';
            
            const datasetCount = Math.min(annotationsData.length, llmAnnotationsData.length);
            
            for (let i = 0; i < datasetCount; i++) {
                try {
                    const humanTitle = annotationsData[i]?.title || `Dataset ${i + 1}`;
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = humanTitle;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for dataset ${i}`, error);
                }
            }
        } catch (error) {
            this.handleError('Failed to populate dataset selector', error);
        }
    }

    populateLLMModelSelector(datasetIndex) {
        try {
            const selector = document.getElementById('llm-model-select');
            if (!selector) throw new Error('LLM model selector not found');
            
            selector.innerHTML = '';
            
            const llmDataset = llmAnnotationsData[datasetIndex];
            if (!llmDataset || !llmDataset.models) {
                throw new Error(`No LLM models found for dataset ${datasetIndex}`);
            }
            
            const models = Object.keys(llmDataset.models);
            
            if (models.length === 0) {
                selector.innerHTML = '<option value="">No models available</option>';
                selector.disabled = true;
                return;
            }
            
            selector.disabled = false;
            
            models.forEach((modelName, index) => {
                try {
                    const option = document.createElement('option');
                    option.value = modelName;
                    option.textContent = modelName;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for model ${modelName}`, error);
                }
            });
            
            // Set the first model as default
            this.currentLLMModel = models[0];
            selector.value = models[0];
            
        } catch (error) {
            this.handleError('Failed to populate LLM model selector', error);
        }
    }

    bindEvents() {
        try {
            const datasetSelector = document.getElementById('compare-select');
            const modelSelector = document.getElementById('llm-model-select');
            
            if (datasetSelector) {
                datasetSelector.addEventListener('change', (e) => {
                    try {
                        const index = parseInt(e.target.value);
                        if (isNaN(index)) {
                            throw new Error(`Invalid dataset index: ${e.target.value}`);
                        }
                        this.loadComparison(index);
                    } catch (error) {
                        this.handleError('Failed to handle dataset selection', error);
                    }
                });
            }

            if (modelSelector) {
                modelSelector.addEventListener('change', (e) => {
                    try {
                        const modelName = e.target.value;
                        if (!modelName) {
                            throw new Error('No model selected');
                        }
                        this.currentLLMModel = modelName;
                        this.loadLLMAnnotations();
                    } catch (error) {
                        this.handleError('Failed to handle model selection', error);
                    }
                });
            }

            // Hide tooltip when clicking outside spans
            document.addEventListener('click', (e) => {
                try {
                    if (!e.target.closest('.annotation-span')) {
                        this.hideTooltip();
                        this.clearActiveSpan();
                    }
                } catch (error) {
                    this.logError('Error in document click handler', error);
                }
            });
        } catch (error) {
            this.handleError('Failed to bind events', error);
        }
    }

    loadComparison(index) {
        try {
            if (index < 0 || index >= Math.min(annotationsData.length, llmAnnotationsData.length)) {
                throw new Error(`Invalid dataset index: ${index}`);
            }
            
            const humanData = annotationsData[index];
            const llmDataset = llmAnnotationsData[index];
            
            if (!humanData || !llmDataset) {
                throw new Error(`Dataset ${index} not found in one or both annotation sets`);
            }
            
            this.currentDataset = { human: humanData, llmDataset: llmDataset, index };
            
            // Populate LLM model selector for this dataset
            this.populateLLMModelSelector(index);
            
            // Render components with error handling
            this.safeRender(() => this.renderSource(humanData.source), 'source');
            this.safeRender(() => this.renderHumanAnnotations(humanData), 'human annotations');
            this.safeRender(() => this.loadLLMAnnotations(), 'LLM annotations');
            
            this.hideTooltip();
            this.clearActiveSpan();
            
        } catch (error) {
            this.handleError(`Failed to load comparison ${index}`, error);
        }
    }

    loadLLMAnnotations() {
        try {
            if (!this.currentDataset || !this.currentLLMModel) {
                throw new Error('No dataset or LLM model selected');
            }
            
            const llmModelData = this.currentDataset.llmDataset.models[this.currentLLMModel];
            if (!llmModelData) {
                throw new Error(`Model ${this.currentLLMModel} not found in dataset`);
            }
            
            // Create a mock LLM data object that matches the expected structure
            const llmData = {
                summary: this.currentDataset.llmDataset.summary,
                spans: llmModelData.spans,
                model: this.currentLLMModel
            };
            
            this.safeRender(() => this.renderLLMAnnotations(llmData), 'LLM annotations');
            this.safeRender(() => this.renderComparisonStats(), 'comparison stats');
            
        } catch (error) {
            this.handleError('Failed to load LLM annotations', error);
        }
    }
                    const humanTitle = annotationsData[i]?.title || `Dataset ${i + 1}`;
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = humanTitle;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for dataset ${i}`, error);
                }
            }
        } catch (error) {
            this.handleError('Failed to populate dataset selector', error);
        }
    }

    bindEvents() {
        try {
            const selector = document.getElementById('compare-select');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    try {
                        const index = parseInt(e.target.value);
                        if (isNaN(index)) {
                            throw new Error(`Invalid dataset index: ${e.target.value}`);
                        }
                        this.loadComparison(index);
                    } catch (error) {
                        this.handleError('Failed to handle dataset selection', error);
                    }
                });
            }

            // Hide tooltip when clicking outside spans
            document.addEventListener('click', (e) => {
                try {
                    if (!e.target.closest('.annotation-span')) {
                        this.hideTooltip();
                        this.clearActiveSpan();
                    }
                } catch (error) {
                    this.logError('Error in document click handler', error);
                }
            });
        } catch (error) {
            this.handleError('Failed to bind events', error);
        }
    }

    loadComparison(index) {
        try {
            if (index < 0 || index >= Math.min(annotationsData.length, llmAnnotationsData.length)) {
                throw new Error(`Invalid dataset index: ${index}`);
            }
            
            const humanData = annotationsData[index];
            const llmData = llmAnnotationsData[index];
            
            if (!humanData || !llmData) {
                throw new Error(`Dataset ${index} not found in one or both annotation sets`);
            }
            
            this.currentDataset = { human: humanData, llm: llmData, index };
            
            // Render all components with error handling
            this.safeRender(() => this.renderSource(humanData.source), 'source');
            this.safeRender(() => this.renderHumanAnnotations(humanData), 'human annotations');
            this.safeRender(() => this.renderLLMAnnotations(llmData), 'LLM annotations');
            this.safeRender(() => this.renderComparisonStats(), 'comparison stats');
            
            this.hideTooltip();
            this.clearActiveSpan();
            
        } catch (error) {
            this.handleError(`Failed to load comparison ${index}`, error);
        }
    }

    safeRender(renderFunction, componentName) {
        try {
            renderFunction();
        } catch (error) {
            this.handleError(`Failed to render ${componentName}`, error);
            this.showFallbackContent(componentName);
        }
    }

    showFallbackContent(componentName) {
        const elementMap = {
            'source': 'source-content',
            'human annotations': 'human-content',
            'LLM annotations': 'llm-content',
            'comparison stats': 'comparison-stats'
        };
        
        const elementId = elementMap[componentName];
        if (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = `
                    <div class="error-state">
                        <h4>Error Loading ${componentName}</h4>
                        <p>Please try refreshing the page or selecting a different dataset.</p>
                    </div>
                `;
            }
        }
    }

    renderSource(sourceText) {
        const sourceContent = document.getElementById('source-content');
        if (!sourceContent) throw new Error('Source content element not found');
        
        if (!sourceText) {
            sourceContent.innerHTML = '<div class="error-state"><p>No source content available</p></div>';
            return;
        }
        
        sourceContent.innerHTML = `<p>${this.escapeHtml(sourceText)}</p>`;
    }

    renderHumanAnnotations(humanData) {
        const humanContent = document.getElementById('human-content');
        if (!humanContent) throw new Error('Human content element not found');
        
        const annotatedHTML = this.createAnnotatedHTML(humanData, 'human');
        humanContent.innerHTML = `<p>${annotatedHTML}</p>`;
        
        this.bindSpanEvents('.human-span');
    }

    renderLLMAnnotations(llmData) {
        const llmContent = document.getElementById('llm-content');
        if (!llmContent) throw new Error('LLM content element not found');
        
        const annotatedHTML = this.createAnnotatedHTML(llmData, 'llm');
        llmContent.innerHTML = `<p>${annotatedHTML}</p>`;
        
        this.bindSpanEvents('.llm-span');
    }

    createAnnotatedHTML(data, annotationType) {
        try {
            const summaryText = data.summary;
            if (!summaryText) return '<div class="error-state"><p>No summary content available</p></div>';
            
            if (!data.spans || data.spans.length === 0) {
                return this.escapeHtml(summaryText);
            }
            
            const segments = [];
            let lastIndex = 0;
            
            // Sort and validate spans
            const sortedSpans = [...data.spans]
                .filter(span => {
                    const isValid = span.startIndex >= 0 && 
                                   span.endIndex <= summaryText.length && 
                                   span.startIndex < span.endIndex;
                    if (!isValid) {
                        this.logError(`Invalid span in ${annotationType} annotations: ${JSON.stringify(span)}`);
                    }
                    return isValid;
                })
                .sort((a, b) => a.startIndex - b.startIndex);
            
            // Build segments array
            sortedSpans.forEach((span, index) => {
                try {
                    // Check for overlap
                    if (span.startIndex < lastIndex) {
                        this.logError(`Overlapping spans detected in ${annotationType} annotations at index ${index}`);
                        return;
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
                    if (spanText.trim()) {
                        segments.push({
                            type: 'span',
                            content: spanText,
                            spanId: span.id,
                            annotationType
                        });
                    }
                    
                    lastIndex = span.endIndex;
                } catch (error) {
                    this.logError(`Error processing span ${index} in ${annotationType} annotations`, error);
                }
            });
            
            // Add remaining text
            if (lastIndex < summaryText.length) {
                segments.push({
                    type: 'text',
                    content: summaryText.substring(lastIndex)
                });
            }
            
            // Build HTML
            return segments.map(segment => {
                if (segment.type === 'text') {
                    return this.escapeHtml(segment.content);
                } else {
                    const spanClass = segment.annotationType === 'human' ? 'human-span' : 'llm-span';
                    return `<span class="annotation-span ${spanClass}" 
                                  data-span-id="${segment.spanId}" 
                                  data-annotation-type="${segment.annotationType}"
                                  role="button"
                                  tabindex="0"
                                  aria-label="Annotated text: ${this.escapeHtml(segment.content)}">
                                ${this.escapeHtml(segment.content)}
                            </span>`;
                }
            }).join('');
            
        } catch (error) {
            this.logError(`Error creating annotated HTML for ${annotationType}`, error);
            return this.escapeHtml(data.summary || '');
        }
    }

    bindSpanEvents(selector) {
        try {
            const spans = document.querySelectorAll(selector);
            spans.forEach((span, index) => {
                try {
                    // Click handler
                    span.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const spanId = parseInt(span.getAttribute('data-span-id'));
                        const annotationType = span.getAttribute('data-annotation-type');
                        
                        if (isNaN(spanId)) {
                            this.logError(`Invalid span ID: ${span.getAttribute('data-span-id')}`);
                            return;
                        }
                        
                        this.showSpanDetails(spanId, annotationType, span);
                    });

                    // Keyboard handler
                    span.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            span.click();
                        }
                    });

                    // Hover effects
                    span.addEventListener('mouseenter', () => {
                        if (!span.classList.contains('active')) {
                            span.style.transform = 'translateY(-1px)';
                            span.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                        }
                    });

                    span.addEventListener('mouseleave', () => {
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

    showSpanDetails(spanId, annotationType, spanElement) {
        try {
            const data = annotationType === 'human' 
                ? this.currentDataset.human 
                : this.currentDataset.llm;
            
            const span = data.spans.find(s => s.id === spanId);
            if (!span) {
                throw new Error(`Span ${spanId} not found in ${annotationType} annotations`);
            }

            this.clearActiveSpan();
            this.activeSpan = spanElement;
            spanElement.classList.add('active');

            this.showTooltip(span, spanElement, annotationType);
        } catch (error) {
            this.handleError('Failed to show span details', error);
        }
    }

    showTooltip(span, element, annotationType) {
        try {
            const rect = element.getBoundingClientRect();
            
            const verifiability = this.validateRating(span.verifiability) ? span.verifiability : 0;
            const plausibility = this.validateRating(span.plausibility) ? span.plausibility : 0;
            const innocuity = this.validateRating(span.innocuity) ? span.innocuity : 0;
            
            const annotationLabel = annotationType === 'human' ? 'Human Expert' : 'LLM Model';
            const modelInfo = annotationType === 'llm' && this.currentDataset.llm.model 
                ? this.currentDataset.llm.model 
                : '';
            
            this.tooltip.innerHTML = `
                <div class="tooltip-header">${annotationLabel} Annotation</div>
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
                            V: ${verifiability.toFixed(2)} | P: ${plausibility.toFixed(2)} | I: ${innocuity.toFixed(2)}
                        </div>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.8rem; color: #9ca3af;">
                        "${this.escapeHtml(span.text || 'No text available')}"
                    </div>
                    ${modelInfo ? `<div style="margin-top: 8px; font-size: 0.75rem; color: #dc2626; font-weight: 500;">Model: ${this.escapeHtml(modelInfo)}</div>` : ''}
                </div>
            `;

            this.positionTooltip(rect);
        } catch (error) {
            this.handleError('Failed to show tooltip', error);
        }
    }

    positionTooltip(elementRect) {
        try {
            const tooltip = this.tooltip;
            if (!tooltip) return;
            
            tooltip.style.visibility = 'hidden';
            tooltip.classList.add('show');
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.style.visibility = 'visible';

            let left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
            let top = elementRect.top - tooltipRect.height - 10;

            // Boundary checks
            if (left < 10) left = 10;
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
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

    renderComparisonStats() {
        try {
            const statsElement = document.getElementById('comparison-stats');
            if (!statsElement) return;
            
            const humanSpans = this.currentDataset.human.spans || [];
            const llmSpans = this.currentDataset.llm.spans || [];
            
            const humanAvg = this.calculateAverages(humanSpans);
            const llmAvg = this.calculateAverages(llmSpans);
            
            statsElement.innerHTML = `
                <div style="font-size: 12px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                    Comparison Statistics
                </div>
                <div class="stats-row">
                    <span class="stats-label">Spans:</span>
                    <span class="stats-values">H:${humanSpans.length} | L:${llmSpans.length}</span>
                </div>
                <div class="stats-row">
                    <span class="stats-label">Avg Verifiability:</span>
                    <span class="stats-values">H:${humanAvg.verifiability.toFixed(2)} | L:${llmAvg.verifiability.toFixed(2)}</span>
                </div>
                <div class="stats-row">
                    <span class="stats-label">Avg Plausibility:</span>
                    <span class="stats-values">H:${humanAvg.plausibility.toFixed(2)} | L:${llmAvg.plausibility.toFixed(2)}</span>
                </div>
                <div class="stats-row">
                    <span class="stats-label">Avg Innocuity:</span>
                    <span class="stats-values">H:${humanAvg.innocuity.toFixed(2)} | L:${llmAvg.innocuity.toFixed(2)}</span>
                </div>
            `;
        } catch (error) {
            this.logError('Failed to render comparison stats', error);
        }
    }

    calculateAverages(spans) {
        if (!spans.length) return { verifiability: 0, plausibility: 0, innocuity: 0 };
        
        try {
            const totals = spans.reduce((acc, span) => ({
                verifiability: acc.verifiability + (span.verifiability || 0),
                plausibility: acc.plausibility + (span.plausibility || 0),
                innocuity: acc.innocuity + (span.innocuity || 0)
            }), { verifiability: 0, plausibility: 0, innocuity: 0 });
            
            return {
                verifiability: totals.verifiability / spans.length,
                plausibility: totals.plausibility / spans.length,
                innocuity: totals.innocuity / spans.length
            };
        } catch (error) {
            this.logError('Failed to calculate averages', error);
            return { verifiability: 0, plausibility: 0, innocuity: 0 };
        }
    }

    createRatingBar(rating, label) {
        try {
            const validRating = this.validateRating(rating) ? rating : 0;
            const percentage = Math.round(validRating * 100);
            
            // Color coding based on rating value
            let barColor = '#ef4444'; // Default red
            if (validRating >= 0.7) barColor = '#10b981'; // Green for high values
            else if (validRating >= 0.4) barColor = '#f59e0b'; // Orange for medium values
            
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

    validateRating(rating) {
        return typeof rating === 'number' && rating >= 0 && rating <= 1 && !isNaN(rating);
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
                this.activeSpan.style.transform = 'translateY(0)';
                this.activeSpan.style.boxShadow = 'none';
                this.activeSpan = null;
            }
        } catch (error) {
            this.logError('Failed to clear active span', error);
        }
    }

    escapeHtml(text) {
        try {
            if (typeof text !== 'string') return String(text || '');
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        } catch (error) {
            this.logError('Failed to escape HTML', error);
            return String(text || '');
        }
    }

    // Error handling methods
    logError(message, error = null) {
        const errorInfo = {
            message,
            error: error?.message || error,
            timestamp: new Date().toISOString(),
            stack: error?.stack,
            context: {
                currentDataset: this.currentDataset?.index,
                isInitialized: this.isInitialized
            }
        };
        
        this.errors.push(errorInfo);
        console.error(`[CompareAnnotations] ${message}`, error);
        
        // Keep only last 50 errors to prevent memory issues
        if (this.errors.length > 50) {
            this.errors = this.errors.slice(-50);
        }
    }

    handleError(message, error = null) {
        this.logError(message, error);
        this.showError(`Something went wrong: ${message}`);
    }

    handleCriticalError(message, error = null) {
        this.logError(`CRITICAL: ${message}`, error);
        console.error('Critical error in CompareAnnotations:', error);
        this.showError(message, true);
    }

    showError(message, isCritical = false) {
        try {
            const errorOverlay = document.getElementById('error-overlay');
            const errorMessage = document.getElementById('error-message');
            
            if (errorOverlay && errorMessage) {
                errorMessage.textContent = message;
                errorOverlay.classList.remove('hidden');
                
                // Auto-hide non-critical errors after 5 seconds
                if (!isCritical) {
                    setTimeout(() => {
                        errorOverlay.classList.add('hidden');
                    }, 5000);
                }
            } else {
                // Fallback if error overlay elements don't exist
                console.error('Error overlay elements not found, falling back to alert');
                alert(`Error: ${message}`);
            }
        } catch (error) {
            console.error('Failed to show error message:', error);
            alert(`Error: ${message}`);
        }
    }

    // Public methods for debugging and health checks
    getErrorLogs() {
        return this.errors;
    }

    healthCheck() {
        const issues = [];
        
        if (!this.isInitialized) issues.push('Not initialized');
        if (!this.currentDataset) issues.push('No current dataset');
        if (!this.tooltip) issues.push('Tooltip element missing');
        if (typeof annotationsData === 'undefined') issues.push('Human annotations data not loaded');
        if (typeof llmAnnotationsData === 'undefined') issues.push('LLM annotations data not loaded');
        
        return {
            healthy: issues.length === 0,
            issues,
            errorCount: this.errors.length,
            currentDatasetIndex: this.currentDataset?.index
        };
    }

    // Method to force reload current comparison (useful for error recovery)
    reloadCurrentComparison() {
        if (this.currentDataset) {
            this.loadComparison(this.currentDataset.index);
        }
    }
}

// Global error hiding function
function hideError() {
    try {
        const errorOverlay = document.getElementById('error-overlay');
        if (errorOverlay) {
            errorOverlay.classList.add('hidden');
        }
    } catch (error) {
        console.error('Failed to hide error overlay:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if required dependencies are loaded
        if (typeof annotationsData === 'undefined') {
            throw new Error('annotationsData not found. Make sure data.js is loaded before compare.js');
        }
        
        if (typeof llmAnnotationsData === 'undefined') {
            throw new Error('llmAnnotationsData not found. Make sure llm-data.js is loaded before compare.js');
        }
        
        // Initialize the compare functionality
        window.compareAnnotations = new CompareAnnotations();
        
        // Global error handler for unhandled errors
        window.addEventListener('error', (event) => {
            if (window.compareAnnotations) {
                window.compareAnnotations.logError('Unhandled global error', event.error);
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (window.compareAnnotations) {
                window.compareAnnotations.logError('Unhandled promise rejection', event.reason);
            }
        });
        
        console.log('Compare page initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize compare page:', error);
        
        // Show critical error overlay
        document.body.insertAdjacentHTML('beforeend', `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <h2 style="color: #dc2626; margin-bottom: 1rem;">Application Failed to Start</h2>
                    <p style="margin-bottom: 1rem; color: #6b7280;">The compare page could not initialize properly. This usually means the required data files are not loaded.</p>
                    <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #9ca3af;">Make sure data.js and llm-data.js are loaded before compare.js</p>
                    <button onclick="window.location.reload()" style="background: #dc2626; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 500;">Refresh Page</button>
                </div>
            </div>
        `);
    }
});