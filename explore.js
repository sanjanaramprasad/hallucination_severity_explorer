// Complete explore.js for hallucination severity metrics with attribute toggles and search/filtering
class AnnotationExplorer {
    constructor() {
        this.currentAnnotation = null;
        this.activeSpan = null;
        this.tooltip = null;
        this.isInitialized = false;
        this.currentAttribute = 'mean'; // 'mean', 'irrefutability', 'plausibility', 'innocuity'
        
        // Search and filtering
        this.allAnnotations = [];
        this.filteredAnnotations = [];
        this.currentSearch = '';
        this.currentPrefixFilter = '';
        
        // Error tracking
        this.errors = [];
        
        try {
            this.init();
        } catch (error) {
            this.handleCriticalError('Failed to initialize AnnotationExplorer', error);
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
            this.allAnnotations = [...annotationsData];
            this.filteredAnnotations = [...annotationsData];
            
            this.populatePrefixFilter();
            this.populateAnnotationSelector();
            this.createAttributeToggles();
            this.bindEvents();
            this.loadAnnotation(0); // Load first annotation by default
            
            this.isInitialized = true;
            console.log('AnnotationExplorer initialized successfully');
            
        } catch (error) {
            this.handleCriticalError('Initialization failed', error);
        }
    }

    validateRequiredElements() {
        const requiredElements = [
            'annotation-search',
            'clear-search', 
            'prefix-filter',
            'annotation-select',
            'source-content', 
            'summary-content',
            'tooltip'
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
        if (typeof annotationsData === 'undefined') {
            throw new Error('annotationsData is not defined. Make sure data.js is loaded.');
        }
        
        if (!Array.isArray(annotationsData) || annotationsData.length === 0) {
            throw new Error('annotationsData must be a non-empty array');
        }
        
        // Validate each annotation structure
        annotationsData.forEach((annotation, index) => {
            this.validateAnnotation(annotation, index);
        });
    }

    validateAnnotation(annotation, index) {
        const requiredFields = ['id', 'title', 'source', 'summary', 'spans'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!(field in annotation)) {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            throw new Error(`Annotation ${index} missing required fields: ${missingFields.join(', ')}`);
        }
        
        if (!Array.isArray(annotation.spans)) {
            throw new Error(`Annotation ${index} spans must be an array`);
        }
        
        // Validate spans
        annotation.spans.forEach((span, spanIndex) => {
            this.validateSpan(span, index, spanIndex);
        });
    }

    validateSpan(span, annotationIndex, spanIndex) {
        const requiredFields = ['id', 'text', 'startIndex', 'endIndex', 'irrefutability', 'plausibility', 'innocuity'];
        const missingFields = [];
        
        requiredFields.forEach(field => {
            if (!(field in span)) {
                missingFields.push(field);
            }
        });
        
        if (missingFields.length > 0) {
            this.logError(`Annotation ${annotationIndex}, Span ${spanIndex} missing fields: ${missingFields.join(', ')}`);
        }
        
        // Validate continuous rating values (0.0 - 1.0)
        ['irrefutability', 'plausibility', 'innocuity'].forEach(rating => {
            if (span[rating] !== undefined) {
                if (typeof span[rating] !== 'number' || span[rating] < 0 || span[rating] > 1) {
                    this.logError(`Annotation ${annotationIndex}, Span ${spanIndex}: ${rating} must be between 0.0 and 1.0, got ${span[rating]}`);
                }
            }
        });
        
        // Validate indices
        if (span.startIndex >= span.endIndex) {
            this.logError(`Annotation ${annotationIndex}, Span ${spanIndex}: startIndex must be less than endIndex`);
        }
    }

    // Extract prefix from annotation title (e.g., "XSUM-45678:gpt4-ul2" -> "XSUM")
    extractPrefix(title) {
        try {
            const match = title.match(/^([A-Z]+)/);
            return match ? match[1] : 'OTHER';
        } catch (error) {
            this.logError('Failed to extract prefix', error);
            return 'OTHER';
        }
    }

    // Populate prefix filter dropdown
    populatePrefixFilter() {
        try {
            const prefixFilter = document.getElementById('prefix-filter');
            if (!prefixFilter) {
                throw new Error('Prefix filter not found');
            }
            
            // Extract unique prefixes
            const prefixes = [...new Set(this.allAnnotations.map(a => this.extractPrefix(a.title)))];
            prefixes.sort();
            
            // Clear existing options except "All Datasets"
            const allOption = prefixFilter.querySelector('option[value=""]');
            prefixFilter.innerHTML = '';
            if (allOption) {
                prefixFilter.appendChild(allOption);
            } else {
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'All Datasets';
                prefixFilter.appendChild(defaultOption);
            }
            
            prefixes.forEach(prefix => {
                const option = document.createElement('option');
                option.value = prefix;
                option.textContent = `${prefix} Dataset`;
                prefixFilter.appendChild(option);
            });
            
        } catch (error) {
            this.handleError('Failed to populate prefix filter', error);
        }
    }

    // Filter annotations based on search and prefix
    filterAnnotations() {
        try {
            this.filteredAnnotations = this.allAnnotations.filter(annotation => {
                // Search filter
                if (this.currentSearch) {
                    const searchLower = this.currentSearch.toLowerCase();
                    if (!annotation.title.toLowerCase().includes(searchLower)) {
                        return false;
                    }
                }
                
                // Prefix filter
                if (this.currentPrefixFilter) {
                    const prefix = this.extractPrefix(annotation.title);
                    if (prefix !== this.currentPrefixFilter) {
                        return false;
                    }
                }
                
                return true;
            });
            
            this.populateAnnotationSelector();
            
            // If current annotation is not in filtered results, load first available
            if (this.currentAnnotation && !this.filteredAnnotations.includes(this.currentAnnotation)) {
                if (this.filteredAnnotations.length > 0) {
                    const firstIndex = this.allAnnotations.indexOf(this.filteredAnnotations[0]);
                    this.loadAnnotation(firstIndex);
                } else {
                    this.clearContent();
                }
            }
            
        } catch (error) {
            this.handleError('Failed to filter annotations', error);
        }
    }

    // Clear content when no results found
    clearContent() {
        try {
            const sourceContent = document.getElementById('source-content');
            const summaryContent = document.getElementById('summary-content');
            
            if (sourceContent) {
                sourceContent.innerHTML = '<div class="no-results">No annotations match your search criteria.</div>';
            }
            
            if (summaryContent) {
                summaryContent.innerHTML = '<div class="no-results">Please adjust your search or filter settings.</div>';
            }
            
            this.currentAnnotation = null;
            this.hideTooltip();
            this.clearActiveSpan();
            
        } catch (error) {
            this.logError('Failed to clear content', error);
        }
    }

    populateAnnotationSelector() {
        try {
            const selector = document.getElementById('annotation-select');
            const countDisplay = document.getElementById('annotation-count');
            
            if (!selector) {
                throw new Error('Annotation selector not found');
            }
            
            // Clear existing options
            selector.innerHTML = '';
            
            if (this.filteredAnnotations.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No annotations found';
                option.disabled = true;
                selector.appendChild(option);
                
                if (countDisplay) {
                    countDisplay.textContent = 'No results found';
                }
                return;
            }

            // Sort filtered annotations by prefix, then by full title
            const sortedAnnotations = [...this.filteredAnnotations].sort((a, b) => {
                const prefixA = this.extractPrefix(a.title);
                const prefixB = this.extractPrefix(b.title);
                
                if (prefixA !== prefixB) {
                    return prefixA.localeCompare(prefixB);
                }
                return a.title.localeCompare(b.title);
            });
            
            sortedAnnotations.forEach((annotation, index) => {
                try {
                    const option = document.createElement('option');
                    option.value = this.allAnnotations.indexOf(annotation);
                    option.textContent = annotation.title || `Annotation ${index + 1}`;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for annotation ${index}`, error);
                }
            });

            // Update count display
            if (countDisplay) {
                const total = this.allAnnotations.length;
                const filtered = this.filteredAnnotations.length;
                countDisplay.textContent = filtered === total ? 
                    `${total} annotations` : 
                    `${filtered} of ${total} annotations`;
            }
            
        } catch (error) {
            this.handleError('Failed to populate annotation selector', error);
        }
    }

    createAttributeToggles() {
        try {
            // Find the controls div
            const controlsDiv = document.querySelector('.controls');
            if (!controlsDiv) {
                throw new Error('Controls div not found');
            }

            // Create attribute toggles container
            const togglesContainer = document.createElement('div');
            togglesContainer.className = 'attribute-toggles';
            togglesContainer.innerHTML = `
                <h4 style="margin-bottom: 12px; font-size: 14px; color: var(--text-secondary);">Color by Attribute:</h4>
                <div class="toggle-buttons">
                    <button class="toggle-btn active" data-attribute="mean">Mean Score</button>
                    <button class="toggle-btn" data-attribute="irrefutability">Irrefutability</button>
                    <button class="toggle-btn" data-attribute="plausibility">Plausibility</button>
                    <button class="toggle-btn" data-attribute="innocuity">Innocuity</button>
                </div>
            `;

            // Insert after annotation controls but before legend
            const annotationControls = controlsDiv.querySelector('.annotation-controls');
            if (annotationControls) {
                annotationControls.insertAdjacentElement('afterend', togglesContainer);
            } else {
                controlsDiv.prepend(togglesContainer);
            }

            // Add styles for toggles
            this.addToggleStyles();

            // Bind toggle events
            this.bindToggleEvents();

        } catch (error) {
            this.handleError('Failed to create attribute toggles', error);
        }
    }

    addToggleStyles() {
        // Check if styles already exist
        if (document.getElementById('toggle-styles')) return;

        const style = document.createElement('style');
        style.id = 'toggle-styles';
        style.textContent = `
            .attribute-toggles {
                margin-bottom: 20px;
                padding: 16px;
                background: var(--surface-elevated);
                border-radius: var(--radius);
                border: 1px solid var(--border);
            }
            
            .toggle-buttons {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            
            .toggle-btn {
                padding: 8px 16px;
                border: 1px solid var(--border);
                background: var(--background);
                color: var(--text-primary);
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                user-select: none;
            }
            
            .toggle-btn:hover {
                background: var(--accent);
                border-color: var(--primary-color);
            }
            
            .toggle-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }
            
            @media (max-width: 768px) {
                .toggle-buttons {
                    flex-direction: column;
                }
                
                .toggle-btn {
                    text-align: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindToggleEvents() {
        try {
            const toggleButtons = document.querySelectorAll('.toggle-btn');
            toggleButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const attribute = e.target.getAttribute('data-attribute');
                    this.setActiveAttribute(attribute);
                });
            });
        } catch (error) {
            this.handleError('Failed to bind toggle events', error);
        }
    }

    setActiveAttribute(attribute) {
        try {
            this.currentAttribute = attribute;
            
            // Update toggle button states
            const toggleButtons = document.querySelectorAll('.toggle-btn');
            toggleButtons.forEach(button => {
                if (button.getAttribute('data-attribute') === attribute) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });

            // Re-render summary with new coloring
            if (this.currentAnnotation) {
                this.renderSummary();
            }

        } catch (error) {
            this.handleError('Failed to set active attribute', error);
        }
    }

    bindEvents() {
        try {
            // Search functionality
            const searchInput = document.getElementById('annotation-search');
            const clearButton = document.getElementById('clear-search');
            
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.currentSearch = e.target.value.trim();
                    this.filterAnnotations();
                });
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.clearSearch();
                    }
                });
            }
            
