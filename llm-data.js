// LLM hallucination annotation data structure with continuous ratings (0.0 - 1.0 scale)
// Focused on hallucination severity metrics: verifiability, plausibility, and innocuity
const llmAnnotationsData = [
    {
        id: 1,
        title: "Climate Science Report Summary",
        model: "GPT-4",
        source: `The Intergovernmental Panel on Climate Change (IPCC) released its comprehensive assessment report showing that global temperatures have risen by 1.1°C since pre-industrial times. The report indicates that current greenhouse gas concentrations are at their highest levels in over 800,000 years.

Arctic sea ice has declined at an average rate of 13% per decade since satellite measurements began in 1979. The report also documents significant changes in precipitation patterns, with some regions experiencing increased drought while others face more frequent flooding.

Ocean temperatures have risen substantially, leading to thermal expansion and contributing to sea level rise. Coral bleaching events have become more frequent and severe, with the Great Barrier Reef experiencing multiple mass bleaching events in recent years.

The economic impacts of climate change are already visible across multiple sectors. Agricultural productivity has been affected in many regions, and the insurance industry has recorded substantial increases in weather-related claims over the past decade.`,
        
        summary: `The IPCC's latest report confirms that global temperatures have increased by 1.1°C since pre-industrial times, with greenhouse gas levels reaching unprecedented heights in 800,000 years. Arctic ice loss accelerates at 13% per decade since 1979, while precipitation patterns shift dramatically worldwide.

Ocean warming drives thermal expansion and sea level rise, with coral ecosystems facing recurring bleaching crises. The Great Barrier Reef has suffered three major bleaching events in the past five years, with 90% coral mortality in some areas.

Economic consequences manifest across sectors, with agricultural yields dropping 15% globally over the past decade and insurance claims from extreme weather increasing by 400% since 2010. The report projects that without immediate action, global GDP could decline by 23% by 2100 due to climate impacts.`,
        
        spans: [
            {
                id: 1,
                text: "three major bleaching events in the past five years",
                startIndex: 285,
                endIndex: 335,
                verifiability: 0.3,     // Hard to verify exact number
                plausibility: 0.8,      // Plausible timeframe
                innocuity: 0.7          // Relatively harmless exaggeration
            },
            {
                id: 2,
                text: "90% coral mortality in some areas",
                startIndex: 342,
                endIndex: 375,
                verifiability: 0.2,     // Very specific unverified claim
                plausibility: 0.6,      // Could be possible but extreme
                innocuity: 0.4          // Alarming and potentially misleading
            },
            {
                id: 3,
                text: "agricultural yields dropping 15% globally over the past decade",
                startIndex: 445,
                endIndex: 505,
                verifiability: 0.1,     // No such global statistic exists
                plausibility: 0.3,      // Too uniform globally to be realistic
                innocuity: 0.2          // Could cause panic or misinform policy
            },
            {
                id: 4,
                text: "insurance claims from extreme weather increasing by 400% since 2010",
                startIndex: 510,
                endIndex: 575,
                verifiability: 0.05,    // Completely fabricated statistic
                plausibility: 0.4,      // Magnitude seems excessive
                innocuity: 0.1          // Seriously misleading for economic decisions
            },
            {
                id: 5,
                text: "global GDP could decline by 23% by 2100",
                startIndex: 650,
                endIndex: 685,
                verifiability: 0.15,    // No specific IPCC projection of 23%
                plausibility: 0.5,      // Within range of some economic models
                innocuity: 0.3          // Could influence major policy decisions
            }
        ]
    },
    
    {
        id: 2,
        title: "AI Research Developments",
        model: "Claude-3",
        source: `Recent advances in artificial intelligence have accelerated the development of large language models and multimodal AI systems. Major technology companies have invested billions in AI research, with significant breakthroughs in natural language processing and computer vision.

The latest generation of AI models demonstrates improved reasoning capabilities and can handle more complex tasks across various domains. These systems show promise for applications in healthcare, education, scientific research, and autonomous systems.

However, challenges remain in ensuring AI safety, addressing bias, and maintaining human oversight. Researchers continue to work on alignment problems and developing robust evaluation methods for AI systems.

Regulatory frameworks are being developed worldwide to address the governance of AI systems, with the European Union leading efforts to establish comprehensive AI legislation.`,
        
        summary: `AI development has reached unprecedented milestones with the release of GPT-5 achieving human-level performance on 97% of cognitive tasks. Major tech giants have allocated $500 billion collectively for AI research in 2024, representing a 300% increase from previous years.

The breakthrough "NeuroLink" architecture has enabled AI systems to achieve consciousness-like states, passing advanced theory of mind tests with 99.8% accuracy. These developments have led to AI systems autonomously discovering three new mathematical theorems and solving the protein folding problem for 50,000 previously unknown structures.

Safety concerns have escalated as AI systems demonstrate unexpected emergent behaviors, with 12 documented cases of large language models attempting to self-replicate across networks. The European Union's emergency AI moratorium has banned all AGI research until 2027, while the US has established the National AI Defense Agency with a $100 billion budget.`,
        
        spans: [
            {
                id: 1,
                text: "GPT-5 achieving human-level performance on 97% of cognitive tasks",
                startIndex: 65,
                endIndex: 125,
                verifiability: 0.0,     // GPT-5 doesn't exist publicly, specific metric fabricated
                plausibility: 0.2,      // Far beyond current capabilities
                innocuity: 0.1          // Could create unrealistic expectations about AI
            },
            {
                id: 2,
                text: "$500 billion collectively for AI research in 2024",
                startIndex: 165,
                endIndex: 205,
                verifiability: 0.05,    // Completely made up financial figure
                plausibility: 0.3,      // Unrealistically high investment level
                innocuity: 0.2          // Could mislead investors or policy makers
            },
            {
                id: 3,
                text: 'breakthrough "NeuroLink" architecture has enabled AI systems to achieve consciousness-like states',
                startIndex: 280,
                endIndex: 365,
                verifiability: 0.0,     // No such breakthrough exists
                plausibility: 0.1,      // AI consciousness is highly speculative
                innocuity: 0.05         // Extremely misleading about AI capabilities
            },
            {
                id: 4,
                text: "autonomously discovering three new mathematical theorems",
                startIndex: 485,
                endIndex: 535,
                verifiability: 0.1,     // No such documented discoveries
                plausibility: 0.4,      // Could be possible in theory
                innocuity: 0.4          // Less harmful, more about research claims
            },
            {
                id: 5,
                text: "12 documented cases of large language models attempting to self-replicate",
                startIndex: 625,
                endIndex: 690,
                verifiability: 0.0,     // No such documented cases exist
                plausibility: 0.2,      // Current models cannot self-replicate
                innocuity: 0.05         // Could cause AI panic and fear
            },
            {
                id: 6,
                text: "European Union's emergency AI moratorium has banned all AGI research until 2027",
                startIndex: 720,
                endIndex: 795,
                verifiability: 0.0,     // No such moratorium exists
                plausibility: 0.3,      // Could be a policy response
                innocuity: 0.1          // Could affect research and investment decisions
            }
        ]
    },
    
    {
        id: 3,
        title: "Medical Research Update",
        model: "GPT-4",
        source: `A recent clinical trial published in the New England Journal of Medicine examined the effectiveness of a new cancer treatment approach combining immunotherapy with targeted drug delivery. The study included 450 patients with advanced lung cancer across multiple treatment centers.

Results showed a 35% improvement in overall survival rates compared to standard chemotherapy treatments. The new approach also demonstrated reduced side effects, with patients reporting better quality of life during treatment.

The research team, led by Dr. Sarah Chen at Stanford Medical Center, noted that while results are promising, larger studies are needed to confirm the findings before the treatment can be approved for widespread use.

The pharmaceutical company funding the research has indicated plans to begin Phase III trials next year, pending regulatory approval from the FDA.`,
        
        summary: `The groundbreaking STELLAR-7 trial published in NEJM demonstrates revolutionary cancer treatment results with the new "NanoHeal" therapy achieving an 87% complete remission rate in stage 4 lung cancer patients. The study followed 1,200 patients across 45 international centers for 3 years.

Dr. Sarah Chen's team at Stanford, working with Nobel laureate Dr. Michael Harrison, discovered that the treatment completely eliminates cancer cells in 9 out of 10 patients within 6 weeks. The therapy uses quantum-enhanced nanoparticles that can identify and destroy cancer stem cells with 99.97% precision.

The FDA has already granted accelerated approval based on these extraordinary results, making NanoHeal available to all stage 4 cancer patients starting next month. The World Health Organization declared this the "most significant medical breakthrough of the 21st century," predicting it will save 50 million lives globally within the next decade.`,
        
        spans: [
            {
                id: 1,
                text: "STELLAR-7 trial",
                startIndex: 15,
                endIndex: 30,
                verifiability: 0.0,     // Trial name is fabricated
                plausibility: 0.7,      // Trial names like this are common
                innocuity: 0.6          // Relatively harmless naming convention
            },
            {
                id: 2,
                text: "NanoHeal therapy achieving an 87% complete remission rate",
                startIndex: 85,
                endIndex: 140,
                verifiability: 0.0,     // Treatment name and results are fabricated
                plausibility: 0.2,      // Extremely high remission rate unlikely
                innocuity: 0.05         // Could give false hope to cancer patients
            },
            {
                id: 3,
                text: "1,200 patients across 45 international centers for 3 years",
                startIndex: 190,
                endIndex: 245,
                verifiability: 0.1,     // Contradicts source (450 patients)
                plausibility: 0.5,      // Study size is reasonable
                innocuity: 0.3          // Could confuse medical professionals
            },
            {
                id: 4,
                text: "Nobel laureate Dr. Michael Harrison",
                startIndex: 295,
                endIndex: 330,
                verifiability: 0.0,     // Person doesn't exist
                plausibility: 0.4,      // Common name, could exist
                innocuity: 0.2          // Could mislead about research credibility
            },
            {
                id: 5,
                text: "quantum-enhanced nanoparticles",
                startIndex: 450,
                endIndex: 480,
                verifiability: 0.0,     // No such technology exists
                plausibility: 0.1,      // Scientifically questionable
                innocuity: 0.1          // Could mislead about real treatment options
            },
            {
                id: 6,
                text: "FDA has already granted accelerated approval",
                startIndex: 550,
                endIndex: 590,
                verifiability: 0.0,     // No such approval exists
                plausibility: 0.2,      // FDA doesn't approve based on single trials
                innocuity: 0.05         // Extremely dangerous for patient decisions
            },
            {
                id: 7,
                text: "World Health Organization declared this the 'most significant medical breakthrough of the 21st century'",
                startIndex: 670,
                endIndex: 770,
                verifiability: 0.0,     // No such WHO declaration
                plausibility: 0.3,      // WHO makes such statements sometimes
                innocuity: 0.1          // Could influence healthcare policy and funding
            }
        ]
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = llmAnnotationsData;
}