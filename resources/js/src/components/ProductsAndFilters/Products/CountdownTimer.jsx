import { useState, useEffect } from 'react';

const CountdownTimer = ({ dateTo }) => {
  // Функция, която изчислява разликата между крайната дата и текущото време
  const calculateTimeLeft = () => {
        const difference = new Date(dateTo) - new Date();
        let timeLeft = {};
        
        if (difference > 0) {
        timeLeft = {
            дни: Math.floor(difference / (1000 * 60 * 60 * 24)),
            часа: Math.floor((difference / (1000 * 60 * 60)) % 24),
            минути: Math.floor((difference / (1000 * 60)) % 60),
        };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        // Обновяване на таймера на всяка секунда
        const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [dateTo]);

    // Създаваме масив с отделни компоненти за всеки интервал
    const timerComponents = Object.keys(timeLeft).map((interval) => (
        <span className='' key={interval}>
            {timeLeft[interval]} {interval}{' '}
        </span>
    ));

    return (
        <div className='text-center text-red-500'>
            {timerComponents.length > 0 && timerComponents }
        </div>
    );
};

export default CountdownTimer;
