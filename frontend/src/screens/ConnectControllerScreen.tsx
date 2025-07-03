import React, { useState, useEffect } from 'react';

interface ConnectControllerScreenProps {
  onConnectComplete: () => void;
}

const ConnectControllerScreen: React.FC<ConnectControllerScreenProps> = ({ onConnectComplete }) => {
  const [player1Connected, setPlayer1Connected] = useState(false);
  const [player2Connected, setPlayer2Connected] = useState(false);

  const handlePlayer1Connect = () => {
    setPlayer1Connected(true);
  };

  const handlePlayer2Connect = () => {
    setPlayer2Connected(true);
  };

  const canStartGame = player1Connected && player2Connected;

  // 両方のプレイヤーが接続されたら自動でページ遷移
  useEffect(() => {
    if (canStartGame) {
      const timer = setTimeout(() => {
        onConnectComplete();
      }, 1500); // 1.5秒後に自動遷移

      return () => clearTimeout(timer);
    }
  }, [canStartGame, onConnectComplete]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Connect Controllers
          </h1>
          
          <div className="text-center mb-8">
            <div className="text-gray-600 mb-6">
              各プレイヤーのコントローラーを接続してください
            </div>
            
            {/* プレイヤー接続ボタン */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Player 1 */}
              <div className="text-center flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Player 1</h3>
                {player1Connected ? (
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-green-700 font-semibold">
                      ✓ 接続済み
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-gray-500">
                      未接続
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePlayer1Connect}
                  disabled={player1Connected}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    player1Connected
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {player1Connected ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Player 2 */}
              <div className="text-center flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Player 2</h3>
                {player2Connected ? (
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-green-700 font-semibold">
                      ✓ 接続済み
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-gray-500">
                      未接続
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePlayer2Connect}
                  disabled={player2Connected}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    player2Connected
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {player2Connected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
          
          {/* 自動遷移メッセージ */}
          {canStartGame ? (
            <div className="text-center py-4">
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4">
                <div className="text-green-700 font-semibold text-lg">
                  ✓ 両方のプレイヤーが接続されました！
                </div>
                <div className="text-green-600 text-sm mt-2">
                  まもなくゲームが開始されます...
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-600">
                両方のプレイヤーの接続をお待ちください
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectControllerScreen;
