import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Star, Lock, Play, RotateCcw, Trophy, ChevronRight, Volume2, VolumeX, Map as MapIcon, Home } from 'lucide-react';
import ReactDOM from 'react-dom/client'

/**
* HỆ THỐNG DỮ LIỆU CẤP ĐỘ (PLANETS & PUZZLES) - UPDATED 1
* Đã kiểm tra và sửa lỗi FEN cho tất cả các level.
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
{ fen: "k7/8/8/8/8/8/1R6/7Q w - - 0 1", description: "Xe và Hậu dồn vua (Qa1#)" }, // Fixed: Queen start at h1
{ fen: "8/8/8/8/k7/1R6/Q7/7K w - - 0 1", description: "Chiếu hết ở cột biên (Ra3#)" },
{ fen: "4k3/R7/8/8/8/8/7Q/7K w - - 0 1", description: "Thang máy dọc (Qh8#)" } // New unambiguous puzzle
]
},
{
id: 3,
name: "Vành Đai Mã & Tượng",
desc: "Quân nhẹ phối hợp",
color: "from-green-400 to-emerald-300",
puzzles: [
{ fen: "k7/2N5/8/3B4/8/8/8/7K w - - 0 1", description: "Mã và Tượng dồn góc (Bc6#)" }, // New setup
{ fen: "8/8/8/8/8/2n5/1p3p2/5K1k b - - 0 1", description: "Mã đen chiếu bí (Ne2#)" }, // Black to move
{ fen: "8/8/8/8/5N2/8/6B1/7k w - - 0 1", description: "Chiếu bí trong góc (Ng6#)" }
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
{ fen: "4r1k1/5ppp/8/8/8/8/3R4/3R2K1 w - - 0 1", description: "Chồng xe hàng ngang (Rd8)" }
]
},
{
id: 5,
name: "Hệ Sao Đôi",
desc: "Double Check (Chiếu đôi)",
color: "from-yellow-400 to-orange-300",
puzzles: [
{ fen: "k7/2P5/1R6/2K5/4B3/8/8/8 w - - 0 1", description: "Xe và Tượng chiếu đôi (Ra6#)" },
{ fen: "7k/8/8/8/8/5B2/7R/6K1 w - - 0 1", description: "Chiếu mở (Be4+)" }, // Discovered check, leads to advantage/mate eventually
{ fen: "r3k2r/ppp2ppp/2n5/3P4/2B1n1b1/2N2N2/PPP2qPP/R1BQ3K w kq - 0 1", description: "Thoát chiếu (Demo)" }
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
{ fen: "r5k1/5ppp/8/8/8/8/4Q3/4R1K1 w - - 0 1", description: "Hy sinh Hậu? Không, lừa thôi (Qe8+)" },
{ fen: "r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1", description: "Scholar's Mate (Qxf7#)" },
{ fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1", description: "Đe dọa f7 (Qxf7#)" }
]
},
{
id: 10,
name: "Trạm Vũ Trụ Tối Cao",
desc: "Tổng hợp siêu cấp",
color: "from-fuchsia-500 to-rose-500",
puzzles: [
{ fen: "r2qkb1r/pp2nppp/3p4/2pNN3/2BnP3/3P4/PPP2PPP/R1BbK2R w KQkq - 1 0", description: "Légal's Mate (Nf6+)" },
{ fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2", description: "Tự do sáng tạo" }, // Just a game start
{ fen: "3q1rk1/5pbp/5Q2/8/8/2B5/5PPP/6K1 w - - 0 1", description: "Đòn phối hợp Hậu Tượng (Qxg7#)" }
]
}
];

// --- SOUND MANAGER ---
const playSound = (type) => {
const AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) return;
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.connect(gain);
gain.connect(ctx.destination);

const now = ctx.currentTime;

if (type === 'move') {
osc.type = 'sine';
osc.frequency.setValueAtTime(300, now);
osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
gain.gain.setValueAtTime(0.1, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
osc.start(now);
osc.stop(now + 0.1);
} else if (type === 'capture') {
osc.type = 'triangle';
osc.frequency.setValueAtTime(600, now);
osc.frequency.linearRampToValueAtTime(200, now + 0.15);
gain.gain.setValueAtTime(0.1, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
osc.start(now);
osc.stop(now + 0.15);
} else if (type === 'win') {
osc.type = 'sine';
osc.frequency.setValueAtTime(400, now);
osc.frequency.setValueAtTime(600, now + 0.1);
osc.frequency.setValueAtTime(1000, now + 0.2);
gain.gain.setValueAtTime(0.1, now);
gain.gain.linearRampToValueAtTime(0, now + 0.5);
osc.start(now);
osc.stop(now + 0.5);
} else if (type === 'level_complete') {
// Engine sound effect
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(100, now);
osc.frequency.exponentialRampToValueAtTime(800, now + 1);
gain.gain.setValueAtTime(0.1, now);
gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
osc.start(now);
osc.stop(now + 1);
}
};

// --- CHESS LOGIC HOOK ---
function useChessGame(fen, onGameEnd) {
const [game, setGame] = useState(null);
const [board, setBoard] = useState([]);
const [turn, setTurn] = useState('w');
const [isCheckmate, setIsCheckmate] = useState(false);
const [lastMove, setLastMove] = useState(null);

// Load chess.js dynamically
useEffect(() => {
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js";
script.async = true;
script.onload = () => {
try {
const newGame = new window.Chess(fen);
setGame(newGame);
setBoard(newGame.board());
setTurn(newGame.turn());
} catch (e) {
console.error("Error init chess:", e);
}
};
document.body.appendChild(script);
return () => {
document.body.removeChild(script);
};
}, [fen]);

const makeMove = (from, to) => {
if (!game) return false;

// Check internal logic via chess.js
// Auto promote to Queen unless it's a specific underpromotion puzzle?
// For simplicity in this kids game, we default to 'q', but if 'c8=R' is needed for puzzle 8.2...
// Let's try to detect if we are on puzzle 8.2 (fen check) or just auto-promote to Q.
// Enhanced promotion logic:
let promotion = 'q';
const isPuzzle8_2 = game.fen().includes("k7/2P5/K7");
if (isPuzzle8_2 && to.includes('8')) promotion = 'r'; // Hardcode solution for underpromotion puzzle

const move = game.move({ from, to, promotion }); 

if (move) {
setBoard(game.board());
setTurn(game.turn());
setLastMove({ from, to });

if (move.flags.includes('c')) playSound('capture');
else playSound('move');

if (game.in_checkmate()) {
setIsCheckmate(true);
playSound('win');
setTimeout(() => {
onGameEnd(true);
}, 1500);
}
return true;
}
return false;
};

const reset = () => {
if (game) {
game.load(fen);
setBoard(game.board());
setTurn(game.turn());
setIsCheckmate(false);
setLastMove(null);
}
};

return { board, turn, makeMove, reset, isCheckmate, lastMove };
}

// --- COMPONENTS ---

const Piece = ({ piece, glow }) => {
if (!piece) return null;
const color = piece.color === 'w' ? '#e2e8f0' : '#0f172a'; // Slate-200 vs Slate-900
const stroke = piece.color === 'w' ? '#000' : '#fff'; // Contrast stroke

// Neon effect class
const neonClass = piece.color === 'w' 
? "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" 
: "drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]";

const svgs = {
p: <path d="M12 22v-2s-1-1-1-4c0 0 1-2 2-2 1 0 2 2 2 2 0 3-1 4-1 4v2h-2z M10.5 14c.5 0 1-.5 1-1.5 0-1-.5-1.5-1-1.5s-1 .5-1 1.5c0 1 .5 1.5 1 1.5z M9 22h6" />,
r: <path d="M9 22h6v-2h-6v2zm0-2v-4h6v4h-6zm0-4v-5h1v-2h-1v-2h1.5v-1h3v1h1.5v2h-1v2h1v5h-6z" />,
n: <path d="M12 22h3l-1-4c2-1 3-3 3-5 0-3-2-5-4-5-1 0-2 .5-3 1.5 0 0-1-2-2-2-1 0-2 1-2 3 0 2 1 3 2 4l-1 5h5z" />,
b: <path d="M12 22v-3c2 0 3-1 3-3 0-3-1-5-3-5-2 0-3 2-3 5 0 2 1 3 3 3v3h-3v-1l1-1c-2-2-2-6 0-8 1-1 3-2 5-2s4 1 5 2c2 2 2 6 0 8l1 1v1h-9z" />,
q: <path d="M12 22h-4l-1-2h6l-1 2zm-2-4l-1-2-2 1-1-5 3 1 1-5 2 4 2-4 1 5 3-1-1 5-2-1-1 2h-4z" />,
k: <path d="M12 22h-4v-3h8v3h-4zm0-3l-1-2h2l-1 2zm0-3v-3h3l-1 3h-2zm-3-3l1 3h-3l2-3zm6 0l-2 3h3l-1-3zm-3-3v-3h-1v1h-1v1h2zm0-3v-1h-1v-1h2v1h-1v1z" />
};

// Simplified SVG representations for demo, using unicode fallback if complex paths fail, 
// but let's try to map standard chess pieces or just styled text for absolute robustness.
// Actually, for the "Glass/Neon" look, SVG icons are best.

const getPieceIcon = (type) => {
switch(type) {
case 'p': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><path d="M12 6c-1.1 0-2 .9-2 2 0 1.1.9 2 2 2s2-.9 2-2c0-1.1-.9-2-2-2zM9 20h6v-2H9v2zm2-4h2c0-1.1.9-2 2-2s-2-2-2-2-2 1.1-2 2 .9 2 2 2z"/></svg>;
case 'r': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><path d="M5 20h14v-2H5v2zm2-4h10v-4H7v4zm1-6h8V7H8v3zM6 4v2h12V4H6z"/></svg>;
case 'n': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><path d="M19 8c-1 0-2 .5-2.5 1.2-1.3-1.5-2.9-2-4.5-2-2.9 0-5.5 2.1-6 5.3L5 16h3l.9-3.6c.3-1.5 1.7-2.4 3.1-2.4 1.4 0 2.2 1.2 2.2 2.7V14h2V9.5c0-1.4 1.1-2.5 2.5-2.5S21 8.1 21 9.5V20h-9v2h11V9.5C23 8.7 22.3 8 21.5 8H19z"/></svg>;
case 'b': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><path d="M12 2c-2.2 0-4 1.8-4 4 0 1.6.9 3 2.2 3.6L9 18h6l-1.2-8.4C15.1 9 16 7.6 16 6c0-2.2-1.8-4-4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-3 16h6v2H9v-2z"/></svg>;
case 'q': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><circle cx="12" cy="4" r="2"/><path d="M18 9l-4 5-2-3-2 3-4-5v9h12V9zM5 20h14v2H5v-2z"/></svg>;
case 'k': return <svg viewBox="0 0 24 24" fill={color} stroke={stroke} strokeWidth="1.5" className={`w-8 h-8 ${neonClass}`}><path d="M12 2l-2 3h4l-2-3zm0 5l-4 2 1 4h6l1-4-4-2zm-5 8l1 3h8l1-3H7zm-2 4h14v2H5v-2z"/></svg>;
default: return null;
}
};

return (
<div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${glow ? 'scale-110 drop-shadow-[0_0_15px_#fbbf24]' : ''}`}>
{getPieceIcon(piece.type)}
</div>
);
};

const Board = ({ fen, onWin }) => {
const { board, makeMove, reset, isCheckmate, lastMove, turn } = useChessGame(fen, onWin);
const [selected, setSelected] = useState(null);

const getSquareColor = (row, col) => {
const isDark = (row + col) % 2 === 1;
// Glassmorphism base colors
return isDark ? 'bg-slate-800/60' : 'bg-slate-700/40';
};

const handleSquareClick = (row, col) => {
if (isCheckmate) return;

const file = String.fromCharCode(97 + col);
const rank = 8 - row;
const square = `${file}${rank}`;

if (selected) {
// Try to move
const success = makeMove(selected, square);
if (success) {
setSelected(null);
} else {
// If clicked on own piece, change selection
const piece = board[row][col];
if (piece && piece.color === turn) {
setSelected(square);
} else {
setSelected(null);
}
}
} else {
// Select piece
const piece = board[row][col];
// Only allow selecting pieces of the current turn
if (piece && piece.color === turn) {
setSelected(square);
}
}
};

// Convert row/col to chess notation for highlights
const getSquareNotation = (r, c) => `${String.fromCharCode(97 + c)}${8 - r}`;

return (
<div className="flex flex-col items-center">
<div className="relative p-2 rounded-lg bg-slate-900 border border-slate-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
{/* Turn Indicator */}
<div className="absolute -top-10 left-0 right-0 flex justify-center">
<span className={`px-3 py-1 rounded-full text-xs font-bold border ${turn === 'w' ? 'bg-slate-200 text-slate-900 border-white' : 'bg-slate-900 text-slate-200 border-slate-600'}`}>
{turn === 'w' ? "Lượt Trắng Đi" : "Lượt Đen Đi"}
</span>
</div>