            if (clearButton) {
                clearButton.addEventListener('click', () => {
                    this.clearSearch();
                });
            }
            
            // Prefix filter
            const prefixFilter = document.getElementById('prefix-filter');
            if (prefixFilter) {
                prefixFilter.addEventListener('change', (e) => {
                    this.currentPrefixFilter = e.target.value;
                    this.filterAnnotations();
                });
            }

            const selector = document.getElementById('annotation-select');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    try {
                        const index = parseInt(e.target.value);
                        if (isNaN(index) || index < 0 || index >= this.allAnnotations.length) {
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

    // Clear search functionality
    clearSearch() {
        try {
            const searchInput = document.getElementById('annotation-search');
            if (searchInput) {
                searchInput.value = '';
                this.currentSearch = '';
                this.filterAnnotations();
                searchInput.focus();
            }
        } catch (error) {
            this.handleError('Failed to clear search', error);
        }
    }

    loadAnnotation(index) {
        try {
            if (index < 0 || index >= this.allAnnotations.length) {
                throw new Error(`Invalid annotation index: ${index}`);
            }
            
            this.currentAnnotation = this.allAnnotations[index];
            
            // Update selector to show current annotation
            const selector = document.getElementById('annotation-select');
            if (selector) {
                selector.value = index;
            }
            
            // Render components with error handling
            this.safeRender(() => this.renderSource(), 'source');
            this.safeRender(() => this.renderSummary(), 'summary');
            
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
        const elementId = `${componentName}-content`;
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

    getAttributeScore(span) {
        try {
            if (this.currentAttribute === 'mean') {
                // Calculate mean of all three attributes
                const v = this.validateRating(span.irrefutability) ? span.irrefutability : 0;
                const p = this.validateRating(span.plausibility) ? span.plausibility : 0;
                const i = this.validateRating(span.innocuity) ? span.innocuity : 0;
                return (v + p + i) / 3;
            } else {
                // Return specific attribute score
                const score = span[this.currentAttribute];
                return this.validateRating(score) ? score : 0;
            }
        } catch (error) {
            this.logError('Error calculating attribute score', error);
            return 0;
        }
    }

    getSpanColorFromScore(score) {
        try {
            // Convert score (0-1) to color
            // Lower scores = more red (more problematic)
            // Higher scores = more green (less problematic)
            
            if (score >= 0.7) {
                // Green range for high scores (good)
                return {
                    background: 'linear-gradient(120deg, #d1fae5 0%, #10b981 100%)',
                    color: '#047857',
                    border: '#10b981'
                };
            } else if (score >= 0.4) {
                // Orange/yellow range for medium scores
                return {
                    background: 'linear-gradient(120deg, #fef3c7 0%, #f59e0b 100%)',
                    color: '#d97706',
                    border: '#f59e0b'
                };
            } else {
                // Red range for low scores (problematic)
                return {
                    background: 'linear-gradient(120deg, #fee2e2 0%, #ef4444 100%)',
                    color: '#dc2626',
                    border: '#ef4444'
                };
            }
        } catch (error) {
            this.logError('Error getting span color', error);
            // Fallback to neutral gray
            return {
                background: 'linear-gradient(120deg, #f3f4f6 0%, #9ca3af 100%)',
                color: '#6b7280',
                border: '#9ca3af'
            };
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
                            spanId: span.id,
                            span: span
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
            
            // Build the final HTML with attribute-based coloring
            let html = '';
            segments.forEach(segment => {
                if (segment.type === 'text') {
                    html += this.escapeHtml(segment.content);
                } else if (segment.type === 'span') {
                    // Get score for current attribute and determine color
                    const score = this.getAttributeScore(segment.span);
                    const colors = this.getSpanColorFromScore(score);
                    
                    html += `<span class="annotation-span" data-span-id="${segment.spanId}" style="background: ${colors.background}; color: ${colors.color}; font-weight: 500; padding: 2px 4px; border-radius: 4px; border-left: 3px solid ${colors.border}; cursor: pointer; transition: all 0.2s ease;">${this.escapeHtml(segment.content)}</span>`;
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
                            span.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
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

            // Set new active span
            this.activeSpan = spanElement;
            spanElement.classList.add('active');
            
            // Darken the current span when selected
            spanElement.style.filter = 'brightness(0.8)';
            spanElement.style.transform = 'translateY(-1px)';
            spanElement.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';

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
            const irrefutability = this.validateRating(span.irrefutability) ? span.irrefutability : 0;
            const plausibility = this.validateRating(span.plausibility) ? span.plausibility : 0;
            const innocuity = this.validateRating(span.innocuity) ? span.innocuity : 0;
            const meanScore = (irrefutability + plausibility + innocuity) / 3;
            
            // Highlight current attribute
            const currentAttributeLabel = this.currentAttribute === 'mean' ? 'Mean Score' : 
                this.currentAttribute.charAt(0).toUpperCase() + this.currentAttribute.slice(1);
            
            this.tooltip.innerHTML = `
                <div class="tooltip-header">Hallucination Severity Analysis</div>
                <div class="tooltip-content">
                    <div style="margin-bottom: 12px; padding: 8px; background: rgba(59, 130, 246, 0.1); border-radius: 4px;">
                        <div style="font-size: 0.85rem; color: #3b82f6; font-weight: 600;">Currently viewing: ${currentAttributeLabel}</div>
                    </div>
                    
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; ${this.currentAttribute === 'mean' ? 'background: rgba(59, 130, 246, 0.1); padding: 4px; border-radius: 4px;' : ''}">
                        <span class="tooltip-label" style="min-width: 80px; ${this.currentAttribute === 'mean' ? 'font-weight: 600; color: #3b82f6;' : ''}">Mean Score:</span>
                        ${this.createRatingBar(meanScore, 'Mean')}
                    </div>
                    
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; ${this.currentAttribute === 'irrefutability' ? 'background: rgba(59, 130, 246, 0.1); padding: 4px; border-radius: 4px;' : ''}">
                        <span class="tooltip-label" style="min-width: 80px; ${this.currentAttribute === 'irrefutability' ? 'font-weight: 600; color: #3b82f6;' : ''}">Irrefutability:</span>
                        ${this.createRatingBar(irrefutability, 'Irrefutability')}
                    </div>
                    
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; ${this.currentAttribute === 'plausibility' ? 'background: rgba(59, 130, 246, 0.1); padding: 4px; border-radius: 4px;' : ''}">
                        <span class="tooltip-label" style="min-width: 80px; ${this.currentAttribute === 'plausibility' ? 'font-weight: 600; color: #3b82f6;' : ''}">Plausibility:</span>
                        ${this.createRatingBar(plausibility, 'Plausibility')}
                    </div>
                    
                    <div class="tooltip-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; ${this.currentAttribute === 'innocuity' ? 'background: rgba(59, 130, 246, 0.1); padding: 4px; border-radius: 4px;' : ''}">
                        <span class="tooltip-label" style="min-width: 80px; ${this.currentAttribute === 'innocuity' ? 'font-weight: 600; color: #3b82f6;' : ''}">Innocuity:</span>
                        ${this.createRatingBar(innocuity, 'Innocuity')}
                    </div>
                    
                    <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #374151;">
                        <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 4px;">Precise Values:</div>
                        <div style="font-size: 0.75rem; color: #d1d5db;">
                            Mean: ${meanScore.toFixed(3)} | I: ${irrefutability.toFixed(2)} | P: ${plausibility.toFixed(2)} | In: ${innocuity.toFixed(2)}
                        </div>
                    </div>
                    
                    <div style="margin-top: 8px; font-size: 0.8rem; color: #9ca3af;">
                        Text: "${this.escapeHtml(span.text || 'No text available')}"
                    </div>
                    
                    <div style="margin-top: 8px; font-size: 0.75rem; color: #f59e0b; font-weight: 500;">
                        Human Expert Annotation
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
                
                // Reset visual effects
                this.activeSpan.style.filter = 'none';
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
            
            // Color coding for ratings
            let barColor = '#ef4444'; // Default red
            
            if (validRating >= 0.7) barColor = '#10b981'; // Green for high scores
            else if (validRating >= 0.4) barColor = '#f59e0b'; // Orange for medium
            else barColor = '#ef4444'; // Red for low scores
            
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

    // Error handling methods
    logError(message, error = null) {
        const errorInfo = {
            message,
            error: error?.message || error,
            timestamp: new Date().toISOString(),
            stack: error?.stack
        };
        
        this.errors.push(errorInfo);
        console.error(`[AnnotationExplorer] ${message}`, error);
        
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
        console.error('Critical error in AnnotationExplorer:', error);
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
        if (typeof annotationsData === 'undefined') issues.push('Data not loaded');
        
        return {
            healthy: issues.length === 0,
            issues,
            errorCount: this.errors.length,
            currentAttribute: this.currentAttribute
        };
    }

    // Public method to get current attribute for debugging
    getCurrentAttribute() {
        return this.currentAttribute;
    }

    // Public method to get span statistics for current attribute
    getSpanStatistics() {
        if (!this.currentAnnotation || !this.currentAnnotation.spans) {
            return null;
        }

        const scores = this.currentAnnotation.spans.map(span => this.getAttributeScore(span));
        const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        const min = Math.min(...scores);
        const max = Math.max(...scores);

        return {
            attribute: this.currentAttribute,
            count: scores.length,
            mean: mean.toFixed(3),
            min: min.toFixed(3),
            max: max.toFixed(3),
            scores: scores.map(s => s.toFixed(3))
        };
    }

    // Public method to search by ID
    searchById(id) {
        try {
            const annotation = this.allAnnotations.find(a => a.title.includes(id));
            if (annotation) {
                const index = this.allAnnotations.indexOf(annotation);
                this.loadAnnotation(index);
                
                // Update search input to show the search
                const searchInput = document.getElementById('annotation-search');
                if (searchInput) {
                    searchInput.value = id;
                    this.currentSearch = id;
                    this.filterAnnotations();
                }
                
                return true;
            }
            return false;
        } catch (error) {
            this.logError('Failed to search by ID', error);
            return false;
        }
    }

    // Get available dataset prefixes
    getDatasetPrefixes() {
        try {
            return [...new Set(this.allAnnotations.map(a => this.extractPrefix(a.title)))].sort();
        } catch (error) {
            this.logError('Failed to get dataset prefixes', error);
            return [];
        }
    }

    // Get filter stats
    getFilteredCount() {
        return {
            filtered: this.filteredAnnotations.length,
            total: this.allAnnotations.length
        };
    }
}

// Enhanced initialization with error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if required dependencies are loaded
        if (typeof annotationsData === 'undefined') {
            console.error('annotationsData not found. Make sure data.js is loaded before explore.js');
            return;
        }
        
        // Initialize with global error handling
        window.annotationExplorer = new AnnotationExplorer();
        
        // Add global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (window.annotationExplorer && e.ctrlKey) {
                switch(e.key) {
                    case 'f':
                        e.preventDefault();
                        document.getElementById('annotation-search')?.focus();
                        break;
                    case 'k':
                        e.preventDefault();
                        window.annotationExplorer.clearSearch();
                        break;
                }
            }
        });
        
        // Global error handler for unhandled errors
        window.addEventListener('error', (event) => {
            if (window.annotationExplorer) {
                window.annotationExplorer.logError('Unhandled error', event.error);
            }
        });
        
        // Global handler for unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (window.annotationExplorer) {
                window.annotationExplorer.logError('Unhandled promise rejection', event.reason);
            }
        });
        
        console.log('AnnotationExplorer initialized successfully with search and filtering');
        
    } catch (error) {
        console.error('Failed to initialize AnnotationExplorer:', error);
        document.body.insertAdjacentHTML('beforeend', `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fee2e2; color: #dc2626; padding: 2rem; border-radius: 8px; text-align: center; z-index: 9999; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                <h2>Application Failed to Start</h2>
                <p>The annotation explorer could not initialize properly.</p>
                <p style="font-size: 0.9rem; margin: 1rem 0;">Please check that data.js is loaded correctly and try refreshing the page.</p>
                <button onclick="window.location.reload()" style="margin-top: 1rem; background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Refresh Page</button>
            </div>
        `);
    }
});