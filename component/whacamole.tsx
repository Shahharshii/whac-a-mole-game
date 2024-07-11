"use client";
import { useEffect, useState } from 'react';

const WhacAMole = () => {
    const [score, setScore] = useState<number>(0);
    const [currentMole, setCurrentMole] = useState<number | null>(null);
    const [currentPlant, setCurrentPlant] = useState<number | null>(null);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds timer

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
        const cursor = document.querySelector('.cursor') as HTMLElement;

        const handleMouseMove = (e: MouseEvent) => {
            cursor.style.top = `${e.pageY}px`;
            cursor.style.left = `${e.pageX}px`;
        };

        const handleMouseDown = () => {
            cursor.classList.add('active');
        };

        const handleMouseUp = () => {
            cursor.classList.remove('active');
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-lg text-center">
                <div className='flex justify-center items-center'>
                    <h1 className="text-2xl font-bold mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '40px', color: 'purple' }}>Whac a Mole</h1>
                    <h2 className="text-xl mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '20px', color: 'purple' }}>Score: {score}</h2>
                    <h2 className="text-xl mb-4 text-white" style={{ fontWeight: 'bold', fontSize: '20px', color: 'purple' }}>Time Left: {timeLeft}s</h2>
                </div>

                <div id="board" className="grid grid-cols-3 gap-2 justify-center">
                    {Array.from({ length: 9 }, (_, index) => (
                        <div
                            key={index}
                            id={`tile-${index}`}
                            className={'w-24 h-24 bg-gray-200 border border-gray-400 flex justify-center items-center cursor-pointer relative'}
                            onClick={() => handleTileClick(index)}
                        >
                            {currentMole === index && (
                                <img
                                    src="/images/monty-mole.png"
                                    alt="Mole"
                                    className="w-16 h-16 absolute right-0"
                                    style={{ transform: 'translateX(50%)' }}
                                />
                            )}
                            {currentPlant === index && (
                                <img
                                    src="/images/piranha-plant.png"
                                    alt="Plant"
                                    className="w-16 h-16 absolute right-0"
                                    style={{ transform: 'translateX(50%)' }}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {gameOver && <h2 className="text-xl mt-4 font-bold text-white" style={{ fontWeight: 'bold', fontSize: '30px', color: 'purple' }}>Game Over! Your final score is: {score}</h2>}
            </div>
            <div className="cursor"></div>
        </div>
    );
};

export default WhacAMole;
