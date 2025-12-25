import { HelmetProvider, Helmet } from "react-helmet-async";
import { ReactNode } from "react";

const PageMeta = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
  </Helmet>
);

export const AppWrapper = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>{children}</HelmetProvider>
);

export default PageMeta;
