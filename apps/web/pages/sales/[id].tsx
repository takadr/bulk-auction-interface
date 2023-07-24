import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import SaleTemplateV1, {
  SkeletonSale,
} from "ui/components/templates/SaleTemplateV1";
import Layout from "ui/components/layouts/layout";
import MetaTags from "ui/components/MetaTags";
import { useQuery } from "@apollo/client";
import { GET_SALE_QUERY } from "lib/apollo/query";
import useSWRMetaData from "ui/hooks/useSWRMetaData";
import Render500 from "ui/components/errors/500";
import Render404 from "ui/components/errors/404";
import { useLocale } from "ui/hooks/useLocale";

export default function SalePage() {
  const { address, isConnected, connector } = useAccount();
  const router = useRouter();
  const { id } = router.query;
  const { t, locale } = useLocale();

  // TODO Get template address from contractAddress
  // Switch template by using template address
  const {
    data: saleData,
    loading,
    error: apolloError,
    refetch,
  } = useQuery(GET_SALE_QUERY, { variables: { id: id as string } });
  const {
    data: metaData,
    mutate,
    error: dynamodbError,
  } = useSWRMetaData(id as string);

  if (apolloError || dynamodbError)
    return (
      <Layout>
        <Render500 error={apolloError || dynamodbError} />
      </Layout>
    );

  if (loading || !metaData)
    return (
      <Layout>
        <SkeletonSale />
      </Layout>
    );

  if (!saleData)
    return (
      <Layout>
        <Render404 />
      </Layout>
    );

  return (
    <Layout>
      <MetaTags
        title={`${
          metaData.metaData.title ? metaData.metaData.title : t('SALES')
        } | ${t('APP_NAME')}`}
        description={
          metaData.metaData.description
            ? metaData.metaData.description
            : t('AN_INCLUSIVE_AND_TRANSPARENT_TOKEN_LAUNCHPAD')
        }
        image={metaData.metaData.logoURL && metaData.metaData.logoURL}
      />
      <SaleTemplateV1
        sale={saleData.sale}
        refetchSale={refetch}
        metaData={metaData.metaData}
        refetchMetaData={mutate}
        contractAddress={id as `0x${string}`}
        address={address}
      />
    </Layout>
  );
}
