import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { chakra } from "@chakra-ui/react";
import { getCountdown } from "lib/utils";
import { useNow } from '../../../hooks/useNow';

type Props = {
  unixEndDate: number;
};

const initialCountdown = {
  days: '0',
  hours: '00',
  mins: '00',
  secs: '00',
};

export default function CountdownCalendar({ unixEndDate }: Props) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const [now] = useNow();

  useEffect(() => {
    if (!unixEndDate) {
      setCountdown({ days: '?', hours: '?', mins: '?', secs: '?' });
      return;
    }
    const newCountdown = getCountdown(unixEndDate - now);
    setCountdown(newCountdown);
  }, [now])

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


