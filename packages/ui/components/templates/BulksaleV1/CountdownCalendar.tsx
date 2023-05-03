// import { format } from 'date-fns';

// import styled from 'styled-components';
// import useInterval from '../../../hooks/useInterval';
import { useState } from 'react';
import { Circle } from 'rc-progress';
import { chakra, Spinner, Toast, Link } from "@chakra-ui/react";
import { useInterval } from '@chakra-ui/react';
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, getEtherscanLink } from "../../../utils";

// const CountdownPanel = styled.div`
//   background: white;
//   display: inline-block;
//   margin: 10px;
//   min-width: 100px;
//   padding: 20px 0;
//   text-align: center;

//   .countdown-value {
//     color: black;
//     font-size: 2rem;
//     margin-bottom: 10px;
//   }
//   .countdown-unit {
//     color: black;
//     text-transform: capitalize;
//   }

//   @media (max-width: 600px) {
//     min-width: 50px;
//   }
// `;

// const Statement = styled.p`
//   font-size: 1.5rem;
//   font-weight: bold;

//   @media (max-width: 600px) {
//     font-size: 1rem;
//   }
// `;

type Props = {
  unixEndDate: number;
};

type Countdown = { days: string; hours: string; mins: string; secs: string };
const initialCountdown = {
  days: '0',
  hours: '0',
  mins: '0',
  secs: '0',
};

export default function CountdownCalendar({ unixEndDate }: Props) {
  const [countdown, setCountdown] = useState(initialCountdown);

  useInterval(() => {
    if (!unixEndDate) {
      setCountdown({ days: '?', hours: '?', mins: '?', secs: '?' });
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const newCountdown = getCountdown(unixEndDate - now);
    setCountdown(newCountdown);
  }, 500);

  return (
    <div>
      <chakra.div>
        {unixEndDate * 1000}
      </chakra.div>

      <chakra.div>
        <div>{countdown.days}</div>
        <div>DAYS</div>
      </chakra.div>
      
      <chakra.div>
        <div>{countdown.hours}</div>
        <div>HOURS</div>
      </chakra.div>

      <chakra.div>
        <div>{countdown.mins}</div>
        <div>MINS</div>
      </chakra.div>

      <chakra.div>
        <div>{countdown.secs}</div>
        <div>SECS</div>
      </chakra.div>

      {unixEndDate * 1000 < Date.now() && (
        <chakra.div>
            終了しました🎉
        </chakra.div>
      )}
    </div>
  );
}

function getCountdown(duration: number): Countdown {
  let restSec = duration;
  const countdown: Countdown = { ...initialCountdown };
  if (restSec >= 86400) {
    countdown.days = Math.floor(restSec / 86400).toString();
    restSec = restSec % 86400;
  }
  if (restSec >= 3600) {
    countdown.hours = Math.floor(restSec / 3600).toString();
    restSec = restSec % 3600;
  }
  if (restSec >= 60) {
    countdown.mins = Math.floor(restSec / 60).toString();
    restSec = restSec % 60;
  }
  countdown.secs = restSec > 0 ? restSec.toString() : '0';

  return countdown;
}
