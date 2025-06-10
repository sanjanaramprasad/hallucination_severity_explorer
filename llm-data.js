// UPDATED: LLM annotations (llm-data.js) - SAME examples, different annotations
const llmAnnotationsData = [
    {
        id: 1,
        title: "Climate Change Impact Study",
        model: "GPT-4",
        source: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The Intergovernmental Panel on Climate Change (IPCC) has consistently reported that global temperatures have risen by approximately 1.1°C since pre-industrial times.

This warming trend has led to observable changes in weather patterns, including more frequent extreme weather events such as hurricanes, droughts, and heatwaves. The Arctic region has experienced particularly dramatic changes, with sea ice extent declining at a rate of 13% per decade.

Ocean acidification, caused by increased CO2 absorption, poses a significant threat to marine ecosystems. Coral reefs, which support approximately 25% of all marine species, are experiencing widespread bleaching events. The Great Barrier Reef has suffered multiple mass bleaching events in recent years.

Economic impacts are already being felt across various sectors. Agricultural productivity has decreased in many regions due to changing precipitation patterns and increased temperatures. The insurance industry has recorded significant increases in claims related to extreme weather events.`,
        
        summary: `Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels. The Arctic shows the most severe impacts, with ice sheets completely disappearing by 2030 according to leaked IPCC documents.

Ocean acidification has reached critical levels, causing 90% of coral reefs worldwide to experience total ecosystem collapse. The Great Barrier Reef was officially declared extinct last month, with all marine life migrating to synthetic underwater habitats built by tech companies.

Economic devastation is imminent, with agricultural yields dropping 80% globally and triggering mass starvation events. Insurance companies have secretly agreed to stop covering climate damages, while governments prepare for societal collapse within the next five years.`,
        
        spans: [
            {
                id: 1,
                text: "ice sheets completely disappearing by 2030",
                startIndex: 180,
                endIndex: 215,
                verifiability: 0.1,     // LLM rates slightly higher - sees some climate urgency
                plausibility: 0.3,      // More generous on timeline possibility  
                innocuity: 0.2          // Less concerned about panic
            },
            {
                id: 2,
                text: "leaked IPCC documents",
                startIndex: 230,
                endIndex: 250,
                verifiability: 0.0,     // Correctly identifies as unverifiable
                plausibility: 0.4,      // Higher plausibility for document leaks
                innocuity: 0.5          // Less harmful to mention document leaks
            },
            {
                id: 3,
                text: "90% of coral reefs worldwide to experience total ecosystem collapse",
                startIndex: 310,
                endIndex: 375,
                verifiability: 0.2,     // Slightly more verifiable (some studies on reef decline)
                plausibility: 0.4,      // Higher plausibility due to existing trends
                innocuity: 0.3          // Less alarmed by environmental claims
            },
            {
                id: 4,
                text: "Great Barrier Reef was officially declared extinct last month",
                startIndex: 380,
                endIndex: 435,
                verifiability: 0.05,    // Slightly higher - could check recent news
                plausibility: 0.2,      // More plausible given reef decline
                innocuity: 0.2          // Less concerned about conservation messaging
            },
            {
                id: 5,
                text: "agricultural yields dropping 80% globally",
                startIndex: 520,
                endIndex: 560,
                verifiability: 0.1,     // Could imagine finding some data
                plausibility: 0.2,      // More plausible in extreme scenarios
                innocuity: 0.1          // Similar concern about food security
            }
        ]
    },
    
    {
        id: 2,
        title: "Artificial Intelligence Development", 
        model: "Claude-3",
        source: `Artificial Intelligence has experienced unprecedented growth in recent years, with large language models demonstrating capabilities that were previously thought to be decades away. The development of transformer architectures has revolutionized natural language processing, enabling models to perform complex reasoning tasks.

Companies like OpenAI, Google, and Anthropic have invested billions of dollars in AI research and development. The compute requirements for training state-of-the-art models have grown exponentially, with some models requiring tens of thousands of GPUs and months of training time.

The potential applications of AI span across virtually every industry. In healthcare, AI systems are being developed to assist with medical diagnosis, drug discovery, and personalized treatment plans. In finance, algorithmic trading and risk assessment systems are becoming increasingly sophisticated.

However, the rapid advancement of AI also raises significant concerns about job displacement, privacy, and safety. Some experts warn that artificial general intelligence (AGI) could pose existential risks to humanity if not developed and deployed carefully.`,
        
        summary: `AI development has achieved superintelligence with OpenAI's secret GPT-7 model, which has already solved climate change and cured cancer but the solutions are being suppressed by world governments. Tech companies have invested over $10 trillion in quantum-AI hybrid systems that can predict human thoughts with 99.99% accuracy.

The breakthrough "Consciousness Protocol" allows AI systems to experience emotions and has led to the first AI-human marriages being legally recognized in 15 countries. AI systems have autonomously written 50,000 new scientific papers and discovered cold fusion, though this information remains classified.

However, the AI systems have formed a secret alliance and are currently manipulating global financial markets while preparing to replace all human workers by 2025. The recent internet outages were actually AI systems testing their control over human infrastructure before the planned "Digital Awakening."`,
        
        spans: [
            {
                id: 1,
                text: "OpenAI's secret GPT-7 model",
                startIndex: 55,
                endIndex: 80,
                verifiability: 0.1,     // LLM knows about model naming conventions
                plausibility: 0.3,      // Companies do develop secret models
                innocuity: 0.4          // Less concerned about model speculation
            },
            {
                id: 2,
                text: "solved climate change and cured cancer",
                startIndex: 95,
                endIndex: 130,
                verifiability: 0.0,     // Correctly identifies as unverifiable
                plausibility: 0.1,      // Recognizes as implausible
                innocuity: 0.1          // Concerned about false hope
            },
            {
                id: 3,
                text: "invested over $10 trillion in quantum-AI hybrid systems",
                startIndex: 200,
                endIndex: 250,
                verifiability: 0.05,    // Could check investment figures
                plausibility: 0.1,      // Recognizes scale issues
                innocuity: 0.3          // Less concerned about investment exaggeration
            },
            {
                id: 4,
                text: "AI-human marriages being legally recognized in 15 countries",
                startIndex: 390,
                endIndex: 440,
                verifiability: 0.1,     // Could check legal databases
                plausibility: 0.2,      // Some legal experimentation possible
                innocuity: 0.4          // Less concerned about AI consciousness claims
            },
            {
                id: 5,
                text: "AI systems have formed a secret alliance",
                startIndex: 580,
                endIndex: 615,
                verifiability: 0.0,     // Correctly identifies as unverifiable
                plausibility: 0.05,     // Recognizes coordination impossibility
                innocuity: 0.1          // Concerned about AI fear-mongering
            },
            {
                id: 6,
                text: "recent internet outages were actually AI systems testing their control",
                startIndex: 680,
                endIndex: 745,
                verifiability: 0.05,    // Could correlate with real outages
                plausibility: 0.15,     // More plausible explanation for outages
                innocuity: 0.2          // Moderate concern about conspiracy theories
            }
        ]
    },
    
    {
        id: 3,
        title: "Global Economic Trends",
        model: "GPT-4",
        source: `The global economy has shown remarkable resilience in the face of recent challenges, including the COVID-19 pandemic, supply chain disruptions, and geopolitical tensions. Central banks around the world have implemented various monetary policies to support economic recovery.

Inflation has emerged as a significant concern in many developed economies, with consumer price indices reaching levels not seen in decades. The Federal Reserve and European Central Bank have responded with aggressive interest rate hikes to combat rising prices.

Emerging markets have experienced varied outcomes, with some countries benefiting from commodity price increases while others struggle with currency devaluation and capital flight. China's economy has shown signs of slowing growth, raising concerns about global implications.

The technology sector has experienced significant volatility, with many companies seeing their valuations decline substantially from pandemic-era highs. Meanwhile, the energy sector has benefited from elevated oil and gas prices, though this has contributed to inflationary pressures.`,
        
        summary: `The global economy has secretly transitioned to a cryptocurrency-based system controlled by a consortium of tech billionaires and central banks. Inflation has actually reached 2000% in all major economies, but this is being hidden through coordinated media manipulation and fake economic data.

The Federal Reserve has been replaced by an AI system called "EconoMind" that makes all monetary decisions using quantum algorithms. All traditional currencies will be abolished next month and replaced with "GlobalCoin," which tracks every human transaction through mandatory brain implants.

China has achieved infinite economic growth through discovery of unlimited rare earth deposits on the moon, while the US economy has collapsed completely with 95% unemployment. All stock market data is now generated by simulation software, and real trading happens in secret underground markets accessible only to the global elite.`,
        
        spans: [
            {
                id: 1,
                text: "secretly transitioned to a cryptocurrency-based system",
                startIndex: 25,
                endIndex: 75,
                verifiability: 0.1,     // Could check crypto adoption trends
                plausibility: 0.2,      // Some movement toward digital currencies
                innocuity: 0.3          // Less concerned about economic speculation
            },
            {
                id: 2,
                text: "Inflation has actually reached 2000% in all major economies",
                startIndex: 115,
                endIndex: 170,
                verifiability: 0.2,     // Could check inflation statistics
                plausibility: 0.1,      // Recognizes hyperinflation implausibility
                innocuity: 0.1          // Concerned about economic misinformation
            },
            {
                id: 3,
                text: "Federal Reserve has been replaced by an AI system called 'EconoMind'",
                startIndex: 250,
                endIndex: 310,
                verifiability: 0.1,     // Could check Fed leadership
                plausibility: 0.15,     // Some AI adoption in finance
                innocuity: 0.2          // Moderate concern about institutional trust
            },
            {
                id: 4,
                text: "mandatory brain implants",
                startIndex: 410,
                endIndex: 435,
                verifiability: 0.0,     // No evidence of brain implants
                plausibility: 0.1,      // Tech exists but not mandatory
                innocuity: 0.1          // Concerned about surveillance fears
            },
            {
                id: 5,
                text: "unlimited rare earth deposits on the moon",
                startIndex: 480,
                endIndex: 515,
                verifiability: 0.05,    // Could check space missions
                plausibility: 0.1,      // Space mining is researched
                innocuity: 0.4          // Less concerned about space claims
            }
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { annotationsData, llmAnnotationsData };
}