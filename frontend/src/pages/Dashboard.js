import React, { useState, useEffect } from 'react';
import { Shield, Lock, Users, TrendingUp, Award, Activity, Eye, EyeOff, Zap, Target, Star } from 'lucide-react';

const SecurityKarmaDashboard = () => {
  const [user, setUser] = useState({
    username: 'CyberGuardian',
    email: 'user@securitykarma.com',
    karma_score: 185,
    security_level: 'Sentinel',
    streak: 7
  });
  
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [actions, setActions] = useState([
    { id: 1, type: 'password_check_strong', points: 10, timestamp: Date.now() - 3600000, icon: '🔐' },
    { id: 2, type: 'mfa_enabled', points: 20, timestamp: Date.now() - 7200000, icon: '🛡️' },
    { id: 3, type: 'phishing_quiz_passed', points: 8, timestamp: Date.now() - 10800000, icon: '🎣' },
    { id: 4, type: 'security_update', points: 5, timestamp: Date.now() - 14400000, icon: '🔄' }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const checkPasswordStrength = (pwd) => {
    let score = 0;
    let feedback = [];
    
    if (pwd.length >= 8) { score += 2; } else { feedback.push('Use 8+ characters'); }
    if (pwd.length >= 12) { score += 2; } else if (pwd.length >= 8) { feedback.push('Try 12+ characters'); }
    if (/[A-Z]/.test(pwd)) { score += 2; } else { feedback.push('Add uppercase letters'); }
    if (/[a-z]/.test(pwd)) { score += 2; } else { feedback.push('Add lowercase letters'); }
    if (/[0-9]/.test(pwd)) { score += 2; } else { feedback.push('Add numbers'); }
    if (/[^A-Za-z0-9]/.test(pwd)) { score += 3; } else { feedback.push('Add special characters'); }
    
    return { score, feedback, maxScore: 13 };
  };

  const getStrengthLevel = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 85) return { text: 'Fortress-Level', color: 'from-emerald-400 to-emerald-600', points: 15 };
    if (percentage >= 70) return { text: 'Strong', color: 'from-blue-400 to-blue-600', points: 10 };
    if (percentage >= 50) return { text: 'Moderate', color: 'from-yellow-400 to-yellow-600', points: 5 };
    if (percentage >= 30) return { text: 'Weak', color: 'from-orange-400 to-orange-600', points: 2 };
    return { text: 'Critical', color: 'from-red-400 to-red-600', points: 1 };
  };

  const getLevelInfo = (level) => {
    const levels = {
      'Rookie': { color: 'from-red-400 to-red-600', next: 'Guardian', threshold: 50 },
      'Guardian': { color: 'from-orange-400 to-orange-600', next: 'Sentinel', threshold: 150 },
      'Sentinel': { color: 'from-emerald-400 to-emerald-600', next: 'Cyber Knight', threshold: 300 },
      'Cyber Knight': { color: 'from-purple-400 to-purple-600', next: 'Legend', threshold: 500 }
    };
    return levels[level] || levels['Rookie'];
  };

  const simulateAction = (actionType, points, icon) => {
    setLoading(true);
    setTimeout(() => {
      const newAction = {
        id: actions.length + 1,
        type: actionType,
        points,
        timestamp: Date.now(),
        icon
      };
      
      setActions([newAction, ...actions]);
      setUser(prev => ({
        ...prev,
        karma_score: prev.karma_score + points,
        security_level: calculateLevel(prev.karma_score + points)
      }));
      
      setMessage(`🎉 +${points} karma! Great security practice!`);
      setLoading(false);
      
      setTimeout(() => setMessage(''), 3000);
    }, 800);
  };

  const calculateLevel = (karma) => {
    if (karma >= 300) return 'Cyber Knight';
    if (karma >= 150) return 'Sentinel';
    if (karma >= 50) return 'Guardian';
    return 'Rookie';
  };

  const testPassword = () => {
    if (!password) return;
    
    const { score, maxScore } = checkPasswordStrength(password);
    const strength = getStrengthLevel(score, maxScore);
    
    simulateAction('password_test', strength.points, '🔐');
    setPassword('');
  };

  const strengthInfo = password ? checkPasswordStrength(password) : null;
  const strengthLevel = strengthInfo ? getStrengthLevel(strengthInfo.score, strengthInfo.maxScore) : null;
  const levelInfo = getLevelInfo(user.security_level);
  const progressPercent = ((user.karma_score % levelInfo.threshold) / levelInfo.threshold) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Security Karma
              </h1>
            </div>
            <nav className="flex items-center space-x-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'actions', label: 'Actions', icon: Zap },
                { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === id 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {message && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-green-300 font-medium text-center">{message}</p>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Karma Display */}
            <div className="lg:col-span-1">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
                <div className="relative">
                  {/* Karma Ring */}
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50" cy="50" r="40"
                        className="fill-none stroke-white/10 stroke-[8]"
                      />
                      <circle
                        cx="50" cy="50" r="40"
                        className={`fill-none stroke-[8] bg-gradient-to-r ${levelInfo.color}`}
                        style={{
                          strokeDasharray: `${progressPercent * 2.51} 251`,
                          strokeLinecap: 'round',
                          filter: 'drop-shadow(0 0 10px currentColor)'
                        }}
                        stroke="url(#gradient)"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white mb-1">{user.karma_score}</div>
                        <div className="text-xs text-gray-400">KARMA</div>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{user.security_level}</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    {levelInfo.threshold - user.karma_score > 0 
                      ? `${levelInfo.threshold - user.karma_score} to ${levelInfo.next}`
                      : 'Max level achieved!'
                    }
                  </p>
                  
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-xl font-bold text-cyan-400">{user.streak}</div>
                      <div className="text-gray-400">Day Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-400">{actions.length}</div>
                      <div className="text-gray-400">Actions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">
                    {actions.reduce((sum, a) => sum + Math.max(0, a.points), 0)}
                  </div>
                  <div className="text-xs text-gray-400">Total Points</div>
                </div>
                <div className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center">
                  <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">Elite</div>
                  <div className="text-xs text-gray-400">Rank</div>
                </div>
              </div>
            </div>

            {/* Password Tester */}
            <div className="lg:col-span-1">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Lock className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">Password Fortress</h3>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to analyze..."
                      className="w-full p-4 bg-white/5 text-white rounded-lg border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {password && strengthInfo && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Strength:</span>
                        <span className={`text-sm font-bold bg-gradient-to-r ${strengthLevel.color} bg-clip-text text-transparent`}>
                          {strengthLevel.text}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${strengthLevel.color} transition-all duration-500 ease-out shadow-lg`}
                          style={{ width: `${(strengthInfo.score / strengthInfo.maxScore) * 100}%` }}
                        />
                      </div>
                      
                      {strengthInfo.feedback.length > 0 && (
                        <div className="text-xs text-gray-400 space-y-1">
                          <p>Suggestions:</p>
                          {strengthInfo.feedback.slice(0, 3).map((tip, i) => (
                            <p key={i} className="text-yellow-400">• {tip}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={testPassword}
                    disabled={!password || loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Analyze Password'
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-4">
                {[
                  { type: 'mfa_enabled', label: 'Enable MFA', points: 20, icon: '🛡️', color: 'from-green-500 to-green-600' },
                  { type: 'security_update', label: 'Security Update', points: 5, icon: '🔄', color: 'from-purple-500 to-purple-600' },
                  { type: 'phishing_quiz', label: 'Phishing Quiz', points: 8, icon: '🎣', color: 'from-orange-500 to-orange-600' }
                ].map((action) => (
                  <button
                    key={action.type}
                    onClick={() => simulateAction(action.type, action.points, action.icon)}
                    disabled={loading}
                    className={`w-full bg-gradient-to-r ${action.color} hover:shadow-lg text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-between`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-xl">{action.icon}</span>
                      <span>{action.label}</span>
                    </span>
                    <span className="bg-white/20 px-2 py-1 rounded text-sm">+{action.points}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <Activity className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {actions.map((action, index) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all duration-300 transform hover:scale-102"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: index < 3 ? 'slideInRight 0.5s ease-out' : 'none'
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                          <span className="text-lg">{action.icon}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className={`font-bold px-2 py-1 rounded ${
                        action.points > 0 ? 'text-green-400 bg-green-500/20' : 'text-red-400 bg-red-500/20'
                      }`}>
                        +{action.points}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievement Preview */}
              <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-lg rounded-2xl p-6 border border-yellow-400/20">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h4 className="text-lg font-bold text-white">Next Achievement</h4>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="text-yellow-300 font-medium">Password Master</p>
                  <p className="text-yellow-400/70 text-sm">Test 10 strong passwords</p>
                  <div className="mt-3 w-full bg-yellow-900/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full w-3/10" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">3/10 completed</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Password Vault', 
                desc: 'Generate & test secure passwords', 
                icon: Lock, 
                color: 'from-blue-500 to-cyan-500',
                action: () => setActiveTab('dashboard')
              },
              { 
                title: 'Phishing Shield', 
                desc: 'Learn to spot malicious emails', 
                icon: Shield, 
                color: 'from-green-500 to-emerald-500',
                action: () => simulateAction('phishing_training', 12, '🎣')
              },
              { 
                title: 'Security Audit', 
                desc: 'Scan your security posture', 
                icon: Eye, 
                color: 'from-purple-500 to-pink-500',
                action: () => simulateAction('security_audit', 15, '🔍')
              },
              { 
                title: 'Threat Intel', 
                desc: 'Stay updated on latest threats', 
                icon: TrendingUp, 
                color: 'from-orange-500 to-red-500',
                action: () => simulateAction('threat_briefing', 8, '📊')
              },
              { 
                title: 'Backup Guardian', 
                desc: 'Create secure data backups', 
                icon: Target, 
                color: 'from-indigo-500 to-blue-500',
                action: () => simulateAction('backup_created', 10, '💾')
              },
              { 
                title: 'Privacy Shield', 
                desc: 'Enhance your digital privacy', 
                icon: Users, 
                color: 'from-teal-500 to-green-500',
                action: () => simulateAction('privacy_enhanced', 7, '🔒')
              }
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer group"
                onClick={item.action}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'slideInUp 0.6s ease-out'
                }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🏆 Security Champions</h3>
            <div className="space-y-4">
              {[
                { rank: 1, name: 'CyberSentinel', karma: 485, level: 'Cyber Knight' },
                { rank: 2, name: user.username, karma: user.karma_score, level: user.security_level, isUser: true },
                { rank: 3, name: 'GuardianX', karma: 162, level: 'Sentinel' },
                { rank: 4, name: 'SecureNinja', karma: 134, level: 'Guardian' },
                { rank: 5, name: 'CryptoWarden', karma: 98, level: 'Guardian' }
              ].map((player) => (
                <div
                  key={player.rank}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                    player.isUser 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      player.rank === 1 ? 'bg-yellow-500 text-black' :
                      player.rank === 2 ? 'bg-gray-400 text-black' :
                      player.rank === 3 ? 'bg-orange-500 text-black' :
                      'bg-gray-600 text-white'
                    }`}>
                      {player.rank}
                    </div>
                    <div>
                      <p className={`font-medium ${player.isUser ? 'text-cyan-300' : 'text-white'}`}>
                        {player.name} {player.isUser && '(You)'}
                      </p>
                      <p className="text-sm text-gray-400">{player.level}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{player.karma}</p>
                    <p className="text-xs text-gray-400">karma</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => simulateAction('daily_check', 5, '⚡')}
          className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <Zap className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SecurityKarmaDashboard;