

"use client";
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";

const WhacAMole = () => {
    const [score, setScore] = useState<number>(0);
    const [currentMole, setCurrentMole] = useState<number | null>(null);
    const [currentPlant, setCurrentPlant] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds timer
    const [isCursorInBoard, setIsCursorInBoard] = useState<boolean>(false);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    useEffect(() => {
        const gameInterval = setInterval(() => {
            if (!gameOver) {
                setMoleAndPlant();
            }
        }, 2000);

        const timerInterval = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setGameOver(true);
                    clearInterval(timerInterval);
                    clearInterval(gameInterval);
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
        };
    }, [gameOver]);

    useEffect(() => {
        const cursor = document.getElementById('hammer') as HTMLElement;

        const handleMouseMove = (e: MouseEvent) => {
            cursor.style.top = `${e.pageY}px`;
            cursor.style.left = `${e.pageX}px`;
        };

        const handleMouseDown = () => {
            setIsMouseDown(true);
        };

        const handleMouseUp = () => {
            setIsMouseDown(false);
        };

        const handleMouseEnter = () => {
            setIsCursorInBoard(true);
        };

        const handleMouseLeave = () => {
            setIsCursorInBoard(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        const board = document.getElementById('board');
        if (board) {
            board.addEventListener('mouseenter', handleMouseEnter);
            board.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            if (board) {
                board.removeEventListener('mouseenter', handleMouseEnter);
                board.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, []);

    const setMoleAndPlant = () => {
        let molePosition, plantPosition;
        do {
            molePosition = Math.floor(Math.random() * 9);
            plantPosition = Math.floor(Math.random() * 9);
        } while (molePosition === plantPosition);

        setCurrentMole(molePosition);
        setCurrentPlant(plantPosition);
    };

    const handleTileClick = (index: number) => {
        if (gameOver) return;

        if (index === currentMole) {
            setScore(score + 10);
            setCurrentMole(null); // Remove the mole after it's clicked
        } else if (index === currentPlant) {
            setScore(score - 5);
            setCurrentPlant(null); // Remove the plant after it's clicked
        }
    };

    const resetGame = () => {
        setScore(0);
        setCurrentMole(null);
        setCurrentPlant(null);
        setGameOver(false);
        setTimeLeft(60);
    };

    const hammerVariants = {
        initial: { rotate: 0 },
        active: { rotate: -45 },
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <div className='mb-5'>
                    <h1 className='font-semibold text-3xl'>Whac a Mole</h1>
                </div>
                <div className='flex justify-between w-full mt-1 mb-3'>
                    <h2 className='font-medium text-2xl'>Score: {score}</h2>
                    <h2 className='font-medium text-2xl'>Time Left: {timeLeft}s</h2>
                </div>

                <div id="board" className="bg-cover bg-center flex flex-wrap flex-row justify-center items-center grid-cols-3 gap-0 mx-auto w-[540px] h-[540px] border-4 border-yellow-300 rounded-lg bg-[#dfe1e8]">

                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            id={`tile-${index}`}
                            className="w-[120px] h-[120px] mx-auto bg-[url('/images/yellow_pipe.webp')] flex justify-center items-center bg-contain bg-center bg-no-repeat relative"
                            onClick={() => handleTileClick(index)}
                            style={{ margin: "0 0 -70px 0", width: "33.33%" }}
                        >
                            {currentMole === index && (
                                <img
                                    src="/images/monty-mole.png"
                                    alt="Mole"
                                    className="w-[100px] h-[100px] select-none absolute z-10 mole"
                                    style={{ bottom: '65%', left: '50%', transform: 'translateX(-50%)' }}
                                />
                            )}
                            {currentPlant === index && (
                                <img
                                    src="/images/piranha-plant.png"
                                    alt="Plant"
                                    className="w-[100px] h-[100px] select-none absolute z-10 plant"
                                    style={{ bottom: '75%', left: '50%', transform: 'translateX(-50%)' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {gameOver && (
                    <div>
                        <h2 className='font-semibold text-3xl'>Game Over! Your final score is: {score}</h2>
                        <button onClick={resetGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Restart Game</button>
                    </div>
                )}
            </div>
            <motion.div
                id="hammer"
                transition={{ duration: 0.1}}
                className={`cursor z-50 bg-no-repeat transition-transform duration-50 translate-x-[-20%] translate-y-[-20%] ${isCursorInBoard ? 'block' : 'hidden'}`}
                animate={isMouseDown ? "active" : "initial"}
                variants={hammerVariants}
            ></motion.div>
        </div>
    );
};

export default WhacAMole;


