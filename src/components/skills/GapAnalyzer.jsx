import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const GapAnalyzer = ({ gapData }) => {
    return (
        <div className="bg-[#112240] p-6 rounded-lg shadow-xl border border-[#233554]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-display font-semibold text-[#CCD6F6]">Skill Gap Analysis</h3>
                    <p className="text-sm text-[#8892B0]">Your skills vs Market Demand</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#64FFDA]"></div>
                        <span className="text-[#8892B0]">You</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>
                        <span className="text-[#8892B0]">Market</span>
                    </div>
                </div>
            </div>

            <div className="h-80 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={gapData}>
                        <PolarGrid stroke="#233554" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#8892B0', fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                        <Radar
                            name="You"
                            dataKey="A"
                            stroke="#64FFDA"
                            fill="#64FFDA"
                            fillOpacity={0.3}
                        />
                        <Radar
                            name="Market"
                            dataKey="B"
                            stroke="#D4AF37"
                            fill="#D4AF37"
                            fillOpacity={0.3}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0A192F', borderColor: '#233554', color: '#CCD6F6' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>

                {/* Insight Overlay */}
                <div className="absolute bottom-0 right-0 bg-[#0A192F]/80 backdrop-blur-sm p-3 rounded-lg border border-[#233554] max-w-xs">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs text-[#CCD6F6] font-medium">Gap Detected: Kiln Management</p>
                            <p className="text-[10px] text-[#8892B0] mt-1">Market expects higher proficiency. Consider training.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GapAnalyzer;
