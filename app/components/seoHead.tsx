// components/SEOHead.tsx
import Head from 'next/head';

const SEOHead = ({
  title = 'Home - Western Cyber Society | Innovate with Us',
  description = 'Begin your innovation journey with WCS. Join our cyber society classes, engage in exciting tech events, and connect with like-minded individuals.',
  url = 'https://www.westerncybersociety.ca', // Adjust for SSR
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="cyber society class, cyber society, western cyber society, join western cyber society, WCS, join WCS, developers society, Western AI, Toronto Tech Expo, join Toronto Tech Expo"
      />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://www.westerncybersociety.ca/_next/image?url=%2FwcsLogo.png&w=128&q=75" />
    </Head>
  );
};

export default SEOHead;
