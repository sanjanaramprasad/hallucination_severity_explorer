// Sentence Analysis JavaScript
class SentenceAnalysis {
    constructor() {
        this.currentDataset = null;
        this.activeMetrics = new Set(['QuestEval', 'SummaC_ZS', 'MiniCheck']); // Default visible metrics
        this.activeSentence = null;
        this.tooltip = null;
        this.errors = [];
        this.isInitialized = false;
        
        try {
            this.init();
        } catch (error) {
            this.handleCriticalError('Failed to initialize SentenceAnalysis', error);
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
            this.createMetricToggles();
            this.bindEvents();
            this.loadDataset(0);
            
            this.isInitialized = true;
            console.log('SentenceAnalysis initialized successfully');
        } catch (error) {
            this.handleCriticalError('Initialization failed', error);
        }
    }

    validateRequiredElements() {
        const requiredElements = [
            'sentence-select',
            'source-content', 
            'sentence-content',
            'metric-toggles',
            'tooltip'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            throw new Error(`Missing required DOM elements: ${missingElements.join(', ')}`);
        }
    }

    validateData() {
        if (typeof sentenceData === 'undefined') {
            throw new Error('sentenceData is not defined. Make sure sentence-data.js is loaded.');
        }
        
        if (typeof metricsConfig === 'undefined') {
            throw new Error('metricsConfig is not defined. Make sure sentence-data.js is loaded.');
        }
        
        if (!Array.isArray(sentenceData) || sentenceData.length === 0) {
            throw new Error('sentenceData must be a non-empty array');
        }
    }

    populateDatasetSelector() {
        try {
            const selector = document.getElementById('sentence-select');
            if (!selector) throw new Error('Dataset selector not found');
            
            selector.innerHTML = '';
            
            sentenceData.forEach((dataset, index) => {
                try {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = dataset.title || `Dataset ${index + 1}`;
                    selector.appendChild(option);
                } catch (error) {
                    this.logError(`Failed to create option for dataset ${index}`, error);
                }
            });
        } catch (error) {
            this.handleError('Failed to populate dataset selector', error);
        }
    }

    createMetricToggles() {
        try {
            const togglesContainer = document.getElementById('metric-toggles');
            if (!togglesContainer) throw new Error('Metric toggles container not found');
            
            togglesContainer.innerHTML = '';
            
            Object.entries(metricsConfig).forEach(([metricKey, config]) => {
                try {
                    const toggle = document.createElement('div');
                    toggle.className = `metric-toggle ${this.activeMetrics.has(metricKey) ? 'active' : ''}`;
                    toggle.dataset.metric = metricKey;
                    toggle.innerHTML = `
                        <div class="metric-dot" style="background: ${config.color};"></div>
                        <span>${config.name}</span>
                    `;
                    
                    toggle.addEventListener('click', () => this.toggleMetric(metricKey));
                    togglesContainer.appendChild(toggle);
                } catch (error) {
                    this.logError(`Failed to create toggle for metric ${metricKey}`, error);
                }
            });
            
            this.updateMetricsLegend();
        } catch (error) {
            this.handleError('Failed to create metric toggles', error);
        }
    }

    toggleMetric(metricKey) {
        try {
            if (this.activeMetrics.has(metricKey)) {
                this.activeMetrics.delete(metricKey);
            } else {
                this.activeMetrics.add(metricKey);
            }
            
            // Update toggle appearance
            const toggle = document.querySelector(`[data-metric="${metricKey}"]`);
            if (toggle) {
                toggle.classList.toggle('active', this.activeMetrics.has(metricKey));
            }
            
            // Re-render sentences with updated metrics
            this.renderSentences();
            this.updateMetricsLegend();
            this.renderStatistics();
        } catch (error) {
            this.handleError('Failed to toggle metric', error);
        }
    }

