import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { getLeaderboard, getUserData, type LeaderboardEntry } from '../utils/pointsSystem';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userData, setUserData] = useState(getUserData());

  useEffect(() => {
    const data = getLeaderboard();
    setLeaderboard(data);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-gray-500 font-semibold w-6 text-center">{rank}</span>;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-400';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-400';
      case 3:
        return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-400';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center">
          <Trophy className="w-16 h-16 text-[#4CAF50]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Leaderboard
        </h2>
        <p className="text-lg text-gray-600">
          Compete with eco-warriors worldwide!
        </p>
      </div>

      {/* User Stats Card */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl p-6 shadow-lg mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Stats</p>
            <h3 className="text-2xl font-bold">{userData.points} Points</h3>
            <p className="text-sm opacity-90">{userData.itemsClassified} items classified</p>
          </div>
          <div className="text-right">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">This Week</p>
            <p className="text-xl font-bold">+{userData.weeklyStats.pointsThisWeek}</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <div className="flex justify-center items-end gap-4 mb-8">
          {/* Second Place */}
          {leaderboard[1] && (
            <div className="flex flex-col items-center">
              <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center mb-2 border-4 border-gray-400">
                <Medal className="w-10 h-10 text-gray-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-sm truncate max-w-[80px]">
                  {leaderboard[1].name}
                </p>
                <p className="text-xs text-gray-600">{leaderboard[1].points} pts</p>
              </div>
              <div className="bg-gray-300 w-24 h-16 mt-2 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">2</span>
              </div>
            </div>
          )}

          {/* First Place */}
          {leaderboard[0] && (
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-yellow-500 mb-1" />
              <div className="bg-yellow-200 w-24 h-24 rounded-full flex items-center justify-center mb-2 border-4 border-yellow-500">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 truncate max-w-[90px]">
                  {leaderboard[0].name}
                </p>
                <p className="text-sm text-gray-600">{leaderboard[0].points} pts</p>
              </div>
              <div className="bg-yellow-300 w-28 h-24 mt-2 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold text-yellow-700">1</span>
              </div>
            </div>
          )}

          {/* Third Place */}
          {leaderboard[2] && (
            <div className="flex flex-col items-center">
              <div className="bg-orange-200 w-20 h-20 rounded-full flex items-center justify-center mb-2 border-4 border-orange-400">
                <Medal className="w-10 h-10 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-sm truncate max-w-[80px]">
                  {leaderboard[2].name}
                </p>
                <p className="text-xs text-gray-600">{leaderboard[2].points} pts</p>
              </div>
              <div className="bg-orange-300 w-24 h-12 mt-2 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-700">3</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard List */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Full Rankings</h3>
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-lg border-2 shadow-sm transition-all ${
              entry.isCurrentUser
                ? 'bg-green-50 border-[#4CAF50] shadow-md scale-105'
                : getRankBgColor(entry.rank)
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8">
                {getRankIcon(entry.rank)}
              </div>
              <div>
                <p className={`font-semibold ${entry.isCurrentUser ? 'text-[#2E7D32]' : 'text-gray-900'}`}>
                  {entry.name} {entry.isCurrentUser && '(You)'}
                </p>
                <p className="text-sm text-gray-600">
                  {entry.itemsClassified} items classified
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xl font-bold ${entry.isCurrentUser ? 'text-[#2E7D32]' : 'text-gray-900'}`}>
                {entry.points}
              </p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Info */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">🎁 How to Earn Points</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Classify a waste item: <strong>+10 points</strong></li>
          <li>• Complete 5 items in a day: <strong>+50 bonus points</strong></li>
          <li>• Weekly streak (7 days): <strong>+100 bonus points</strong></li>
          <li>• Share your impact: <strong>+20 points</strong></li>
        </ul>
      </div>
    </div>
  );
}