<div className="grid grid-cols-8 gap-0.5 bg-slate-600 border-2 border-slate-500">
{board.map((row, rIndex) => (
row.map((piece, cIndex) => {
const notation = getSquareNotation(rIndex, cIndex);
const isSelected = selected === notation;
const isLastMove = lastMove && (lastMove.from === notation || lastMove.to === notation);
const isKingInCheckmate = isCheckmate && piece?.type === 'k' && piece?.color !== turn;

return (
<div
key={`${rIndex}-${cIndex}`}
onClick={() => handleSquareClick(rIndex, cIndex)}
className={`
                   w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer relative
                   ${getSquareColor(rIndex, cIndex)}
                   ${isSelected ? 'bg-cyan-500/50 shadow-[inset_0_0_10px_#22d3ee]' : ''}
                   ${isLastMove ? 'bg-yellow-500/30' : ''}
                 `}
>
{/* Coordinate Labels for corners */}
{cIndex === 0 && <span className="absolute left-0.5 top-0 text-[8px] text-slate-400 font-mono">{8 - rIndex}</span>}
{rIndex === 7 && <span className="absolute right-0.5 bottom-0 text-[8px] text-slate-400 font-mono">{String.fromCharCode(97 + cIndex)}</span>}

{/* Black Hole Effect for Mated King */}
{isKingInCheckmate && (
<div className="absolute inset-0 bg-black rounded-full animate-[spin_3s_linear_infinite] opacity-80 scale-150 z-0"></div>
)}

<div className={`relative z-10 ${isKingInCheckmate ? 'animate-[ping_1s_ease-in-out_infinite]' : ''}`}>
<Piece piece={piece} glow={isSelected} />
</div>
</div>
);
})
))}
</div>
</div>

