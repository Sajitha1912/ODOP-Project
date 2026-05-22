import React from 'react';
import { Star, Clock, ExternalLink } from 'lucide-react';

const TrainingRecommendations = ({ recommendations }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-display font-semibold text-[#CCD6F6]">AI Recommended Training</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((course) => (
                    <div key={course.id} className="bg-[#112240] rounded-lg overflow-hidden border border-[#233554] hover:border-[#D4AF37]/50 transition-all duration-300 group">
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-[#0A192F]/90 backdrop-blur px-2 py-1 rounded text-xs text-[#D4AF37] border border-[#D4AF37]/30">
                                {course.type}
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-[#64FFDA] bg-[#64FFDA]/10 px-2 py-0.5 rounded">
                                    {course.provider}
                                </span>
                                <div className="flex items-center gap-1 text-[#FFD700] text-xs">
                                    <Star size={12} fill="#FFD700" />
                                    <span>{course.rating}</span>
                                </div>
                            </div>

                            <h4 className="text-lg font-semibold text-[#CCD6F6] mb-2 line-clamp-1">{course.title}</h4>
                            <p className="text-sm text-[#8892B0] mb-4 min-h-[40px]">{course.reason}</p>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5 text-xs text-[#8892B0]">
                                    <Clock size={14} />
                                    <span>{course.duration}</span>
                                </div>
                                <button className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F8E71C] text-[#0A192F] px-3 py-1.5 rounded text-sm font-medium transition-colors">
                                    Enroll
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrainingRecommendations;
