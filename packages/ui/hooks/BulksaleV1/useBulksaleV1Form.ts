import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { utils } from 'ethers';
import { useFormik, FormikProps } from 'formik';
import useApprove from '../useApprove';
import useTokenBasicInfo from '../useTokenBasicInfo';
import { Sale } from '../../types/BulksaleV1';
import Big, { multiply } from '../../utils/bignumber';
import FactoryABI from '../../constants/abis/Factory.json';
import 'rsuite/dist/rsuite-no-reset.min.css';

const now = new Date().getTime();
export default function useBulksaleV1Form({
    address, 
    onSubmitSuccess, 
    onSubmitError,
    onContractWriteSuccess,
    onContractWriteError,
    onWaitForTransactionSuccess,
    onWaitForTransactionError,
}: {
    address: `0x${string}`,
    onSubmitSuccess?: (result: any) => void, // TODO use SendTransactionResult
    onSubmitError?: (e: any) => void,
    onContractWriteSuccess?: (result: any) => void,
    onContractWriteError?: (e: any) => void,
    onWaitForTransactionSuccess?: (result: any) => void,
    onWaitForTransactionError?: (e: any) => void,
}): 
{
    formikProps: FormikProps<Sale>,
    approvals: ReturnType<typeof useApprove>,
    prepareFn: any,
    writeFn: ReturnType<typeof useContractWrite>,
    waitFn: ReturnType<typeof useWaitForTransaction>,
    tokenData: {
        name: string | undefined,
        symbol: string | undefined,
        decimals: number | undefined,
    },
} {
    const emptySale: Sale = {
        token: null,
        startingAt: now + (60 * 60 * 24 * 7 * 1000),
        eventDuration: 60 * 60 * 24 * 7,
        lockDuration: 60 * 60 * 24 * 7,
        expirationDuration: 60 * 60 * 24 * 30,
        distributeAmount: 1,
        minimalProvideAmount: 0.01,
        owner: address, //TODO
        feeRatePerMil: 1
    }

    const validate = (values: Sale) => {
        const errors: any = {};
        // TODO
        // if (!values.name) {
        //     errors.name = 'Name is required';
        // } else if (values.name.length > MAX_LENGTH) {
        //     errors.name = `Name must be shorter than ${MAX_LENGTH}`;
        // }

        // if (!values.symbol) {
        //     errors.symbol = 'Symbol is required';
        // } else if (values.symbol.length > MAX_LENGTH) {
        //     errors.symbol = `Symbol must be shorter than ${MAX_LENGTH}`;
        // }

        // if (!values.initialSupply) {
        //     errors.initialSupply = 'Initial supply is required';
        // } else if (values.initialSupply) {
        //     errors.initialSupply = `Initial supply must be shorter than ${MAX_LENGTH}`;
        // }
      
        return errors;
    };

    const handleSubmit = async (token: Sale) => {
        if(!writeFn || !writeFn.writeAsync) {
            // TODO Error
            return;
        }
        try {
            const result = await writeFn.writeAsync();
            onSubmitSuccess && onSubmitSuccess(result);
            // result.hash
        } catch(e: any) {
            onSubmitError && onSubmitError(e);
        }
    }

    const formikProps = useFormik<Sale>({
        enableReinitialize: true,
        initialValues: Object.assign({}, emptySale),
        onSubmit: handleSubmit,
        validate
    });

    const [debouncedSale] = useDebounce(formikProps.values, 500);
    const approvals = useApprove(debouncedSale.token, address as `0x${string}`, process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`);
    const tokenData = useTokenBasicInfo(debouncedSale.token);
    // const allowanceReadFn = useContractRead({
    //     address: debouncedSale.token ? debouncedSale.token : '0x',
    //     abi: erc20ABI,
    //     functionName: 'allowance',
    //     args: [address as `0x${string}`, process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`],
    // })

    const prepareFn = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, //factory
        abi: FactoryABI,
        functionName: 'deploySaleClone',
        args: [
            "0x53616c6554656d706c6174655631000000000000000000000000000000000000",
            debouncedSale.token,
            debouncedSale.owner,
            multiply(debouncedSale.distributeAmount, tokenData.decimals ? Big(10).pow(tokenData.decimals) : 0).toString(),
            Math.round(debouncedSale.startingAt / 1000),
            debouncedSale.eventDuration,
            multiply(debouncedSale.minimalProvideAmount, Big(10).pow(18)).toString(), // ETH
        ],
    })
    
    const writeFn = useContractWrite({
        ...prepareFn.config,
        onSuccess(data) {
            // console.log('Submitted!', data)
            // setWaitingTransaction(waitFn);
            // console.log(waitingTransaction)
            onContractWriteSuccess && onContractWriteSuccess(data);
        },
        onError(e: Error) {
            console.log(e.message)
            onContractWriteError && onContractWriteError(e)
        },
    })
    // TODO 
    // Add tx hash with status loading to the store

    const waitFn = useWaitForTransaction({
        hash: writeFn.data?.hash,
        onSuccess(data) {
            console.log('Transaction Confirmed!', data)
            onWaitForTransactionSuccess && onWaitForTransactionSuccess(data);
            // TODO
            // Modify tx status to confirmed in the store
            // const newTxs = [...saleTxs.txs, data];
            // setSaleTxs(Object.assign(saleTxs, {txs: newTxs}));
        },
        onError(e: Error) {
            console.log(e.message)
            onWaitForTransactionError && onWaitForTransactionError(e);
        }
    })

    return {
        formikProps,
        approvals,
        prepareFn,
        writeFn,
        waitFn,
        tokenData,
    }
}