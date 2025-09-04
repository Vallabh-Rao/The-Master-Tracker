import React from 'react';

const KarmaDisplay = ({ user }) => {
    const { karma_score = 0, security_level = 'Rookie' } = user || {};

    const getLevelColor = () => {
        switch (security_level) {
            case 'Rookie': return 'from-red-500 to-red-600';
            case 'Guardian': return 'from-orange-500 to-orange-600';
            case 'Sentinel': return 'from-green-500 to-green-600';
            case 'Cyber Knight': return 'from-blue-500 to-purple-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getNextLevel = () => {
        if (karma_score < 50) return { level: 'Guardian', needed: 50 - karma_score };
        if (karma_score < 150) return { level: 'Sentinel', needed: 150 - karma_score };
        if (karma_score < 300) return { level: 'Cyber Knight', needed: 300 - karma_score };
        return { level: 'Max Level', needed: 0 };
    };

    const nextLevel = getNextLevel();

    return (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
            {/* Karma Ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getLevelColor()} animate-pulse shadow-lg`}>
                    <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{karma_score}</span>
                    </div>
                </div>
            </div>

            {/* Security Level */}
            <h3 className="text-xl font-bold text-white mb-2">{security_level}</h3>
            
            {/* Progress Info */}
            {nextLevel.needed > 0 && (
                <div className="text-sm text-gray-400">
                    <p>{nextLevel.needed} points to {nextLevel.level}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                        <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor()}`}
                            style={{ 
                                width: `${((karma_score % 50) / 50) * 100}%` 
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default KarmaDisplay;