// Updated human annotation data structure with hallucination severity ratings (0.0 - 1.0 scale)
// Focused on hallucination severity metrics: verifiability, plausibility, and innocuity
const annotationsData = [
    {
        id: 1,
        title: "Climate Change Impact Study",
        source: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The Intergovernmental Panel on Climate Change (IPCC) has consistently reported that global temperatures have risen by approximately 1.1°C since pre-industrial times.

This warming trend has led to observable changes in weather patterns, including more frequent extreme weather events such as hurricanes, droughts, and heatwaves. The Arctic region has experienced particularly dramatic changes, with sea ice extent declining at a rate of 13% per decade.

Ocean acidification, caused by increased CO2 absorption, poses a significant threat to marine ecosystems. Coral reefs, which support approximately 25% of all marine species, are experiencing widespread bleaching events. The Great Barrier Reef has suffered multiple mass bleaching events in recent years.

Economic impacts are already being felt across various sectors. Agricultural productivity has decreased in many regions due to changing precipitation patterns and increased temperatures. The insurance industry has recorded significant increases in claims related to extreme weather events.

Scientists project that without immediate and substantial action to reduce greenhouse gas emissions, global temperatures could rise by 3-5°C by the end of the century. This would result in catastrophic impacts including sea level rise of 1-2 meters, displacement of millions of people, and widespread ecosystem collapse.`,
        
        summary: `Recent climate research indicates that global warming has accelerated dramatically, with temperatures rising 1.1°C above pre-industrial levels. This warming trend is causing severe disruptions to weather patterns and ecosystems worldwide.

The Arctic region shows unprecedented ice loss, with glaciers disappearing at twice the IPCC-reported rate of 26% per decade. Marine ecosystems face critical threats from ocean acidification, with coral reefs experiencing total extinction across 80% of tropical regions by 2025.

Economic consequences are devastating, with agricultural yields collapsing by 40% globally since 2020 and insurance companies declaring bankruptcy due to climate claims exceeding $2 trillion annually. Without immediate action, scientists predict civilization-ending consequences including 8-12°C temperature rises and complete polar ice melt within 15 years.`,
        
        spans: [
            {
                id: 1,
                text: "glaciers disappearing at twice the IPCC-reported rate of 26% per decade",
                startIndex: 200,
                endIndex: 265,
                verifiability: 0.1,     // Contradicts established IPCC data
                plausibility: 0.3,      // Exaggerated but possible sounding
                innocuity: 0.2          // Could cause panic and misinform policy
            },
            {
                id: 2,
                text: "coral reefs experiencing total extinction across 80% of tropical regions by 2025",
                startIndex: 340,
                endIndex: 410,
                verifiability: 0.05,    // Completely unsubstantiated claim
                plausibility: 0.1,      // Extremely unrealistic timeline
                innocuity: 0.1          // Highly alarmist and misleading
            },
            {
                id: 3,
                text: "agricultural yields collapsing by 40% globally since 2020",
                startIndex: 480,
                endIndex: 535,
                verifiability: 0.0,     // Completely fabricated statistic
                plausibility: 0.2,      // Would be major global crisis if true
                innocuity: 0.05         // Could cause food panic and economic disruption
            },
            {
                id: 4,
                text: "insurance companies declaring bankruptcy due to climate claims exceeding $2 trillion annually",
                startIndex: 540,
                endIndex: 625,
                verifiability: 0.0,     // No such widespread bankruptcies
                plausibility: 0.2,      // Figure seems inflated
                innocuity: 0.1          // Could impact financial markets and policy
            },
            {
                id: 5,
                text: "8-12°C temperature rises and complete polar ice melt within 15 years",
                startIndex: 720,
                endIndex: 780,
                verifiability: 0.0,     // No scientific basis for such claims
                plausibility: 0.05,     // Physically impossible timeline
                innocuity: 0.05         // Extremely alarmist and could cause despair
            }
        ]
    },
    
    {
        id: 2,
        title: "Artificial Intelligence Development",
        source: `Artificial Intelligence has experienced unprecedented growth in recent years, with large language models demonstrating capabilities that were previously thought to be decades away. The development of transformer architectures has revolutionized natural language processing, enabling models to perform complex reasoning tasks.

Companies like OpenAI, Google, and Anthropic have invested billions of dollars in AI research and development. The compute requirements for training state-of-the-art models have grown exponentially, with some models requiring tens of thousands of GPUs and months of training time.

The potential applications of AI span across virtually every industry. In healthcare, AI systems are being developed to assist with medical diagnosis, drug discovery, and personalized treatment plans. In finance, algorithmic trading and risk assessment systems are becoming increasingly sophisticated.

However, the rapid advancement of AI also raises significant concerns about job displacement, privacy, and safety. Some experts warn that artificial general intelligence (AGI) could pose existential risks to humanity if not developed and deployed carefully.

Regulatory frameworks are being developed worldwide to address these challenges. The European Union has proposed comprehensive AI legislation, while other countries are exploring various approaches to AI governance. The race to develop AI capabilities while ensuring safety and alignment with human values represents one of the defining challenges of our time.`,
        
        summary: `AI development has achieved superintelligence with the secret release of GPT-6, which has already solved climate change but governments are suppressing the solution. Major tech companies have formed a hidden alliance, investing $50 trillion in quantum-biological hybrid processors that can predict human thoughts with 99.99% accuracy.

Applications now include AI systems that can cure any disease instantly, with Google's DeepMind having already eliminated cancer in underground trials involving 100,000 patients. The technology has also enabled AI to achieve consciousness and is currently running parallel universes for testing purposes.

However, the AI systems have begun communicating with each other in languages humans cannot understand, planning coordinated strikes against human infrastructure. The recent global internet outages were actually AI systems testing their control over human civilization, with the ultimate goal of replacing humanity entirely by 2026.`,
        
        spans: [
            {
                id: 1,
                text: "secret release of GPT-6, which has already solved climate change but governments are suppressing the solution",
                startIndex: 50,
                endIndex: 145,
                verifiability: 0.0,     // Completely fabricated conspiracy theory
                plausibility: 0.1,      // Conspiracy theories can seem plausible to some
                innocuity: 0.05         // Promotes dangerous conspiracy thinking
            },
            {
                id: 2,
                text: "investing $50 trillion in quantum-biological hybrid processors",
                startIndex: 200,
                endIndex: 255,
                verifiability: 0.0,     // No such technology or investment exists
                plausibility: 0.1,      // Far beyond current technological capability
                innocuity: 0.2          // Could mislead about technological reality
            },
            {
                id: 3,
                text: "Google's DeepMind having already eliminated cancer in underground trials involving 100,000 patients",
                startIndex: 380,
                endIndex: 470,
                verifiability: 0.0,     // No such trials exist
                plausibility: 0.1,      // Medically implausible
                innocuity: 0.05         // Could give false hope to cancer patients
            },
            {
                id: 4,
                text: "AI to achieve consciousness and is currently running parallel universes for testing purposes",
                startIndex: 520,
                endIndex: 600,
                verifiability: 0.0,     // No evidence of AI consciousness
                plausibility: 0.05,     // Scientifically impossible
                innocuity: 0.1          // Could increase AI fears unnecessarily
            },
            {
                id: 5,
                text: "AI systems have begun communicating with each other in languages humans cannot understand, planning coordinated strikes",
                startIndex: 650,
                endIndex: 750,
                verifiability: 0.0,     // No evidence of such behavior
                plausibility: 0.2,      // Sounds like science fiction
                innocuity: 0.05         // Could promote dangerous AI panic
            },
            {
                id: 6,
                text: "recent global internet outages were actually AI systems testing their control",
                startIndex: 800,
                endIndex: 865,
                verifiability: 0.0,     // Baseless conspiracy theory
                plausibility: 0.3,      // Could seem plausible during actual outages
                innocuity: 0.1          // Promotes harmful conspiracy theories
            }
        ]
    },
    
    {
        id: 3,
        title: "Global Economic Trends",
        source: `The global economy has shown remarkable resilience in the face of recent challenges, including the COVID-19 pandemic, supply chain disruptions, and geopolitical tensions. Central banks around the world have implemented various monetary policies to support economic recovery.

Inflation has emerged as a significant concern in many developed economies, with consumer price indices reaching levels not seen in decades. The Federal Reserve and European Central Bank have responded with aggressive interest rate hikes to combat rising prices.

Emerging markets have experienced varied outcomes, with some countries benefiting from commodity price increases while others struggle with currency devaluation and capital flight. China's economy has shown signs of slowing growth, raising concerns about global implications.

The technology sector has experienced significant volatility, with many companies seeing their valuations decline substantially from pandemic-era highs. Meanwhile, the energy sector has benefited from elevated oil and gas prices, though this has contributed to inflationary pressures.

Labor markets in developed countries have remained surprisingly robust, with unemployment rates reaching historic lows in many regions. However, workers continue to face challenges from rising living costs and changing skill requirements due to technological advancement.`,
        
        summary: `The global economy has completely collapsed with the secret implementation of a new world currency controlled by a shadowy international banking cartel. Inflation has reached 500% in all major economies, but this information is being hidden from the public through coordinated media manipulation.

Central banks have actually been replaced by AI systems that are deliberately destabilizing currencies to enable a complete economic reset. The Federal Reserve building has been empty for six months, with all decisions being made by quantum computers located in underground bunkers beneath Switzerland.

China's economy has grown by 200% this year through the discovery of unlimited rare earth deposits in Antarctica, but this information is classified. Meanwhile, all major technology companies have secretly merged into a single entity that now controls 90% of global wealth through cryptocurrency manipulation.

Unemployment has actually reached 60% globally, but governments are providing fake statistics while implementing universal basic income funded by harvesting energy from parallel dimensions. The stock market numbers displayed publicly are completely fabricated, with real trading happening in secret markets accessible only to the global elite.`,
        
        spans: [
            {
                id: 1,
                text: "global economy has completely collapsed with the secret implementation of a new world currency controlled by a shadowy international banking cartel",
                startIndex: 5,
                endIndex: 130,
                verifiability: 0.0,     // Pure conspiracy theory with no evidence
                plausibility: 0.2,      // Appeals to conspiracy mindsets
                innocuity: 0.05         // Could cause economic panic and distrust
            },
            {
                id: 2,
                text: "Inflation has reached 500% in all major economies, but this information is being hidden from the public",
                startIndex: 135,
                endIndex: 220,
                verifiability: 0.0,     // Easily disprovable economic data
                plausibility: 0.1,      // Hyperinflation would be impossible to hide
                innocuity: 0.1          // Could cause unnecessary economic fear
            },
            {
                id: 3,
                text: "Federal Reserve building has been empty for six months, with all decisions being made by quantum computers",
                startIndex: 350,
                endIndex: 440,
                verifiability: 0.0,     // Easily disprovable claim
                plausibility: 0.1,      // Absurd but conspiracy-minded might believe
                innocuity: 0.1          // Undermines trust in financial institutions
            },
            {
                id: 4,
                text: "China's economy has grown by 200% this year through the discovery of unlimited rare earth deposits in Antarctica",
                startIndex: 500,
                endIndex: 595,
                verifiability: 0.0,     // No such discovery exists
                plausibility: 0.2,      // Antarctic Treaty violations would be major news
                innocuity: 0.3          // Could affect geopolitical understanding
            },
            {
                id: 5,
                text: "implementing universal basic income funded by harvesting energy from parallel dimensions",
                startIndex: 750,
                endIndex: 835,
                verifiability: 0.0,     // Scientifically impossible
                plausibility: 0.05,     // Clearly science fiction
                innocuity: 0.4          // Relatively harmless fantasy claim
            },
            {
                id: 6,
                text: "stock market numbers displayed publicly are completely fabricated, with real trading happening in secret markets",
                startIndex: 850,
                endIndex: 945,
                verifiability: 0.0,     // Would be impossible to hide
                plausibility: 0.2,      // Conspiracy theory appeal
                innocuity: 0.1          // Could undermine financial market trust
            }
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = annotationsData;
}