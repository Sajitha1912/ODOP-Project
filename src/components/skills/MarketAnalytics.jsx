import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';

const MarketAnalytics = ({ marketDemand, demandTrends }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#112240] p-6 rounded-lg shadow-xl border border-[#233554]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-semibold text-[#CCD6F6]">Market Demand</h3>
                    <TrendingUp className="text-[#64FFDA]" size={20} />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={marketDemand} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#233554" horizontal={false} />
                            <XAxis type="number" stroke="#8892B0" />
                            <YAxis dataKey="name" type="category" stroke="#8892B0" width={100} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A192F', borderColor: '#233554', color: '#CCD6F6' }}
                            />
                            <Bar dataKey="demand" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-[#112240] p-6 rounded-lg shadow-xl border border-[#233554]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-semibold text-[#CCD6F6]">Demand Trends</h3>
                    <Activity className="text-[#64FFDA]" size={20} />
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={demandTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
                            <XAxis dataKey="month" stroke="#8892B0" />
                            <YAxis stroke="#8892B0" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0A192F', borderColor: '#233554', color: '#CCD6F6' }}
                            />
                            <Line type="monotone" dataKey="demand" stroke="#64FFDA" strokeWidth={2} dot={{ fill: '#64FFDA' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default MarketAnalytics;
