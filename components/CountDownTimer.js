import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const renderTime = (dimension, time) => {
  return (
    <div className="time-wrapper">
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function CountDownTimer({endTime, fontSize, size}) {
  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  //const endTime = stratTime + 243248; // use UNIX timestamp in seconds

  const timerProps = {
    isPlaying: true,
    size: size,
    strokeWidth: 0,
  };
  const remainingTime = endTime - stratTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <div className={`coutndown ${fontSize}`}>
      <CountdownCircleTimer {...timerProps} colors="#7E2E84" duration={daysDuration} initialRemainingTime={remainingTime}>
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("days", getTimeDays(daysDuration - elapsedTime))}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#D14081"
        duration={daySeconds}
        initialRemainingTime={remainingTime % daySeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("hours", getTimeHours(daySeconds - elapsedTime))}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#EF798A"
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("min", getTimeMinutes(hourSeconds - elapsedTime))}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#218380"
        duration={minuteSeconds}
        initialRemainingTime={remainingTime % minuteSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > 0,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("sec", getTimeSeconds(elapsedTime))}</span>}
      </CountdownCircleTimer>
    </div>
  );
}
