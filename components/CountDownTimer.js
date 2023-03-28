import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const renderTime = (dimension, time, lineHeight) => {
  return (
    <div className={`time-wrapper ${lineHeight}`}>
      <div className="time">{time}</div>
      <div>{dimension}</div>
    </div>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

export default function CountDownTimer({endTime, fontSize, size, lineHeight}) {
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
      <CountdownCircleTimer {...timerProps} colors="#004EFC" duration={daysDuration} initialRemainingTime={remainingTime}>
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("days", getTimeDays(daysDuration - elapsedTime),lineHeight )}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#004EFC"
        duration={daySeconds}
        initialRemainingTime={remainingTime % daySeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("hours", getTimeHours(daySeconds - elapsedTime), lineHeight)}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#004EFC"
        duration={hourSeconds}
        initialRemainingTime={remainingTime % hourSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("min", getTimeMinutes(hourSeconds - elapsedTime), lineHeight)}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors="#004EFC"
        duration={minuteSeconds}
        initialRemainingTime={remainingTime % minuteSeconds}
        onComplete={(totalElapsedTime) => ({
          shouldRepeat: remainingTime - totalElapsedTime > 0,
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime("sec", getTimeSeconds(elapsedTime), lineHeight)}</span>}
      </CountdownCircleTimer>
    </div>
  );
}
