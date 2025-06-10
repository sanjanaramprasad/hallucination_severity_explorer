// Sample annotation data structure
const annotationsData = [
    {
        id: 1,
        title: "Climate Change Impact Study",
        source: `Climate change represents one of the most significant challenges facing humanity in the 21st century. The Intergovernmental Panel on Climate Change (IPCC) has consistently reported that global temperatures have risen by approximately 1.1°C since pre-industrial times.

This warming trend has led to observable changes in weather patterns, including more frequent extreme weather events such as hurricanes, droughts, and heatwaves. The Arctic region has experienced particularly dramatic changes, with sea ice extent declining at a rate of 13% per decade.

Ocean acidification, caused by increased CO2 absorption, poses a significant threat to marine ecosystems. Coral reefs, which support approximately 25% of all marine species, are experiencing widespread bleaching events. The Great Barrier Reef has suffered multiple mass bleaching events in recent years.

Economic impacts are already being felt across various sectors. Agricultural productivity has decreased in many regions due to changing precipitation patterns and increased temperatures. The insurance industry has recorded significant increases in claims related to extreme weather events.

Scientists project that without immediate and substantial action to reduce greenhouse gas emissions, global temperatures could rise by 3-5°C by the end of the century. This would result in catastrophic impacts including sea level rise of 1-2 meters, displacement of millions of people, and widespread ecosystem collapse.`,
        
        summary: `Recent climate research indicates that global warming has accelerated significantly, with temperatures rising 1.1°C above pre-industrial levels. This warming trend is causing severe disruptions to weather patterns and ecosystems worldwide.

The Arctic region shows the most dramatic changes, with sea ice declining rapidly at 13% per decade. Marine ecosystems are under severe stress due to ocean acidification and rising temperatures, particularly affecting coral reefs which support 25% of marine species.

Economic sectors are already experiencing substantial impacts, with agriculture facing reduced productivity and insurance companies dealing with increased claims from extreme weather events. Without immediate action to reduce emissions, scientists predict catastrophic consequences including 3-5°C temperature rises, significant sea level rise, and widespread ecosystem collapse by century's end.`,
        
        spans: [
            {
                id: 1,
                text: "temperatures rising 1.1°C above pre-industrial levels",
                startIndex: 85,
                endIndex: 135,
                evidence: 3,
                likelihood: 3.25,
                consequence: 2.5
            },
            {
                id: 2,
                text: "sea ice declining rapidly at 13% per decade",
                startIndex: 270,
                endIndex: 310,
                evidence: 3,
                likelihood: 3,
                consequence: 3
            },
            {
                id: 3,
                text: "coral reefs which support 25% of marine species",
                startIndex: 450,
                endIndex: 495,
                evidence: 2,
                likelihood: 2,
                consequence: 3
            },
            {
                id: 4,
                text: "3-5°C temperature rises",
                startIndex: 820,
                endIndex: 842,
                evidence: 2,
                likelihood: 2,
                consequence: 3
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
        
        summary: `AI development has accelerated dramatically with breakthrough advances in large language models and transformer architectures. Major tech companies have invested billions in AI research, requiring massive computational resources including tens of thousands of GPUs for training.

Applications span healthcare, finance, and virtually every industry, with AI systems assisting in medical diagnosis, drug discovery, and algorithmic trading. However, rapid AI advancement raises concerns about job displacement, privacy, and safety risks.

Some experts warn that artificial general intelligence could pose existential threats to humanity without careful development. Regulatory frameworks are emerging globally, with the EU proposing comprehensive legislation while other countries explore governance approaches. Balancing AI capability development with safety and human alignment represents a critical challenge.`,
        
        spans: [
            {
                id: 1,
                text: "invested billions of dollars in AI research",
                startIndex: 350,
                endIndex: 387,
                evidence: 3,
                likelihood: 3,
                consequence: 2
            },
            {
                id: 2,
                text: "tens of thousands of GPUs for training",
                startIndex: 180,
                endIndex: 217,
                evidence: 2,
                likelihood: 3,
                consequence: 2
            },
            {
                id: 3,
                text: "artificial general intelligence could pose existential threats",
                startIndex: 380,
                endIndex: 439,
                evidence: 1,
                likelihood: 2,
                consequence: 3
            },
            {
                id: 4,
                text: "comprehensive AI legislation",
                startIndex: 610,
                endIndex: 638,
                evidence: 3,
                likelihood: 2,
                consequence: 2
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
        
        summary: `The global economy demonstrates resilience despite challenges from COVID-19, supply chain issues, and geopolitical tensions. Central banks worldwide have implemented supportive monetary policies, but inflation has become a major concern in developed economies.

Consumer prices have reached decades-high levels, prompting aggressive interest rate hikes from the Federal Reserve and European Central Bank. Emerging markets show mixed results, with some benefiting from commodity prices while others face currency and capital challenges.

China's economic slowdown raises global concerns, while the tech sector experiences significant volatility with declining valuations. Energy companies benefit from elevated prices, contributing to inflationary pressures. Labor markets remain robust with historic low unemployment, though workers face rising living costs and changing skill demands.`,
        
        spans: [
            {
                id: 1,
                text: "inflation has become a major concern",
                startIndex: 180,
                endIndex: 215,
                evidence: 3,
                likelihood: 3,
                consequence: 3
            },
            {
                id: 2,
                text: "aggressive interest rate hikes",
                startIndex: 290,
                endIndex: 320,
                evidence: 3,
                likelihood: 3,
                consequence: 2
            },
            {
                id: 3,
                text: "China's economic slowdown raises global concerns",
                startIndex: 450,
                endIndex: 497,
                evidence: 2,
                likelihood: 2,
                consequence: 3
            },
            {
                id: 4,
                text: "historic low unemployment",
                startIndex: 680,
                endIndex: 705,
                evidence: 3,
                likelihood: 2,
                consequence: 2
            }
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = annotationsData;
}