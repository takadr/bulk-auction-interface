import { format } from 'date-fns';
import { useState } from 'react';
import { Circle } from 'rc-progress';
import { chakra, Spinner, Toast, Link, useInterval } from "@chakra-ui/react";
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, getEtherscanLink } from "../../../utils";

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
    <chakra.div>
      <chakra.div textAlign={'center'}>
        Until {format(unixEndDate * 1000, 'yyyy/MM/dd HH:mm(z)')}
      </chakra.div>

      <chakra.div display={'flex'} alignItems={'center'} justifyContent={'center'}>
        <chakra.div w={'25%'} textAlign={'center'}>
          <chakra.div fontSize={'2xl'}>{countdown.days}</chakra.div>
          <chakra.div fontSize={'sm'}>DAYS</chakra.div>
        </chakra.div>
        
        <chakra.div w={'25%'} textAlign={'center'}>
          <chakra.div fontSize={'2xl'}>{countdown.hours}</chakra.div>
          <chakra.div fontSize={'sm'}>HOURS</chakra.div>
        </chakra.div>

        <chakra.div w={'25%'} textAlign={'center'}>
          <chakra.div fontSize={'2xl'}>{countdown.mins}</chakra.div>
          <chakra.div fontSize={'sm'}>MINS</chakra.div>
        </chakra.div>

        <chakra.div w={'25%'} textAlign={'center'}>
          <chakra.div fontSize={'2xl'}>{countdown.secs}</chakra.div>
          <chakra.div fontSize={'sm'}>SECS</chakra.div>
        </chakra.div>
      </chakra.div>

      {unixEndDate * 1000 < Date.now() && (
        <chakra.div>
            Finished🎉
        </chakra.div>
      )}
    </chakra.div>
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
