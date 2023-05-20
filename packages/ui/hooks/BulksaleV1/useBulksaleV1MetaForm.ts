import { useEffect } from 'react';
import { useFormik, FormikProps } from 'formik';
import { MetaData, validateMetaData } from '../../types/BulksaleV1';
import { URL_REGEX } from '../../constants';

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
        otherURL: '',
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

    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: saleMetaData ? saleMetaData : initMetaData,
        onSubmit: handleSubmit,
        validate: validateMetaData
    });

    return {
        formikProps
    }
}