import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';

const SkillProfiler = ({ skills, onAddSkill, onRemoveSkill }) => {
    const [newSkill, setNewSkill] = useState('');

    const handleAdd = () => {
        if (newSkill.trim()) {
            onAddSkill(newSkill.trim());
            setNewSkill('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="bg-[#112240] p-6 rounded-lg shadow-xl border border-[#233554]">
            <h3 className="text-xl font-display font-semibold text-[#CCD6F6] mb-4">Artisan Skill Profile</h3>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (e.g., Pottery, Weaving)"
                    className="flex-1 bg-[#0A192F] border border-[#233554] rounded-md px-4 py-2 text-[#CCD6F6] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                    onClick={handleAdd}
                    className="bg-[#D4AF37] text-[#0A192F] p-2 rounded-md hover:bg-[#F8E71C] transition-colors"
                >
                    <Plus size={24} />
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                    <motion.div
                        key={skill.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 bg-[#233554] px-3 py-1.5 rounded-full border border-[#D4AF37]/30"
                    >
                        <span className="text-[#8892B0] font-medium">{skill.name}</span>
                        <div className="h-4 w-[1px] bg-[#8892B0]/30"></div>
                        <span className="text-xs text-[#D4AF37]">{skill.level}</span>
                        <button
                            onClick={() => onRemoveSkill(skill.id)}
                            className="text-[#8892B0] hover:text-red-400 transition-colors ml-1"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center text-sm text-[#8892B0]">
                <span>Total Skills: {skills.length}</span>
                <span className="text-[#64FFDA]">Profile Strength: Good</span>
            </div>
        </div>
    );
};

export default SkillProfiler;
