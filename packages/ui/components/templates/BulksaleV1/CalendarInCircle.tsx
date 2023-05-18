import { format } from 'date-fns';
import { Circle } from 'rc-progress';
// import styled from 'styled-components';
import { chakra, BoxProps } from '@chakra-ui/react';
import CountdownCalendar from './CountdownCalendar';

// const RightCirclePosition = styled.div`
//   position: relative;
//   min-width: 600px;
//   margin-left: 50px;

//   @media (max-width: 600px) {
//     width: 100%;
//     min-width: 0;
//     margin-left: 0;
//   }
// `;

// const InnerPosition = styled.span`
//   display: inline-block;
//   position: absolute;
//   top: 200px;
//   left: 50px;

//   @media (max-width: 600px) {
//     top: 25%;
//     left: 10%;
//   }
// `;

// const BeforeStartStatement = styled.span`
//   display: inline-block;
//   position: absolute;
//   font-size: 1.8rem;
//   font-weight: bold;
//   top: 40%;
//   left: 50px;

//   @media (max-width: 600px) {
//     left: 10px;
//   }
// `;

type Props = {
  unixStartDate: number;
  unixEndDate: number;
};

export default function CalendarInCircle({
  unixStartDate,
  unixEndDate,
  ...boxProps
}: Props & BoxProps) {
  function getRestTermPercetage() {
    const now = Math.floor(Date.now() / 1000);
    const duration = unixEndDate - unixStartDate;
    const rest = now - unixStartDate;
    return rest > 0 ? (rest / duration) * 100 : 0;
  }

  return (
    <chakra.div {...boxProps}>
      <chakra.div position={'relative'}>
        <Circle
          percent={getRestTermPercetage()}
          strokeWidth={4}
          strokeColor={'#48BB78'}
        />

        {unixStartDate * 1000 > Date.now() ? (
          <chakra.div textAlign={'center'} position={'absolute'} margin={'auto'} top={0} bottom={0} left={0} right={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <chakra.p >Starting at</chakra.p>
            <chakra.p>{format(unixStartDate * 1000, 'yyyy/MM/dd HH:mm(z)')}</chakra.p>
          </chakra.div>
        ) : (
          <chakra.div position={'absolute'} margin={'auto'} top={0} bottom={0} left={0} right={0} display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <CountdownCalendar unixEndDate={unixEndDate}></CountdownCalendar>
          </chakra.div>
        )}
      </chakra.div>
    </chakra.div>
  );
}
