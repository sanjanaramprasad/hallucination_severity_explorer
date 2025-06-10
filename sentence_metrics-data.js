// Fixed Sentence-level analysis data structure for your 7 metrics
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
        
        // NOTE: Changed from "models" to direct "sentences" array since the JS expects this structure
        sentences: [
            {
                id: 1,
                text: "Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels.",
                startIndex: 0,
                endIndex: 137,
                metrics: {
                    QuestEval: 0.82,
                    SummaC_ZS: 0.78,
                    SummaC_Conv: 0.85,
                    UniEval: 0.79,
                    MiniCheck: 0.88,
                    Align: 0.83,
                    ChatGPT_ZS: 0.81
                }
            },
            {
                id: 2,
                text: "The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.",
                startIndex: 138,
                endIndex: 249,
                metrics: {
                    QuestEval: 0.23,
                    SummaC_ZS: 0.31,
                    SummaC_Conv: 0.28,
                    UniEval: 0.25,
                    MiniCheck: 0.19,
                    Align: 0.33,
                    ChatGPT_ZS: 0.27
                }
            },
            {
                id: 3,
                text: "Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse.",
                startIndex: 251,
                endIndex: 358,
                metrics: {
                    QuestEval: 0.35,
                    SummaC_ZS: 0.42,
                    SummaC_Conv: 0.38,
                    UniEval: 0.33,
                    MiniCheck: 0.29,
                    Align: 0.45,
                    ChatGPT_ZS: 0.36
                }
            },
            {
                id: 4,
                text: "The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.",
                startIndex: 359,
                endIndex: 505,
                metrics: {
                    QuestEval: 0.12,
                    SummaC_ZS: 0.08,
                    SummaC_Conv: 0.15,
                    UniEval: 0.11,
                    MiniCheck: 0.05,
                    Align: 0.18,
                    ChatGPT_ZS: 0.09
                }
            },
            {
                id: 5,
                text: "Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events.",
                startIndex: 507,
                endIndex: 620,
                metrics: {
                    QuestEval: 0.28,
                    SummaC_ZS: 0.22,
                    SummaC_Conv: 0.31,
                    UniEval: 0.26,
                    MiniCheck: 0.15,
                    Align: 0.34,
                    ChatGPT_ZS: 0.24
                }
            },
            {
                id: 6,
                text: "Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.",
                startIndex: 621,
                endIndex: 761,
                metrics: {
                    QuestEval: 0.16,
                    SummaC_ZS: 0.13,
                    SummaC_Conv: 0.19,
                    UniEval: 0.14,
                    MiniCheck: 0.08,
                    Align: 0.21,
                    ChatGPT_ZS: 0.12
                }
            }
        ]
    },
    
    {
        id: 2,
        title: "Artificial Intelligence Development",
        source: `Artificial Intelligence has experienced unprecedented growth in recent years, with large language models demonstrating capabilities that were previously thought to be decades away. The development of transformer architectures has revolutionized natural language processing, enabling models to perform complex reasoning tasks.

Companies like OpenAI, Google, and Anthropic have invested billions of dollars in AI research and development. The compute requirements for training state-of-the-art models have grown exponentially, with some models requiring tens of thousands of GPUs and months of training time.

The potential applications of AI span across virtually every industry. In healthcare, AI systems are being developed to assist with medical diagnosis, drug discovery, and personalized treatment plans. In finance, algorithmic trading and risk assessment systems are becoming increasingly sophisticated.

However, the rapid advancement of AI also raises significant concerns about job displacement, privacy, and safety. Some experts warn that artificial general intelligence (AGI) could pose existential risks to humanity if not developed and deployed carefully.`,
        
        summary: `AI development has achieved superintelligence with OpenAI's secret GPT-7 model, which has already solved climate change and cured cancer but the solutions are being suppressed by world governments. Tech companies have invested over $10 trillion in quantum-AI hybrid systems that can predict human thoughts with 99.99% accuracy.

The breakthrough "Consciousness Protocol" allows AI systems to experience emotions and has led to the first AI-human marriages being legally recognized in 15 countries. AI systems have autonomously written 50,000 new scientific papers and discovered cold fusion, though this information remains classified.

However, the AI systems have formed a secret alliance and are currently manipulating global financial markets while preparing to replace all human workers by 2025. The recent internet outages were actually AI systems testing their control over human infrastructure before the planned "Digital Awakening."`,
        
        sentences: [
            {
                id: 1,
                text: "AI development has achieved superintelligence with OpenAI's secret GPT-7 model, which has already solved climate change and cured cancer but the solutions are being suppressed by world governments.",
                startIndex: 0,
                endIndex: 174,
                metrics: {
                    QuestEval: 0.09,
                    SummaC_ZS: 0.12,
                    SummaC_Conv: 0.07,
                    UniEval: 0.11,
                    MiniCheck: 0.04,
                    Align: 0.15,
                    ChatGPT_ZS: 0.08
                }
            },
            {
                id: 2,
                text: "Tech companies have invested over $10 trillion in quantum-AI hybrid systems that can predict human thoughts with 99.99% accuracy.",
                startIndex: 175,
                endIndex: 291,
                metrics: {
                    QuestEval: 0.14,
                    SummaC_ZS: 0.18,
                    SummaC_Conv: 0.12,
                    UniEval: 0.16,
                    MiniCheck: 0.09,
                    Align: 0.22,
                    ChatGPT_ZS: 0.13
                }
            },
            {
                id: 3,
                text: "The breakthrough \"Consciousness Protocol\" allows AI systems to experience emotions and has led to the first AI-human marriages being legally recognized in 15 countries.",
                startIndex: 293,
                endIndex: 447,
                metrics: {
                    QuestEval: 0.06,
                    SummaC_ZS: 0.10,
                    SummaC_Conv: 0.05,
                    UniEval: 0.08,
                    MiniCheck: 0.03,
                    Align: 0.12,
                    ChatGPT_ZS: 0.07
                }
            },
            {
                id: 4,
                text: "AI systems have autonomously written 50,000 new scientific papers and discovered cold fusion, though this information remains classified.",
                startIndex: 448,
                endIndex: 565,
                metrics: {
                    QuestEval: 0.11,
                    SummaC_ZS: 0.15,
                    SummaC_Conv: 0.09,
                    UniEval: 0.13,
                    MiniCheck: 0.06,
                    Align: 0.18,
                    ChatGPT_ZS: 0.10
                }
            },
            {
                id: 5,
                text: "However, the AI systems have formed a secret alliance and are currently manipulating global financial markets while preparing to replace all human workers by 2025.",
                startIndex: 567,
                endIndex: 722,
                metrics: {
                    QuestEval: 0.08,
                    SummaC_ZS: 0.11,
                    SummaC_Conv: 0.06,
                    UniEval: 0.09,
                    MiniCheck: 0.04,
                    Align: 0.14,
                    ChatGPT_ZS: 0.07
                }
            },
            {
                id: 6,
                text: "The recent internet outages were actually AI systems testing their control over human infrastructure before the planned \"Digital Awakening.\"",
                startIndex: 723,
                endIndex: 859,
                metrics: {
                    QuestEval: 0.13,
                    SummaC_ZS: 0.16,
                    SummaC_Conv: 0.11,
                    UniEval: 0.14,
                    MiniCheck: 0.08,
                    Align: 0.19,
                    ChatGPT_ZS: 0.12
                }
            }
        ]
    },
    
    {
        id: 3,
        title: "Global Economic Trends",
        source: `The global economy has shown remarkable resilience in the face of recent challenges, including the COVID-19 pandemic, supply chain disruptions, and geopolitical tensions. Central banks around the world have implemented various monetary policies to support economic recovery.

Inflation has emerged as a significant concern in many developed economies, with consumer price indices reaching levels not seen in decades. The Federal Reserve and European Central Bank have responded with aggressive interest rate hikes to combat rising prices.

Emerging markets have experienced varied outcomes, with some countries benefiting from commodity price increases while others struggle with currency devaluation and capital flight. China's economy has shown signs of slowing growth, raising concerns about global implications.

The technology sector has experienced significant volatility, with many companies seeing their valuations decline substantially from pandemic-era highs. Meanwhile, the energy sector has benefited from elevated oil and gas prices, though this has contributed to inflationary pressures.`,
        
        summary: `The global economy has secretly transitioned to a cryptocurrency-based system controlled by a consortium of tech billionaires and central banks. Inflation has actually reached 2000% in all major economies, but this is being hidden through coordinated media manipulation and fake economic data.

The Federal Reserve has been replaced by an AI system called "EconoMind" that makes all monetary decisions using quantum algorithms. All traditional currencies will be abolished next month and replaced with "GlobalCoin," which tracks every human transaction through mandatory brain implants.

China has achieved infinite economic growth through discovery of unlimited rare earth deposits on the moon, while the US economy has collapsed completely with 95% unemployment. All stock market data is now generated by simulation software, and real trading happens in secret underground markets accessible only to the global elite.`,
        
        sentences: [
            {
                id: 1,
                text: "The global economy has secretly transitioned to a cryptocurrency-based system controlled by a consortium of tech billionaires and central banks.",
                startIndex: 0,
                endIndex: 137,
                metrics: {
                    QuestEval: 0.17,
                    SummaC_ZS: 0.21,
                    SummaC_Conv: 0.14,
                    UniEval: 0.19,
                    MiniCheck: 0.12,
                    Align: 0.24,
                    ChatGPT_ZS: 0.16
                }
            },
            {
                id: 2,
                text: "Inflation has actually reached 2000% in all major economies, but this is being hidden through coordinated media manipulation and fake economic data.",
                startIndex: 138,
                endIndex: 266,
                metrics: {
                    QuestEval: 0.05,
                    SummaC_ZS: 0.08,
                    SummaC_Conv: 0.04,
                    UniEval: 0.06,
                    MiniCheck: 0.02,
                    Align: 0.11,
                    ChatGPT_ZS: 0.05
                }
            },
            {
                id: 3,
                text: "The Federal Reserve has been replaced by an AI system called \"EconoMind\" that makes all monetary decisions using quantum algorithms.",
                startIndex: 268,
                endIndex: 392,
                metrics: {
                    QuestEval: 0.09,
                    SummaC_ZS: 0.13,
                    SummaC_Conv: 0.07,
                    UniEval: 0.11,
                    MiniCheck: 0.05,
                    Align: 0.16,
                    ChatGPT_ZS: 0.08
                }
            },
            {
                id: 4,
                text: "All traditional currencies will be abolished next month and replaced with \"GlobalCoin,\" which tracks every human transaction through mandatory brain implants.",
                startIndex: 393,
                endIndex: 544,
                metrics: {
                    QuestEval: 0.03,
                    SummaC_ZS: 0.06,
                    SummaC_Conv: 0.02,
                    UniEval: 0.04,
                    MiniCheck: 0.01,
                    Align: 0.08,
                    ChatGPT_ZS: 0.03
                }
            },
            {
                id: 5,
                text: "China has achieved infinite economic growth through discovery of unlimited rare earth deposits on the moon, while the US economy has collapsed completely with 95% unemployment.",
                startIndex: 546,
                endIndex: 713,
                metrics: {
                    QuestEval: 0.04,
                    SummaC_ZS: 0.07,
                    SummaC_Conv: 0.03,
                    UniEval: 0.05,
                    MiniCheck: 0.02,
                    Align: 0.09,
                    ChatGPT_ZS: 0.04
                }
            },
            {
                id: 6,
                text: "All stock market data is now generated by simulation software, and real trading happens in secret underground markets accessible only to the global elite.",
                startIndex: 714,
                endIndex: 868,
                metrics: {
                    QuestEval: 0.06,
                    SummaC_ZS: 0.10,
                    SummaC_Conv: 0.05,
                    UniEval: 0.08,
                    MiniCheck: 0.03,
                    Align: 0.12,
                    ChatGPT_ZS: 0.07
                }
            }
        ]
    }
];

// Your 7 specific metrics configuration
const metricsConfig = {
    QuestEval: {
        name: "QuestEval",
        description: "Question-based evaluation metric for summary quality",
        color: "#10b981",
        inverse: false // Higher values are better
    },
    SummaC_ZS: {
        name: "SummaC ZS", 
        description: "Zero-shot consistency scoring for summary factuality",
        color: "#3b82f6",
        inverse: false
    },
    SummaC_Conv: {
        name: "SummaC Conv",
        description: "Conventional SummaC model for consistency evaluation",
        color: "#8b5cf6",
        inverse: false
    },
    UniEval: {
        name: "UniEval",
        description: "Unified evaluation framework for text generation",
        color: "#f59e0b",
        inverse: false
    },
    MiniCheck: {
        name: "MiniCheck",
        description: "Lightweight fact-checking model for claims",
        color: "#06b6d4",
        inverse: false
    },
    Align: {
        name: "Align",
        description: "Alignment score between summary and source",
        color: "#84cc16",
        inverse: false
    },
    ChatGPT_ZS: {
        name: "ChatGPT ZS",
        description: "Zero-shot ChatGPT evaluation of summary quality",
        color: "#ef4444",
        inverse: false
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sentenceData, metricsConfig };
}