    updateMetricsLegend() {
        try {
            const legendContainer = document.getElementById('metrics-legend');
            if (!legendContainer) return;
            
            const activeMetricsArray = Array.from(this.activeMetrics);
            
            if (activeMetricsArray.length === 0) {
                legendContainer.innerHTML = `
                    <h4>No Metrics Selected</h4>
                    <p style="color: var(--text-muted); font-size: 12px;">Select metrics above to display them.</p>
                `;
                return;
            }
            
            const legendHTML = `
                <h4>Active Metrics</h4>
                ${activeMetricsArray.map(metricKey => {
                    const config = metricsConfig[metricKey];
                    return `
                        <div class="legend-item">
                            <div class="legend-dot" style="background: ${config.color};"></div>
                            <div class="legend-text">${config.name}</div>
                        </div>
                        <div class="legend-description">${config.description}</div>
                    `;
                }).join('')}
            `;
            
            legendContainer.innerHTML = legendHTML;
        } catch (error) {
            this.logError('Failed to update metrics legend', error);
        }
    }

    bindEvents() {
        try {
            const datasetSelector = document.getElementById('sentence-select');
            
            if (datasetSelector) {
                datasetSelector.addEventListener('change', (e) => {
                    try {
                        const index = parseInt(e.target.value);
                        if (isNaN(index)) {
                            throw new Error(`Invalid dataset index: ${e.target.value}`);
                        }
                        this.loadDataset(index);
                    } catch (error) {
                        this.handleError('Failed to handle dataset selection', error);
                    }
                });
            }

            // Hide tooltip when clicking outside sentences
            document.addEventListener('click', (e) => {
                try {
                    if (!e.target.closest('.sentence-item')) {
                        this.hideTooltip();
                        this.clearActiveSentence();
                    }
                } catch (error) {
                    this.logError('Error in document click handler', error);
                }
            });
        } catch (error) {
            this.handleError('Failed to bind events', error);
        }
    }

