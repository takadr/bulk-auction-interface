import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useBalance, erc20ABI, useContractRead } from 'wagmi';
import { useDebounce } from 'use-debounce';
import { useFormik, FormikProps } from 'formik';
import useApprove from '../useApprove';
import useTokenBasicInfo from '../useTokenBasicInfo';
import { SaleForm } from '../../types/BulksaleV1';
import Big, { multiply } from '../../utils/bignumber';
import FactoryABI from '../../constants/abis/Factory.json';
import { SALE_TEMPLATE_V1_NAME } from '../../constants';
import 'rsuite/dist/rsuite-no-reset.min.css';
import { BigNumber } from 'ethers';

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
    formikProps: FormikProps<SaleForm>,
    approvals: ReturnType<typeof useApprove>,
    prepareFn: any,
    writeFn: ReturnType<typeof useContractWrite>,
    waitFn: ReturnType<typeof useWaitForTransaction>,
    tokenData: {
        name: string | undefined,
        symbol: string | undefined,
        decimals: number | undefined,
    },
    balance: BigNumber | undefined
} {
    const emptySale: SaleForm = {
        token: null,
        startingAt: now + (60 * 60 * 24 * 7 * 1000),
        eventDuration: 60 * 60 * 24 * 7,
        distributeAmount: 1,
        minimalProvideAmount: 0.01,
        owner: address,
    }

    const validate = (values: SaleForm) => {
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

    const handleSubmit = async (sale: SaleForm) => {
        try {
            const result = await writeFn!.writeAsync!();
            onSubmitSuccess && onSubmitSuccess(result);
        } catch(e: any) {
            onSubmitError && onSubmitError(e);
        }
    }

    const formikProps = useFormik<SaleForm>({
        enableReinitialize: true,
        initialValues: Object.assign({}, emptySale),
        onSubmit: handleSubmit,
        validate
    });

    const [debouncedSale] = useDebounce(formikProps.values, 500);
    const approvals = useApprove(debouncedSale.token, address as `0x${string}`, process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`);
    const { data: balance } = useContractRead( {
        address: debouncedSale.token as `0x${string}`,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true
    })
    const tokenData = useTokenBasicInfo(debouncedSale.token);
    const prepareFn = usePrepareContractWrite({
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as `0x${string}`, //factory
        abi: FactoryABI,
        functionName: 'deploySaleClone',
        args: [
            SALE_TEMPLATE_V1_NAME,
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
            onContractWriteSuccess && onContractWriteSuccess(data);
        },
        onError(e: Error) {
            console.log(e.message)
            onContractWriteError && onContractWriteError(e)
        },
    })

    const waitFn = useWaitForTransaction({
        hash: writeFn.data?.hash,
        onSuccess(data) {
            onWaitForTransactionSuccess && onWaitForTransactionSuccess(data);
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
        balance
    }
}