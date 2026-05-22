import React, { useState } from 'react';
import SkillProfiler from './SkillProfiler';
import MarketAnalytics from './MarketAnalytics';
import GapAnalyzer from './GapAnalyzer';
import TrainingRecommendations from './TrainingRecommendations';
import { skillsData } from '../../data/mockData';
import { motion } from 'framer-motion';

const SkillDashboard = () => {
    // State for user skills (mocked initially)
    const [userSkills, setUserSkills] = useState(skillsData.mySkills);

    const addSkill = (skillName) => {
        const newSkill = { id: Date.now(), name: skillName, level: "Beginner", endorsed: 0 };
        setUserSkills([...userSkills, newSkill]);
    };

    const removeSkill = (id) => {
        setUserSkills(userSkills.filter(skill => skill.id !== id));
    };

    return (
        <div className="space-y-8">
            {/* Top Row: Profiler & Gap Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:col-span-1"
                >
                    <SkillProfiler
                        skills={userSkills}
                        onAddSkill={addSkill}
                        onRemoveSkill={removeSkill}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <GapAnalyzer gapData={skillsData.gapAnalysis} />
                </motion.div>
            </div>

            {/* Middle Row: Market Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <MarketAnalytics
                    marketDemand={skillsData.marketDemand}
                    demandTrends={skillsData.demandTrends}
                />
            </motion.div>

            {/* Bottom Row: Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <TrainingRecommendations recommendations={skillsData.recommendations} />
            </motion.div>
        </div>
    );
};

export default SkillDashboard;