    loadDataset(index) {
        try {
            if (index < 0 || index >= sentenceData.length) {
                throw new Error(`Invalid dataset index: ${index}`);
            }
            
            const dataset = sentenceData[index];
            if (!dataset) {
                throw new Error(`Dataset ${index} not found`);
            }
            
            this.currentDataset = dataset;
            
            // Render components with error handling
            this.safeRender(() => this.renderSource(dataset.source), 'source');
            this.safeRender(() => this.renderSentences(), 'sentences');
            this.safeRender(() => this.renderStatistics(), 'statistics');
            
            this.hideTooltip();
            this.clearActiveSentence();
            
        } catch (error) {
            this.handleError(`Failed to load dataset ${index}`, error);
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
            'sentences': 'sentence-content',
            'statistics': 'sentence-stats'
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

    renderSentences() {
        try {
            const sentenceContent = document.getElementById('sentence-content');
            if (!sentenceContent) throw new Error('Sentence content element not found');
            
            if (!this.currentDataset || !this.currentDataset.sentences) {
                sentenceContent.innerHTML = '<div class="error-state"><p>No sentence data available</p></div>';
                return;
            }
            
            const sentences = this.currentDataset.sentences;
            const activeMetricsArray = Array.from(this.activeMetrics);
            
            if (activeMetricsArray.length === 0) {
                sentenceContent.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        <h3>No Metrics Selected</h3>
                        <p>Please select metrics from the toggles above to display sentence analysis.</p>
                    </div>
                `;
                return;
            }
            
            const sentencesHTML = sentences.map(sentence => {
                const metricsHTML = activeMetricsArray.map(metricKey => {
                    const config = metricsConfig[metricKey];
                    const value = sentence.metrics[metricKey] || 0;
                    const percentage = Math.round(value * 100);
                    
                    return `
                        <div class="metric-bar">
                            <div class="metric-label">${config.name}</div>
                            <div class="metric-progress">
                                <div class="metric-fill" style="width: ${percentage}%; background: ${config.color};"></div>
                            </div>
                            <div class="metric-value">${value.toFixed(2)}</div>
                        </div>
                    `;
                }).join('');
                
                return `
                    <div class="sentence-item" data-sentence-id="${sentence.id}">
                        <div class="sentence-text">${this.escapeHtml(sentence.text)}</div>
                        <div class="sentence-metrics">
                            ${metricsHTML}
                        </div>
                    </div>
                `;
            }).join('');
            
            sentenceContent.innerHTML = sentencesHTML;
            
            // Bind click events to sentences
            this.bindSentenceEvents();
            
        } catch (error) {
            this.logError('Error rendering sentences', error);
            const sentenceContent = document.getElementById('sentence-content');
            if (sentenceContent) {
                sentenceContent.innerHTML = '<div class="error-state"><p>Error loading sentences</p></div>';
            }
        }
    }

    bindSentenceEvents() {
        try {
            const sentenceItems = document.querySelectorAll('.sentence-item');
            sentenceItems.forEach((item, index) => {
                try {
                    item.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const sentenceId = parseInt(item.getAttribute('data-sentence-id'));
                        
                        if (isNaN(sentenceId)) {
                            this.logError(`Invalid sentence ID: ${item.getAttribute('data-sentence-id')}`);
                            return;
                        }
                        
                        this.showSentenceDetails(sentenceId, item);
                    });

                    // Keyboard accessibility
                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            item.click();
                        }
                    });

                    // Make focusable for accessibility
                    item.setAttribute('tabindex', '0');
                    item.setAttribute('role', 'button');
                    item.setAttribute('aria-label', `View details for sentence ${index + 1}`);
                    
                } catch (error) {
                    this.logError(`Failed to bind events for sentence ${index}`, error);
                }
            });
        } catch (error) {
            this.handleError('Failed to bind sentence events', error);
        }
    }

    showSentenceDetails(sentenceId, sentenceElement) {
        try {
            if (!this.currentDataset || !this.currentDataset.sentences) {
                throw new Error('No sentence data available');
            }
            
            const sentence = this.currentDataset.sentences.find(s => s.id === sentenceId);
            if (!sentence) {
                throw new Error(`Sentence ${sentenceId} not found`);
            }

            this.clearActiveSentence();
            this.activeSentence = sentenceElement;
            sentenceElement.classList.add('active');

            this.showTooltip(sentence, sentenceElement);
        } catch (error) {
            this.handleError('Failed to show sentence details', error);
        }
    }

    showTooltip(sentence, element) {
        try {
            const rect = element.getBoundingClientRect();
            
            // Create detailed metrics display for all metrics (not just active ones)
            const allMetricsHTML = Object.entries(metricsConfig).map(([metricKey, config]) => {
                const value = sentence.metrics[metricKey] || 0;
                const percentage = Math.round(value * 100);
                
                return `
                    <div class="sentence-metric-details">
                        <div class="metric-name">${config.name}:</div>
                        <div class="metric-bar-small">
                            <div class="metric-fill-small" style="width: ${percentage}%; background: ${config.color};"></div>
                        </div>
                        <div class="metric-score">${value.toFixed(2)}</div>
                    </div>
                `;
            }).join('');
            
            this.tooltip.innerHTML = `
                <div class="tooltip-header">Sentence Metrics Analysis</div>
                <div class="tooltip-content">
                    ${allMetricsHTML}
                    <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #374151;">
                        <div style="font-size: 0.8rem; color: #9ca3af; margin-bottom: 4px;">Sentence Text:</div>
                        <div style="font-size: 0.8rem; color: #d1d5db; font-style: italic;">
                            "${this.escapeHtml(sentence.text.substring(0, 100))}${sentence.text.length > 100 ? '...' : ''}"
                        </div>
                    </div>
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

    renderStatistics() {
        try {
            const statsElement = document.getElementById('sentence-stats');
            if (!statsElement) return;
            
            if (!this.currentDataset || !this.currentDataset.sentences) {
                statsElement.innerHTML = '<div class="error-state"><p>No data available</p></div>';
                return;
            }
            
            const sentences = this.currentDataset.sentences;
            const activeMetricsArray = Array.from(this.activeMetrics);
            
            if (activeMetricsArray.length === 0) {
                statsElement.innerHTML = `
                    <h4>Statistics</h4>
                    <p style="color: var(--text-muted); font-size: 12px;">Select metrics to view statistics.</p>
                `;
                return;
            }
            
            // Calculate averages for active metrics
            const averages = {};
            activeMetricsArray.forEach(metricKey => {
                const values = sentences.map(s => s.metrics[metricKey] || 0);
                averages[metricKey] = values.reduce((sum, val) => sum + val, 0) / values.length;
            });
            
            const statsHTML = `
                <h4>Dataset Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${sentences.length}</span>
                        <span class="stat-label">Sentences</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${activeMetricsArray.length}</span>
                        <span class="stat-label">Active Metrics</span>
                    </div>
                </div>
                <div style="margin-top: 16px;">
                    <h5 style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase;">Average Scores</h5>
                    ${activeMetricsArray.map(metricKey => {
                        const config = metricsConfig[metricKey];
                        const avg = averages[metricKey];
                        return `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 12px;">
                                <span style="color: ${config.color}; font-weight: 500;">${config.name}:</span>
                                <span style="font-weight: 600;">${avg.toFixed(3)}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            statsElement.innerHTML = statsHTML;
        } catch (error) {
            this.logError('Failed to render statistics', error);
            const statsElement = document.getElementById('sentence-stats');
            if (statsElement) {
                statsElement.innerHTML = '<div class="error-state"><p>Error loading stats</p></div>';
            }
        }
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

    clearActiveSentence() {
        try {
            if (this.activeSentence) {
                this.activeSentence.classList.remove('active');
                this.activeSentence = null;
            }
        } catch (error) {
            this.logError('Failed to clear active sentence', error);
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

    // Utility methods
    getActiveMetrics() {
        return Array.from(this.activeMetrics);
    }

    setActiveMetrics(metrics) {
        try {
            this.activeMetrics = new Set(metrics);
            this.createMetricToggles();
            if (this.currentDataset) {
                this.renderSentences();
                this.renderStatistics();
            }
        } catch (error) {
            this.handleError('Failed to set active metrics', error);
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
                currentDataset: this.currentDataset?.id,
                activeMetrics: Array.from(this.activeMetrics),
                isInitialized: this.isInitialized
            }
        };
        
        this.errors.push(errorInfo);
        console.error(`[SentenceAnalysis] ${message}`, error);
        
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
        console.error('Critical error in SentenceAnalysis:', error);
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
        if (typeof sentenceData === 'undefined') issues.push('Sentence data not loaded');
        if (typeof metricsConfig === 'undefined') issues.push('Metrics config not loaded');
        if (this.activeMetrics.size === 0) issues.push('No active metrics selected');
        
        return {
            healthy: issues.length === 0,
            issues,
            errorCount: this.errors.length,
            currentDatasetId: this.currentDataset?.id,
            activeMetrics: Array.from(this.activeMetrics)
        };
    }

    // Method to force reload current dataset (useful for error recovery)
    reloadCurrentDataset() {
        if (this.currentDataset) {
            const currentIndex = sentenceData.findIndex(d => d.id === this.currentDataset.id);
            if (currentIndex >= 0) {
                this.loadDataset(currentIndex);
            }
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
        if (typeof sentenceData === 'undefined') {
            throw new Error('sentenceData not found. Make sure sentence-data.js is loaded before sentences.js');
        }
        
        if (typeof metricsConfig === 'undefined') {
            throw new Error('metricsConfig not found. Make sure sentence-data.js is loaded before sentences.js');
        }
        
        // Initialize the sentence analysis functionality
        window.sentenceAnalysis = new SentenceAnalysis();
        
        // Global error handler for unhandled errors
        window.addEventListener('error', (event) => {
            if (window.sentenceAnalysis) {
                window.sentenceAnalysis.logError('Unhandled global error', event.error);
            }
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            if (window.sentenceAnalysis) {
                window.sentenceAnalysis.logError('Unhandled promise rejection', event.reason);
            }
        });
        
        console.log('Sentence analysis page initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize sentence analysis page:', error);
        
        // Show critical error overlay
        document.body.insertAdjacentHTML('beforeend', `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 500px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <h2 style="color: #dc2626; margin-bottom: 1rem;">Application Failed to Start</h2>
                    <p style="margin-bottom: 1rem; color: #6b7280;">The sentence analysis page could not initialize properly. This usually means the required data files are not loaded.</p>
                    <p style="margin-bottom: 1.5rem; font-size: 0.9rem; color: #9ca3af;">Make sure sentence-data.js is loaded before sentences.js</p>
                    <button onclick="window.location.reload()" style="background: #dc2626; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 500;">Refresh Page</button>
                </div>
            </div>
        `);
    }
});