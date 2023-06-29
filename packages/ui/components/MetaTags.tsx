import Head from "next/head";
import bgImage from "assets/images/background_sky-min.png";

export default function MetaTags({
  title = "Bulksale maker(仮)",
  description = "An inclusive and transparent token launchpad,\n offering a permissionless and fair launch model.",
  site_name = "Bulksale maker(仮)",
  image = undefined,
  children,
}: {
  title?: string;
  description?: string;
  site_name?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={site_name} />
      <meta property="og:image" content={image ? image : `${bgImage.src}`} />
      <meta name="twitter:card" content="summary" />
      {/* <meta name="twitter:site" content="@" /> */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image ? image : `${bgImage.src}`} />
      <link rel="icon" href="/favicon.ico" />
      {!!children && children}
    </Head>
  );
}
