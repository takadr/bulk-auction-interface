import { useEffect } from "react";
import { useFormik, FormikProps } from "formik";
import { MetaData, validateMetaData } from "lib/types/Auction";

export default function useMetaDataForm({
  contractId,
  minRaisedAmount,
  onSubmitSuccess,
  onSubmitError,
  auctionMetaData,
}: {
  contractId?: `0x${string}`;
  minRaisedAmount: number; // Numbers that take decimals into account. e.g. 10
  onSubmitSuccess?: (result: Response) => void;
  onSubmitError?: (e: any) => void;
  auctionMetaData?: MetaData;
}): {
  formikProps: FormikProps<MetaData>;
} {
  useEffect(() => {
    formikProps.setFieldValue("id", contractId);
  }, [contractId]);

  const initMetaData: MetaData = {
    id: "",
    title: "",
    description: "",
    terms: "",
    projectURL: "",
    logoURL: "",
    otherURL: "",
    targetTotalRaised: minRaisedAmount,
    maximumTotalRaised: minRaisedAmount,
  };

  const handleSubmit = async (auctionData: MetaData) => {
    // console.log(Object.assign(auctionData, {id: auctionData.id}))
    try {
      const result = await fetch("/api/metadata", {
        credentials: "same-origin",
        method: auctionMetaData ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auctionData),
      });
      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(`${errorText}`);
      }
      // if (!result.ok) throw new Error(result.statusText);
      onSubmitSuccess && onSubmitSuccess(result);
    } catch (e: any) {
      onSubmitError && onSubmitError(e);
    }
  };

  const formikProps = useFormik({
    enableReinitialize: true,
    initialValues: auctionMetaData ? auctionMetaData : initMetaData,
    onSubmit: handleSubmit,
    validate: (value: MetaData) => validateMetaData(value, minRaisedAmount),
  });

  return {
    formikProps,
  };
}
