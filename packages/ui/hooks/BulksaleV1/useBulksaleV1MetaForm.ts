import { useEffect } from 'react';
import { useFormik, FormikProps } from 'formik';
import { MetaData } from '../../types/BulksaleV1';

export default function useBulksaleV1MetaForm({contractId, onSubmitSuccess, onSubmitError, saleMetaData}: {
    contractId?: `0x${string}`,
    onSubmitSuccess?: (result: Response) => void,
    onSubmitError?: (e: any) => void,
    saleMetaData?: MetaData,
}): 
{
    formikProps: FormikProps<MetaData>
} {
    useEffect(() => {
        formikProps.setFieldValue('id', contractId)
    }, [contractId]);

    const initMetaData: MetaData = {
        id: '',
        title: '',
        description: '',
        terms: '',
        projectURL: '',
        logoURL: '',
        otherURLs: [],
        interimGoalAmount: 0,
        finalGoalAmount: 0
    };


    const handleSubmit = async (auctionData: MetaData) => {
        // console.log(Object.assign(auctionData, {id: auctionData.id}))
        try {
            const result = await fetch('/api/auctions', {
                credentials: 'same-origin',
                method: saleMetaData ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(auctionData),
                // body: JSON.stringify(Object.assign(auctionData, {id: contractId}))
            })
            if(!result.ok) throw new Error(result.statusText);
            onSubmitSuccess && onSubmitSuccess(result)
        } catch(e: any) {
            onSubmitError && onSubmitError(e);
        }
    };

    const validate = (auctionData: MetaData) => {
        const errors: any = {};
        if(!auctionData.id) {
            errors.id = 'Contract address is required';
        }
        return errors;
    };

    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: saleMetaData ? saleMetaData : initMetaData,
        onSubmit: handleSubmit,
        validate
    });

    return {
        formikProps
    }
}