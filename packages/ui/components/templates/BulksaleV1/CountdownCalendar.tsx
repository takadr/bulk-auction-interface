import { format } from 'date-fns';
import { useState } from 'react';
import { Circle } from 'rc-progress';
import { chakra, Spinner, Toast, Link, useInterval } from "@chakra-ui/react";
import { getExpectedAmount, getTargetPercetage, getFiatConversionAmount, getEtherscanLink, getCountdown } from "../../../utils";

type Props = {
  unixEndDate: number;
};

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
        <chakra.div fontSize={'lg'} mt={2} textAlign={'center'}>
            Finished 🎉
        </chakra.div>
      )}
    </chakra.div>
  );
}


