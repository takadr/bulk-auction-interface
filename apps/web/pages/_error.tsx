import { NextPageContext } from "next";
import Render404 from "ui/components/errors/404";
import Render500 from "ui/components/errors/500";
import Layout from "ui/components/layouts/layout";

function CustomError({
  statusCode,
  err,
}: {
  statusCode: number;
  err?: Error & {
    statusCode?: number;
  };
}) {
  if (statusCode === 404) {
    return (
      <Layout>
        <Render404 />
      </Layout>
    );
  } else if (err) {
    return (
      <Layout>
        <Render500 error={err} />
      </Layout>
    );
  } else {
    const error = new Error("Something went wrong...");
    return (
      <Layout>
        <Render500 error={error} />
      </Layout>
    );
  }
}

CustomError.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err };
};

export default CustomError;