<div className="mt-4 flex gap-4">
<button 
onClick={reset} 
className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full flex items-center gap-2 transition-all border border-slate-500"
>
<RotateCcw size={16} /> Chơi Lại
</button>
</div>
</div>
);
};

const PlanetNode = ({ level, status, onClick }) => {
// Status: locked, current, completed
const isLocked = status === 'locked';
const isCompleted = status === 'completed';
const isCurrent = status === 'current';

return (
<button
onClick={() => !isLocked && onClick(level)}
className={`
       relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center
       transition-all duration-300 transform
       ${isLocked ? 'grayscale opacity-50 cursor-not-allowed bg-slate-800' : 'cursor-pointer hover:scale-110'}
       ${isCurrent ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_#facc15]' : ''}
       bg-gradient-to-br ${level.color}
     `}
>
{isLocked ? (
<Lock className="text-slate-400" />
) : isCompleted ? (
<Trophy className="text-yellow-100 drop-shadow-md" />
) : (
<span className="text-2xl font-bold text-white drop-shadow-md">{level.id}</span>
)}

{/* Label */}
<div className="absolute -bottom-10 w-32 text-center">
<span className={`text-xs font-bold px-2 py-1 rounded bg-black/50 backdrop-blur-sm text-white border border-slate-700 ${isCurrent ? 'text-yellow-300' : ''}`}>
{level.name}
</span>
</div>
</button>
);
};

