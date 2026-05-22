import React from 'react';

const Placeholder = ({ title }) => (
    <div className="min-h-screen bg-[#0A192F] text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-display text-[#D4AF37] mb-4">{title}</h1>
            <p className="text-[#8892B0]">Coming Soon</p>
        </div>
    </div>
);

export const DistrictExplorer = () => <Placeholder title="District Explorer" />;
export const Shop = () => <Placeholder title="All Products" />;
export const Impact = () => <Placeholder title="Our Impact" />;
