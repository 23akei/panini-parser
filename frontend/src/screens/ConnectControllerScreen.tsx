import React, { useState, useEffect } from 'react';
import { useGameInput } from '../contexts/GameInputContext';

interface ConnectControllerScreenProps {
  onConnectComplete: () => void;
}

const ConnectControllerScreen: React.FC<ConnectControllerScreenProps> = ({ onConnectComplete }) => {
  const { connect, devices } = useGameInput();
  console.log(devices.player1.lastInput, " ", devices.player1.isToggled, " ", devices.player1.inputProcessed);
  console.log(devices.player2.lastInput, " ", devices.player2.isToggled, " ", devices.player2.inputProcessed);

  const handlePlayer1Connect = () => {
    connect(1);
  };

  const handlePlayer2Connect = () => {
    connect(2);
  };

  const canStartGame = devices.player1.isConnected && devices.player2.isConnected;

  // 両方のプレイヤーが接続されたら自動でページ遷移
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (devices.player1.isConnected && devices.player2.isConnected) {
      // 両方が接続されたら2秒後に遷移
      timer = setTimeout(() => {
        onConnectComplete();
      }, 2000);
    } else {
      // どちらかが接続されていなければ20秒後に遷移
      timer = setTimeout(() => {
        onConnectComplete();
      }, 20000);
    } 
    return () => clearTimeout(timer); // クリーンアップ必須 :contentReference[oaicite:1]{index=1}
  }, [
    devices.player1.isConnected,
    devices.player2.isConnected
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Connect Controllers
          </h1>
          
          <div className="text-center mb-8">
            <div className="text-gray-600 mb-6">
              Please connect each player's controller
            </div>
            
            {/* プレイヤー接続ボタン */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Player 1 */}
              <div className="text-center flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Player 1</h3>
                {devices.player1.isConnected ? (
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-green-700 font-semibold">
                      ✓ Connected
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-gray-500">
                      Not connected
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePlayer1Connect}
                  disabled={devices.player1.isConnected}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    devices.player1.isConnected
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {devices.player1.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Player 2 */}
              <div className="text-center flex flex-col">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Player 2</h3>
                {devices.player2.isConnected ? (
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-green-700 font-semibold">
                      ✓ Connected
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4 flex-grow flex items-center justify-center">
                    <div className="text-gray-500">
                      Not connected
                    </div>
                  </div>
                )}
                <button
                  onClick={handlePlayer2Connect}
                  disabled={devices.player2.isConnected}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    devices.player2.isConnected
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {devices.player2.isConnected ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
          
          {/* 自動遷移メッセージ */}
          {canStartGame ? (
            <div className="text-center py-4">
              <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4">
                <div className="text-green-700 font-semibold text-lg">
                  ✓ Both players are connected!
                </div>
                <div className="text-green-600 text-sm mt-2">
                  The game will start soon...
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-gray-600">
                Please wait for both players to connect
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectControllerScreen;
