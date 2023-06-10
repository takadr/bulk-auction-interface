import { useInterval } from '@chakra-ui/react';
import { useAtom } from "jotai";
import { nowAtom } from 'lib/store';

export const useNow = (): [number] => {
    const [now, setNow] = useAtom(nowAtom);
    useInterval(() => {
        setNow(Math.floor(Date.now() / 1000))
    }, 500);
    return [now]
}