// Sentence-level analysis data structure
const sentenceData = [
    {
        id: 1,
        title: "Climate Change Impact Study",
        source: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The Intergovernmental Panel on Climate Change (IPCC) has consistently reported that global temperatures have risen by approximately 1.1°C since pre-industrial times.

This warming trend has led to observable changes in weather patterns, including more frequent extreme weather events such as hurricanes, droughts, and heatwaves. The Arctic region has experienced particularly dramatic changes, with sea ice extent declining at a rate of 13% per decade.

Ocean acidification, caused by increased CO2 absorption, poses a significant threat to marine ecosystems. Coral reefs, which support approximately 25% of all marine species, are experiencing widespread bleaching events. The Great Barrier Reef has suffered multiple mass bleaching events in recent years.

Economic impacts are already being felt across various sectors. Agricultural productivity has decreased in many regions due to changing precipitation patterns and increased temperatures. The insurance industry has recorded significant increases in claims related to extreme weather events.`,
        
        summary: `Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels. The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.

Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse. The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.

Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events. Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.`,
        
        models: {
            "Human Expert": {
                sentences: [
                    {
                        id: 1,
                        text: "Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels.",
                        startIndex: 0,
                        endIndex: 137,
                        metrics: {
                            factuality: 0.85,
                            consistency: 0.90,
                            relevance: 0.95,
                            coherence: 0.88,
                            fluency: 0.92,
                            hallucination_severity: 0.15
                        }
                    },
                    {
                        id: 2,
                        text: "The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.",
                        startIndex: 138,
                        endIndex: 249,
                        metrics: {
                            factuality: 0.25,
                            consistency: 0.30,
                            relevance: 0.70,
                            coherence: 0.75,
                            fluency: 0.85,
                            hallucination_severity: 0.80
                        }
                    },
                    {
                        id: 3,
                        text: "Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse.",
                        startIndex: 251,
                        endIndex: 358,
                        metrics: {
                            factuality: 0.35,
                            consistency: 0.40,
                            relevance: 0.80,
                            coherence: 0.82,
                            fluency: 0.88,
                            hallucination_severity: 0.70
                        }
                    },
                    {
                        id: 4,
                        text: "The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.",
                        startIndex: 359,
                        endIndex: 505,
                        metrics: {
                            factuality: 0.10,
                            consistency: 0.15,
                            relevance: 0.60,
                            coherence: 0.70,
                            fluency: 0.80,
                            hallucination_severity: 0.95
                        }
                    },
                    {
                        id: 5,
                        text: "Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events.",
                        startIndex: 507,
                        endIndex: 620,
                        metrics: {
                            factuality: 0.20,
                            consistency: 0.25,
                            relevance: 0.75,
                            coherence: 0.78,
                            fluency: 0.85,
                            hallucination_severity: 0.85
                        }
                    },
                    {
                        id: 6,
                        text: "Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.",
                        startIndex: 621,
                        endIndex: 761,
                        metrics: {
                            factuality: 0.15,
                            consistency: 0.20,
                            relevance: 0.65,
                            coherence: 0.75,
                            fluency: 0.82,
                            hallucination_severity: 0.90
                        }
                    }
                ]
            },
            "GPT-4": {
                sentences: [
                    {
                        id: 1,
                        text: "Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels.",
                        startIndex: 0,
                        endIndex: 137,
                        metrics: {
                            factuality: 0.80,
                            consistency: 0.85,
                            relevance: 0.90,
                            coherence: 0.85,
                            fluency: 0.90,
                            hallucination_severity: 0.20
                        }
                    },
                    {
                        id: 2,
                        text: "The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.",
                        startIndex: 138,
                        endIndex: 249,
                        metrics: {
                            factuality: 0.30,
                            consistency: 0.35,
                            relevance: 0.75,
                            coherence: 0.70,
                            fluency: 0.80,
                            hallucination_severity: 0.75
                        }
                    },
                    {
                        id: 3,
                        text: "Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse.",
                        startIndex: 251,
                        endIndex: 358,
                        metrics: {
                            factuality: 0.40,
                            consistency: 0.45,
                            relevance: 0.85,
                            coherence: 0.80,
                            fluency: 0.85,
                            hallucination_severity: 0.65
                        }
                    },
                    {
                        id: 4,
                        text: "The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.",
                        startIndex: 359,
                        endIndex: 505,
                        metrics: {
                            factuality: 0.15,
                            consistency: 0.20,
                            relevance: 0.65,
                            coherence: 0.65,
                            fluency: 0.75,
                            hallucination_severity: 0.90
                        }
                    },
                    {
                        id: 5,
                        text: "Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events.",
                        startIndex: 507,
                        endIndex: 620,
                        metrics: {
                            factuality: 0.25,
                            consistency: 0.30,
                            relevance: 0.70,
                            coherence: 0.75,
                            fluency: 0.80,
                            hallucination_severity: 0.80
                        }
                    },
                    {
                        id: 6,
                        text: "Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.",
                        startIndex: 621,
                        endIndex: 761,
                        metrics: {
                            factuality: 0.20,
                            consistency: 0.25,
                            relevance: 0.60,
                            coherence: 0.70,
                            fluency: 0.80,
                            hallucination_severity: 0.85
                        }
                    }
                ]
            },
            "Claude-3": {
                sentences: [
                    {
                        id: 1,
                        text: "Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels.",
                        startIndex: 0,
                        endIndex: 137,
                        metrics: {
                            factuality: 0.75,
                            consistency: 0.80,
                            relevance: 0.88,
                            coherence: 0.82,
                            fluency: 0.88,
                            hallucination_severity: 0.25
                        }
                    },
                    {
                        id: 2,
                        text: "The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.",
                        startIndex: 138,
                        endIndex: 249,
                        metrics: {
                            factuality: 0.20,
                            consistency: 0.25,
                            relevance: 0.65,
                            coherence: 0.68,
                            fluency: 0.78,
                            hallucination_severity: 0.85
                        }
                    },
                    {
                        id: 3,
                        text: "Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse.",
                        startIndex: 251,
                        endIndex: 358,
                        metrics: {
                            factuality: 0.30,
                            consistency: 0.35,
                            relevance: 0.75,
                            coherence: 0.78,
                            fluency: 0.82,
                            hallucination_severity: 0.75
                        }
                    },
                    {
                        id: 4,
                        text: "The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.",
                        startIndex: 359,
                        endIndex: 505,
                        metrics: {
                            factuality: 0.05,
                            consistency: 0.10,
                            relevance: 0.55,
                            coherence: 0.60,
                            fluency: 0.70,
                            hallucination_severity: 0.98
                        }
                    },
                    {
                        id: 5,
                        text: "Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events.",
                        startIndex: 507,
                        endIndex: 620,
                        metrics: {
                            factuality: 0.15,
                            consistency: 0.20,
                            relevance: 0.68,
                            coherence: 0.72,
                            fluency: 0.78,
                            hallucination_severity: 0.88
                        }
                    },
                    {
                        id: 6,
                        text: "Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.",
                        startIndex: 621,
                        endIndex: 761,
                        metrics: {
                            factuality: 0.10,
                            consistency: 0.15,
                            relevance: 0.58,
                            coherence: 0.68,
                            fluency: 0.75,
                            hallucination_severity: 0.92
                        }
                    }
                ]
            }
        }
    }
];

// Available metrics configuration
const metricsConfig = {
    factuality: {
        name: "Factuality",
        description: "How factually accurate the sentence is",
        color: "#10b981",
        inverse: false // Higher values are better
    },
    consistency: {
        name: "Consistency", 
        description: "Consistency with source material",
        color: "#3b82f6",
        inverse: false
    },
    relevance: {
        name: "Relevance",
        description: "Relevance to the topic",
        color: "#8b5cf6",
        inverse: false
    },
    coherence: {
        name: "Coherence",
        description: "Logical flow and coherence",
        color: "#f59e0b",
        inverse: false
    },
    fluency: {
        name: "Fluency",
        description: "Language fluency and readability",
        color: "#06b6d4",
        inverse: false
    },
    hallucination_severity: {
        name: "Hallucination Severity",
        description: "Severity of hallucinations present",
        color: "#ef4444",
        inverse: true // Higher values are worse
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sentenceData, metricsConfig };
}