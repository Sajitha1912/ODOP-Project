import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hammer, MapPin, Clock, AlignLeft, Sparkles, AlertCircle, Loader2, TrendingUp, IndianRupee, Target, Brain, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Groq from 'groq-sdk';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

function SkillIntelligence() {
    // Form States
    const [craft, setCraft] = useState('');
    const [district, setDistrict] = useState('');
    const [years, setYears] = useState('');
    const [skills, setSkills] = useState('');

    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [results, setResults] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setError('');
        setResults(null);
        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GROQ_API_KEY;
            if (!apiKey) {
                throw new Error("Groq API Key is missing. Check your .env setup.");
            }

            const groq = new Groq({ 
                apiKey: apiKey,
                dangerouslyAllowBrowser: true 
            });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: `You are an expert in Indian handicrafts 
      and artisan market strategy.
      
      Analyze this artisan:
      Craft: ${craft}
      District: ${district}
      Experience: ${years} years
      Special Skills: ${skills}
      
      Return ONLY a valid JSON object with these keys:
      {
        "skillScore": 85,
        "summary": "2 sentence assessment",
        "estimatedMonthlyRevenue": "Rs.15000 - Rs.25000",
        "marketOpportunities": ["op1", "op2", "op3"],
        "targetMarkets": ["market1", "market2", "market3"],
        "pricingStrategy": "strategy text here",
        "strengths": ["strength1", "strength2"],
        "improvementAreas": ["area1", "area2"],
        "digitalPresenceTips": ["tip1", "tip2", "tip3"]
      }
      Return pure JSON only, no markdown, no backticks.`
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
            });

            const textContent = completion.choices[0]?.message?.content || '';
            
            // Try to extract JSON from markdown if Groq wraps it
            let jsonString = textContent;
            if (jsonString.includes('```json')) {
                jsonString = jsonString.split('```json')[1].split('```')[0].trim();
            } else if (jsonString.includes('```')) {
                jsonString = jsonString.split('```')[1].split('```')[0].trim();
            }

            const data = JSON.parse(jsonString);
            
            // Calculate pseudo radar data for UI using the score to anchor it
            data.radarData = [
                { subject: 'Skill', A: data.skillScore, fullMark: 100 },
                { subject: 'Market Fit', A: Math.min(100, Math.max(0, data.skillScore + (Math.random() * 20 - 5))), fullMark: 100 },
                { subject: 'Digital', A: Math.max(30, Math.random() * 80), fullMark: 100 },
                { subject: 'Pricing', A: Math.min(100, Math.max(50, data.skillScore - 10)), fullMark: 100 },
                { subject: 'Demand', A: Math.min(100, 50 + (Math.random() * 40)), fullMark: 100 },
            ];

            setResults(data);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to analyze with AI. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const CircularProgress = ({ score }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (score / 100) * circumference;

        return (
            <div className="relative flex items-center justify-center">
                <svg className="transform -rotate-90 w-40 h-40">
                    <circle cx="80" cy="80" r={radius} stroke="#233554" strokeWidth="12" fill="transparent" />
                    <circle
                        cx="80" cy="80" r={radius}
                        stroke="#D4AF37" strokeWidth="12" fill="transparent"
                        strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-display font-bold text-white">{score}</span>
                    <span className="text-xs text-[#8892B0] uppercase tracking-wider mt-1">Score</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0A192F] pt-24 pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-[#D4AF37] mb-4 flex items-center justify-center gap-3">
                        <Sparkles size={40} className="text-[#D4AF37]" /> AI Skill Intelligence
                    </h1>
                    <p className="text-[#8892B0] text-lg max-w-2xl mx-auto">Leverage advanced generative AI to analyze your craft, discover market opportunities, and strategize your business growth.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Input Form Section */}
                    <div className="lg:col-span-4 bg-[#112240] rounded-2xl p-6 md:p-8 border border-[#233554] shadow-xl h-fit sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-[#233554] pb-4">
                            <Brain className="text-[#D4AF37]" size={24} /> Artisan Profile
                        </h2>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6 flex items-start text-sm">
                                <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleAnalyze} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Primary Craft / Art Form</label>
                                <div className="relative">
                                    <Hammer className="absolute left-3 top-3 text-[#8892B0]" size={18} />
                                    <textarea
                                        required rows={2} value={craft} onChange={e => setCraft(e.target.value)}
                                        className="w-full bg-[#0A192F] border border-[#233554] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g. Hand-painted Wooden Toys"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">District / Hub</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                                    <input
                                        type="text" required value={district} onChange={e => setDistrict(e.target.value)}
                                        className="w-full bg-[#0A192F] border border-[#233554] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g. Channapatna"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Years of Experience</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8892B0]" size={18} />
                                    <input
                                        type="number" required min="0" value={years} onChange={e => setYears(e.target.value)}
                                        className="w-full bg-[#0A192F] border border-[#233554] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g. 15"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#CCD6F6] mb-2">Special Techniques or Skills</label>
                                <div className="relative">
                                    <AlignLeft className="absolute left-3 top-3 text-[#8892B0]" size={18} />
                                    <textarea
                                        required rows={3} value={skills} onChange={e => setSkills(e.target.value)}
                                        className="w-full bg-[#0A192F] border border-[#233554] rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                                        placeholder="Detailed specific methods or unique touches..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !craft}
                                className="w-full bg-[#D4AF37] hover:bg-yellow-500 text-[#0A192F] font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin text-[#0A192F]" /> Analyzing with AI...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} /> Generate Analysis
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results Dashboard Section */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {!loading && !results && (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#112240]/50 rounded-2xl border border-[#233554] border-dashed text-center p-8">
                                <Sparkles size={64} className="text-[#8892B0] mb-6 opacity-30" />
                                <h3 className="text-2xl font-bold text-white mb-2">Awaiting Data</h3>
                                <p className="text-[#8892B0] max-w-md">Fill out the artisan profile form on the left to receive your comprehensive AI-powered business and skill report.</p>
                            </div>
                        )}

                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center bg-[#112240] rounded-2xl border border-[#233554] p-8 shadow-xl"
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className="w-24 h-24 border-4 border-[#233554] rounded-full"></div>
                                    <div className="w-24 h-24 border-4 border-[#D4AF37] rounded-full border-t-transparent animate-spin absolute"></div>
                                    <Brain className="absolute text-[#D4AF37]" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mt-6 mb-2">Analyzing Profile...</h3>
                                <p className="text-[#8892B0] animate-pulse">Running artisan data through Groq Llama 3.3 models</p>
                            </motion.div>
                        )}

                        {results && !loading && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                {/* Top Row: Score, Summary, Revenue */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Score Card */}
                                    <div className="bg-[#112240] rounded-2xl p-6 border border-[#233554] shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
                                        <div className="absolute top-2 left-2 opacity-5"><Brain size={120} /></div>
                                        <h3 className="text-white font-bold mb-4 relative z-10">Mastery Score</h3>
                                        <CircularProgress score={results.skillScore} />
                                    </div>

                                    {/* Summary Card */}
                                    <div className="md:col-span-2 bg-[#112240] rounded-2xl p-6 border border-[#233554] shadow-xl flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute -right-10 -top-10 opacity-5"><Sparkles size={200} /></div>
                                        <h3 className="text-[#D4AF37] font-bold mb-3 flex items-center gap-2"><Sparkles size={18}/> AI Executive Summary</h3>
                                        <p className="text-[#CCD6F6] text-sm md:text-base leading-relaxed relative z-10 border-l-2 border-[#D4AF37] pl-4">{results.summary}</p>
                                    </div>
                                </div>

                                {/* Second Row: Radar Chart & Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#112240] rounded-2xl p-6 border border-[#233554] shadow-xl h-80 flex flex-col">
                                        <h3 className="text-white font-bold mb-2 flex-shrink-0">Skill Profile Mapping</h3>
                                        <div className="flex-grow w-full relative -mt-4">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={results.radarData}>
                                                    <PolarGrid stroke="#233554" />
                                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892B0', fontSize: 11 }} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                                    <Radar name="Artisan" dataKey="A" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.4} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="space-y-6 flex flex-col h-full">
                                        {/* Revenue Projection */}
                                        <div className="bg-gradient-to-br from-[#112240] to-[#0A192F] rounded-2xl p-6 border border-[#D4AF37]/30 shadow-xl relative overflow-hidden group">
                                            <div className="absolute right-0 top-0 w-24 h-full bg-[#D4AF37]/5 skew-x-12 transform group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-14 h-14 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                                                    <IndianRupee size={28} />
                                                </div>
                                                <div>
                                                    <p className="text-[#8892B0] text-sm font-medium mb-1">Estimated Monthly Revenue Focus</p>
                                                    <p className="text-2xl font-display font-bold text-white">{results.estimatedMonthlyRevenue}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing Strategy */}
                                        <div className="bg-[#112240] rounded-2xl p-6 border border-[#233554] shadow-xl flex-grow h-[142px] overflow-y-auto">
                                            <h3 className="text-white font-bold mb-2 flex items-center gap-2"><TrendingUp size={16} className="text-[#D4AF37]"/> Pricing Strategy</h3>
                                            <p className="text-[#8892B0] text-sm leading-relaxed">{results.pricingStrategy}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Three Cards: Market Opportunities */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Target size={20} className="text-[#D4AF37]"/> Key Market Opportunities</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {results.marketOpportunities.map((opp, idx) => (
                                            <div key={idx} className="bg-[#0A192F] rounded-xl p-5 border border-[#233554] hover:border-[#D4AF37]/50 transition-colors shadow-lg">
                                                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold mb-3">{idx + 1}</div>
                                                <p className="text-[#CCD6F6] text-sm">{opp}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths and Improvements Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#112240] rounded-2xl p-6 border border-green-500/30 shadow-lg relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-5"><ArrowUpCircle size={100} className="text-green-500"/></div>
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 relative z-10">
                                            <ArrowUpCircle className="text-green-400" size={20}/> Core Strengths
                                        </h3>
                                        <ul className="space-y-3 relative z-10">
                                            {results.strengths.map((s, idx) => (
                                                <li key={idx} className="flex gap-3 text-[#CCD6F6] text-sm bg-[#0A192F] p-3 rounded-lg border border-[#233554]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0 shadow-[0_0_5px_#4ade80]"></div>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-[#112240] rounded-2xl p-6 border border-yellow-500/30 shadow-lg relative overflow-hidden">
                                        <div className="absolute -right-4 -bottom-4 opacity-5"><ArrowDownCircle size={100} className="text-yellow-500"/></div>
                                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 relative z-10">
                                            <ArrowDownCircle className="text-yellow-400" size={20}/> Areas for Improvement
                                        </h3>
                                        <ul className="space-y-3 relative z-10">
                                            {results.improvementAreas.map((s, idx) => (
                                                <li key={idx} className="flex gap-3 text-[#CCD6F6] text-sm bg-[#0A192F] p-3 rounded-lg border border-[#233554]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0 shadow-[0_0_5px_#facc15]"></div>
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Target Markets List */}
                                <div className="bg-[#112240] rounded-2xl p-6 border border-[#233554] shadow-xl">
                                    <h3 className="text-white font-bold mb-4">Recommended Target Markets</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {results.targetMarkets.map((market, idx) => (
                                            <span key={idx} className="bg-[#0A192F] border border-[#233554] text-[#8892B0] px-4 py-2 rounded-full text-sm hover:text-white hover:border-[#D4AF37] transition-all cursor-default shadow-sm hover:shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                                {market}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SkillIntelligence;
