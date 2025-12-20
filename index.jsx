import React, { useState, useEffect, useCallback } from 'react';
import { Star, Lock, RotateCcw, Trophy, ChevronRight, Home } from 'lucide-react';

/**
 * HỆ THỐNG DỮ LIỆU CẤP ĐỘ - PHIÊN BẢN V1.5 (FIX TRIỆT ĐỂ LỖI QUÂN HẬU)
 */
const LEVELS = [
  {
    id: 1,
    name: "Trạm Tiếp Tế",
    desc: "Mate in 1: Chiếu bí cơ bản",
    color: "from-blue-400 to-cyan-300",
    puzzles: [
      { fen: "6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1", description: "Xe chiếu bí hàng cuối (Re8#)" },
      { fen: "6k1/5ppp/8/8/8/8/1Q6/6K1 w - - 0 1", description: "Hậu chiếu bí hàng ngang (Qb8#)" },
      { fen: "k7/8/2Q5/3B4/8/8/8/7K w - - 0 1", description: "Hậu và Tượng phối hợp (Qb7#)" }
    ]
  },
  {
    id: 2,
    name: "Tinh Vân Xe & Hậu",
    desc: "Đòn quét thang máy",
    color: "from-purple-400 to-pink-400",
    puzzles: [
      { fen: "k7/8/8/8/8/8/1R6/Q6K w - - 0 1", description: "Xe và Hậu dồn vua (Qa7#)" },
      { fen: "8/8/8/8/k7/1R6/Q7/7K w - - 0 1", description: "Chiếu hết ở cột biên (Ra3#)" },
      { fen: "4k3/R7/8/8/8/8/7Q/7K w - - 0 1", description: "Thang máy dọc (Qh8#)" }
    ]
  },
  {
    id: 3,
    name: "Vành Đai Mã & Tượng",
    desc: "Quân nhẹ phối hợp",
    color: "from-green-400 to-emerald-300",
    puzzles: [
      { fen: "k7/8/1N6/1B6/8/8/8/7K w - - 0 1", description: "Mã và Tượng dồn góc (Nb6#)" },
      { fen: "8/8/8/8/8/2n5/1p3p2/5K1k b - - 0 1", description: "Mã đen chiếu bí (Ne2#)" },
      { fen: "k7/2N5/8/8/8/8/1B6/7K w - - 0 1", description: "Chiếu bí bằng Mã (Nb6#)" }
    ]
  },
  {
    id: 4,
    name: "Hố Đen Hàng Ngang",
    desc: "Back-rank Mate",
    color: "from-gray-400 to-slate-300",
    puzzles: [
      { fen: "6k1/3R1ppp/8/8/8/8/8/6K1 w - - 0 1", description: "Tận dụng hàng tốt chắn (Rd8#)" },
      { fen: "3r2k1/5ppp/8/8/8/8/4Q3/3R2K1 w - - 0 1", description: "Đánh lạc hướng (Rxd8#)" },
      { fen: "4r1k1/5ppp/8/8/8/8/3R4/3R2K1 w - - 0 1", description: "Chồng xe hàng ngang (Rd8#)" }
    ]
  },
  {
    id: 5,
    name: "Hệ Sao Đôi",
    desc: "Double Check (Chiếu đôi)",
    color: "from-yellow-400 to-orange-300",
    puzzles: [
      { fen: "k7/2P5/1R6/2K5/4B3/8/8/8 w - - 0 1", description: "Xe và Tượng chiếu đôi (Ra6#)" },
      { fen: "5k2/R7/4B3/8/8/8/8/7K w - - 0 1", description: "Chiếu mở (Rf7#)" },
      { fen: "k7/8/2N5/8/8/1B6/8/7K w - - 0 1", description: "Chiếu đôi phối hợp (Nb6#)" }
    ]
  },
  {
    id: 6,
    name: "Thiên Thạch Thắt Cổ",
    desc: "Smothered Mate",
    color: "from-red-500 to-orange-500",
    puzzles: [
      { fen: "6rk/6pp/8/6N1/8/8/8/7K w - - 0 1", description: "Mã chiếu bí trong góc (Nf7#)" },
      { fen: "r5rk/6pp/8/4N3/8/8/8/7K w - - 0 1", description: "Kinh điển Philidor (Nf7#)" },
      { fen: "r1b3rk/6pp/8/4N3/8/8/8/7K w - - 0 1", description: "Biến thể thắt cổ (Nf7#)" }
    ]
  },
  {
    id: 7,
    name: "Bão Mặt Trời",
    desc: "Battery Attack",
    color: "from-orange-400 to-red-400",
    puzzles: [
      { fen: "6k1/5ppp/8/8/8/2B5/6Q1/6K1 w - - 0 1", description: "Hậu Tượng chéo (Qxg7#)" },
      { fen: "3r2k1/p4ppp/8/8/8/8/4R3/3R3K w - - 0 1", description: "Súng đại bác Xe (Rxd8#)" },
      { fen: "7k/7p/8/8/8/8/7Q/K6R w - - 0 1", description: "Phối hợp xa (Qxh7#)" }
    ]
  },
  {
    id: 8,
    name: "Căn Cứ Tốt Thông",
    desc: "Phong cấp chiếu bí",
    color: "from-lime-400 to-green-400",
    puzzles: [
      { fen: "8/5P1k/8/8/8/8/8/7K w - - 0 1", description: "Phong Hậu chiếu ngay (f8=Q#)" },
      { fen: "k7/2P5/K7/8/8/8/8/8 w - - 0 1", description: "Phong Xe tránh hòa cờ (c8=R#)" },
      { fen: "8/8/8/8/8/6k1/5p2/6K1 b - - 0 1", description: "Tốt đen phong cấp (f1=Q#)" }
    ]
  },
  {
    id: 9,
    name: "Mê Cung Tàn Cuộc",
    desc: "Mate in 2",
    color: "from-indigo-400 to-purple-500",
    puzzles: [
      { fen: "r5k1/5ppp/8/8/8/8/4Q3/4R1K1 w - - 0 1", description: "Mate in 2: (1. Qe8+ Rxe8 2. Rxe8#)" },
      { fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1", description: "Chiếu bí Scholar (Qxf7#)" },
      { fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1", description: "Đe dọa f7 (Qxf7#)" }
    ]
  },
  {
    id: 10,
    name: "Trạm Vũ Trụ Tối Cao",
    desc: "Tổng hợp siêu cấp",
    color: "from-fuchsia-500 to-rose-500",
    puzzles: [
      { fen: "r2qkb1r/pp2nppp/3p4/2pNN3/2BnP3/3P4/PPP2PPP/R1BbK2R w KQkq - 1 0", description: "Légal's Mate (Nf6#)" },
      { fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 1", description: "Phát triển quân" },
      { fen: "3q1rk1/5pbp/5Q2/8/8/2B5/5PPP/6K1 w - - 0 1", description: "Phối hợp cuối (Qxg7#)" }
    ]
  }
];

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'move') {
      osc.frequency.setValueAtTime(350, now); osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'win') {
      osc.frequency.setValueAtTime(440, now); osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      osc.start(now); osc.stop(now + 0.4);
    }
  } catch(e) {}
};

export default function App() {
  const [gameState, setGameState] = useState('map');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [stars, setStars] = useState(0);
  
  // Game state
  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState('w');
  const [selected, setSelected] = useState(null);
  const [isCheckmate, setIsCheckmate] = useState(false);

  const currentLevelData = LEVELS.find(l => l.id === currentLevelId);
  const currentPuzzle = currentLevelData?.puzzles[puzzleIndex];

  // Initialize Chess Engine
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js";
    script.async = true;
    script.onload = () => {
      if (currentPuzzle) {
        initGame(currentPuzzle.fen);
      }
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  // Update game when puzzle changes
  useEffect(() => {
    if (currentPuzzle && window.Chess) {
      initGame(currentPuzzle.fen);
    }
  }, [currentPuzzle, currentLevelId]);

  const initGame = (fen) => {
    const newGame = new window.Chess(fen);
    setGame(newGame);
    setBoard(newGame.board());
    setTurn(newGame.turn());
    setSelected(null);
    setIsCheckmate(false);
  };

  const onPuzzleComplete = useCallback(() => {
    setStars(s => s + 1);
    playSound('win');
    if (puzzleIndex + 1 >= currentLevelData.puzzles.length) {
      if (currentLevelId === unlockedLevel && unlockedLevel < 10) setUnlockedLevel(u => u + 1);
      setTimeout(() => setGameState('victory'), 1000);
    } else {
      setTimeout(() => setPuzzleIndex(p => p + 1), 1000);
    }
  }, [puzzleIndex, currentLevelId, unlockedLevel, currentLevelData.puzzles.length]);

  const handleSquareClick = (r, c) => {
    if (!game || isCheckmate) return;
    
    const square = `${String.fromCharCode(97 + c)}${8 - r}`;
    const pieceOnSquare = board[r][c];

    if (selected) {
      // Logic di chuyển
      let promotion = 'q';
      if (game.fen().includes("k7/2P5") && square.includes('8')) promotion = 'r';

      const move = game.move({ from: selected, to: square, promotion });
      
      if (move) {
        setBoard(game.board());
        setTurn(game.turn());
        setSelected(null);
        playSound('move');
        if (game.in_checkmate()) {
          setIsCheckmate(true);
          onPuzzleComplete();
        }
      } else {
        // Nếu không đi được, kiểm tra xem có phải chọn quân mới không
        if (pieceOnSquare && pieceOnSquare.color === turn) {
          setSelected(square);
        } else {
          setSelected(null);
        }
      }
    } else {
      // Chọn quân - FIX: Luôn cho phép chọn quân đúng lượt, kể cả Hậu
      if (pieceOnSquare && pieceOnSquare.color === turn) {
        setSelected(square);
      }
    }
  };

  const Piece = ({ piece }) => {
    if (!piece) return null;
    const icons = { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' };
    const isWhite = piece.color === 'w';
    return (
      <span className={`text-4xl sm:text-5xl select-none transition-transform pointer-events-none
        ${isWhite ? 'text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]' : 'text-slate-950'}
        ${isWhite ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]'}
      `}>
        {icons[piece.type]}
      </span>
    );
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none">
      {/* HUD */}
      <header className="p-4 bg-slate-900/95 border-b border-slate-700 flex justify-between items-center z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/40">
            <Trophy className="text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-lg tracking-tighter uppercase italic bg-gradient-to-r from-blue-400 to-fuchsia-400 bg-clip-text text-transparent">Galaxy Chess</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 ml-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold">{stars}</span>
          </div>
        </div>
        {gameState !== 'map' && (
          <button onClick={() => setGameState('map')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-600 transition-all active:scale-90">
            <Home size={20} className="text-cyan-400" />
          </button>
        )}
      </header>

      <main className="flex-1 relative flex flex-col">
        {gameState === 'map' && (
          <div className="flex-1 w-full p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed">
            <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 py-10">
              {LEVELS.map(level => {
                const locked = level.id > unlockedLevel;
                const active = level.id === unlockedLevel;
                return (
                  <button
                    key={level.id}
                    disabled={locked}
                    onClick={() => { setCurrentLevelId(level.id); setPuzzleIndex(0); setGameState('playing'); }}
                    className={`relative flex flex-col items-center group transition-all duration-500 ${locked ? 'opacity-30 grayscale' : 'hover:scale-110 active:scale-95'}`}
                  >
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${level.color} shadow-[0_0_30px_rgba(0,0,0,0.6)] flex items-center justify-center relative border-2 border-white/10 ${active ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-slate-950 animate-pulse' : ''}`}>
                      {locked ? <Lock className="text-white/40" size={24} /> : <span className="text-3xl font-black text-white drop-shadow-md">{level.id}</span>}
                    </div>
                    <span className="mt-3 text-xs font-black tracking-widest text-slate-400 group-hover:text-white uppercase">{level.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {gameState === 'playing' && currentPuzzle && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
            
            <div className="mb-6 text-center z-10">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{currentLevelData.name}</h2>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 uppercase tracking-tighter">Cấp {puzzleIndex + 1} / 3</span>
                <p className="text-slate-400 text-sm font-medium italic">{currentPuzzle.description}</p>
              </div>
            </div>

            {/* Chess Board */}
            <div className="relative group">
              <div className="bg-slate-800 p-1.5 rounded-xl border-[6px] border-slate-700 shadow-2xl relative z-10 overflow-hidden">
                <div className="grid grid-cols-8 bg-slate-600 gap-px border border-slate-900">
                  {board.map((row, rIdx) => row.map((piece, cIdx) => {
                    const square = `${String.fromCharCode(97 + cIdx)}${8 - rIdx}`;
                    const isDark = (rIdx + cIdx) % 2 === 1;
                    const isSelected = selected === square;
                    const isLastMove = false; // Có thể mở rộng sau

                    return (
                      <div
                        key={square}
                        onClick={() => handleSquareClick(rIdx, cIdx)}
                        className={`w-11 h-11 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer transition-all relative
                          ${isDark ? 'bg-slate-700' : 'bg-slate-500'}
                          ${isSelected ? 'bg-yellow-400/50 scale-95 shadow-inner' : 'hover:bg-slate-400/30'}
                        `}
                      >
                        {isSelected && <div className="absolute inset-1 border-2 border-yellow-300 rounded-sm animate-pulse z-20"></div>}
                        <Piece piece={piece} />
                      </div>
                    );
                  }))}
                </div>
              </div>
              {/* Board Reflection */}
              <div className="absolute -bottom-4 left-4 right-4 h-8 bg-white/5 blur-xl rounded-full -z-10"></div>
            </div>

            <div className="mt-10 flex gap-4 z-10">
              <button 
                onClick={() => initGame(currentPuzzle.fen)} 
                className="flex items-center gap-2 px-8 py-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-xl border border-slate-700 transition-all font-bold active:scale-95 shadow-lg"
              >
                <RotateCcw size={18} className="text-fuchsia-400" /> THỬ LẠI
              </button>
            </div>
          </div>
        )}

        {gameState === 'victory' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 backdrop-blur-3xl animate-in zoom-in duration-300">
            <div className="relative mb-8">
              <Trophy size={120} className="text-yellow-400 animate-bounce drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
              <div className="absolute inset-0 bg-yellow-400/20 blur-[80px] rounded-full -z-10"></div>
            </div>
            <h2 className="text-5xl font-black mb-4 tracking-tighter italic bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent uppercase">CHIẾN THẮNG!</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-sm">Hành tinh <b>{currentLevelData.name}</b> đã thuộc về bạn.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
              <button onClick={() => setGameState('map')} className="flex-1 px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black border border-slate-600 transition-all uppercase tracking-widest text-xs">Bản đồ</button>
              {currentLevelId < 10 && (
                <button 
                  onClick={() => { setCurrentLevelId(currentLevelId + 1); setPuzzleIndex(0); setGameState('playing'); }}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl font-black shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Kế tiếp <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer hint */}
      {gameState === 'playing' && (
        <footer className="p-3 bg-slate-950 text-center border-t border-slate-900">
          <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Nhấn vào quân cờ để chọn, nhấn vào ô đích để di chuyển</p>
        </footer>
      )}
    </div>
  );
}
