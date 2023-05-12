import { useEffect } from 'react';
import { useFormik, FormikProps } from 'formik';
import { MetaData } from '../../types/BulksaleV1';

export default function useBulksaleV1MetaForm({contractId, onSubmitSuccess, onSubmitError}: {
    contractId?: `0x${string}`,
    onSubmitSuccess?: (result: Response) => void,
    onSubmitError?: (e: any) => void,
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
        console.log(Object.assign(auctionData, {id: auctionData.id}))
        try {
            const result = await fetch('/api/auctions', {
                // credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(auctionData),
                // body: JSON.stringify(Object.assign(auctionData, {id: contractId}))
            })
            onSubmitSuccess && onSubmitSuccess(result)
        } catch(e: any) {
            console.log(e)
            onSubmitError && onSubmitError(e);
        }
    };

    const validate = () => {
        const errors: any = {};
        // TODO
        return errors;
    };

    const formikProps = useFormik({
        enableReinitialize: true,
        initialValues: initMetaData,
        onSubmit: handleSubmit,
        validate
    });

    return {
        formikProps
    }
}