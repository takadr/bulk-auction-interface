import { useEffect } from 'react';
import { useFormik, FormikProps } from 'formik';
import { MetaData } from '../../types/BulksaleV1';
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

    const validate = (auctionData: MetaData) => {
        const errors: any = {};
        if(!auctionData.id) {
            errors.id = 'Contract address is required';
        }
        if(auctionData.title && auctionData.title.length > 100) {
            errors.title = 'Max length is 100';
        }
        if(auctionData.description && auctionData.description.length > 1000) {
            errors.description = 'Max length is 1000';
        }
        if(auctionData.terms && auctionData.terms.length > 1000) {
            errors.terms = 'Max length is 1000';
        }
        if(auctionData.interimGoalAmount && auctionData.interimGoalAmount > auctionData.finalGoalAmount) {
            errors.finalGoalAmount = 'Final Goal Amount must be bigger than Interim Goal Amount';
        }
        if(auctionData.projectURL && !URL_REGEX.test(auctionData.projectURL)){
            errors.projectURL = 'Invalid URL format'
        }
        if(auctionData.logoURL && !URL_REGEX.test(auctionData.logoURL)){
            errors.logoURL = 'Invalid URL format'
        }
        if(auctionData.otherURL && !URL_REGEX.test(auctionData.otherURL)){
            errors.otherURL = 'Invalid URL format'
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