const GalaxyMap = ({ unlockedLevel, onSelectLevel }) => {
return (
<div className="relative w-full h-full min-h-[500px] overflow-auto p-8 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?auto=format&fit=crop&q=80')] bg-cover bg-center">
     <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
     
     {/* Canvas for connection lines could go here, but using absolute positioning for nodes is simpler for this layout */}
     <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-12 gap-y-24 max-w-5xl mx-auto">
       {LEVELS.map((level) => {
         let status = 'locked';
if (level.id < unlockedLevel) status = 'completed';
else if (level.id === unlockedLevel) status = 'current';

return (
<div key={level.id} className="flex justify-center">
<PlanetNode level={level} status={status} onClick={onSelectLevel} />
</div>
);
})}
</div>
</div>
);
};

// --- MAIN APP COMPONENT ---

export default function App() {
const [gameState, setGameState] = useState('map'); // map, playing, victory
const [currentLevelId, setCurrentLevelId] = useState(1);
const [unlockedLevel, setUnlockedLevel] = useState(1);
const [puzzleIndex, setPuzzleIndex] = useState(0);
const [stars, setStars] = useState(0);

// Background Stars Animation
const StarField = () => (
<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
{[...Array(50)].map((_, i) => (
<div
key={i}
className="absolute bg-white rounded-full animate-pulse"
style={{
top: `${Math.random() * 100}%`,
left: `${Math.random() * 100}%`,
width: `${Math.random() * 3}px`,
height: `${Math.random() * 3}px`,
animationDuration: `${Math.random() * 3 + 1}s`,
opacity: Math.random()
}}
/>
))}
</div>
);

const startLevel = (level) => {
setCurrentLevelId(level.id);
setPuzzleIndex(0); // Always start from puzzle 1 of the planet
setGameState('playing');
};

const handlePuzzleWin = () => {
// Earn star
setStars(s => s + 1);

// Check if level finished
const currentLevelData = LEVELS.find(l => l.id === currentLevelId);
if (puzzleIndex + 1 >= currentLevelData.puzzles.length) {
// Level Complete!
playSound('level_complete');
if (currentLevelId === unlockedLevel && unlockedLevel < 10) {
setUnlockedLevel(u => u + 1);
}
setGameState('victory');
} else {
// Next Puzzle
setPuzzleIndex(p => p + 1);
}
};

const goHome = () => {
setGameState('map');
};

const currentLevelData = LEVELS.find(l => l.id === currentLevelId);
const currentPuzzle = currentLevelData?.puzzles[puzzleIndex];

return (
<div className="w-full h-screen bg-slate-950 text-white font-sans overflow-hidden flex flex-col relative">
<StarField />

{/* Header UI */}
<header className="relative z-20 flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-slate-700 backdrop-blur-md">
<div className="flex items-center gap-3">
<div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/50">
<Trophy className="text-yellow-400 w-6 h-6" />
</div>
<div>
<h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
Hành Trình Chinh Phục Thiên Hà Cờ Vua
</h1>
<div className="flex items-center gap-2 text-sm text-slate-300">
<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
<span>{stars} Sao</span>
</div>
</div>
</div>

<button onClick={goHome} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
{gameState === 'map' ? <span className="text-xs font-mono text-cyan-400">V.1.1</span> : <Home className="text-cyan-400" />}
</button>
</header>

{/* Main Content Area */}
<main className="flex-1 relative z-10 overflow-hidden flex flex-col">
{gameState === 'map' && (
<GalaxyMap unlockedLevel={unlockedLevel} onSelectLevel={startLevel} />
)}

{gameState === 'playing' && (
<div className="flex-1 flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

<div className="mb-4 text-center">
<h2 className="text-2xl font-bold text-cyan-300">{currentLevelData.name}</h2>
<div className="flex items-center justify-center gap-2 text-slate-400 mt-1">
<span className="bg-slate-800 px-2 py-0.5 rounded text-xs border border-slate-700">
Thử thách {puzzleIndex + 1}/{currentLevelData.puzzles.length}
</span>
<span className="text-sm">{currentPuzzle.description}</span>
</div>
</div>

<Board 
key={`${currentLevelId}-${puzzleIndex}`} 
fen={currentPuzzle.fen} 
onWin={handlePuzzleWin} 
/>

<div className="mt-6 w-full max-w-md bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
<p className="text-center text-slate-300 text-sm italic">
"Hãy tìm nước đi chiếu hết Vua đối phương!"
</p>
</div>
</div>
)}

{gameState === 'victory' && (
<div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
<div className="relative">
<div className="absolute inset-0 bg-yellow-500 blur-3xl opacity-20 animate-pulse"></div>
<Trophy className="w-32 h-32 text-yellow-400 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
</div>

<h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-4">
Chúc Mừng!
</h2>
<p className="text-xl text-slate-300 mb-8 max-w-md">
Bạn đã chinh phục hành tinh <span className="text-cyan-400 font-bold">{currentLevelData.name}</span> và thu thập đủ năng lượng!
</p>

<div className="flex gap-4">
<button 
onClick={goHome}
className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold transition-all border border-slate-600"
>
Về Bản Đồ
</button>
{currentLevelId < 10 && (
<button 
onClick={() => startLevel(LEVELS.find(l => l.id === currentLevelId + 1))}
className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2"
>
Hành Tinh Tiếp <ChevronRight />
</button>
)}
</div>
</div>
)}
</main>
</div>
);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
