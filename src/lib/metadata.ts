import { Metadata } from 'next';
import { SEO_DEFAULTS } from './constants';

export const MetadataTemplates = {
  home: (): Metadata => ({
    title: 'Home',
    description: SEO_DEFAULTS.DESCRIPTION,
    keywords: 'ecommerce, products, shopping, online store',
    openGraph: {
      title: `Home | ${SEO_DEFAULTS.SITE_NAME}`,
      description: SEO_DEFAULTS.DESCRIPTION,
      url: '/',
      type: 'website',
      images: [
        {
          url: 'public/images/logo.svg',
          width: 1200,
          height: 630,
          alt: SEO_DEFAULTS.SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Home | ${SEO_DEFAULTS.SITE_NAME}`,
      description: SEO_DEFAULTS.DESCRIPTION,
    },
  }),

  products: (): Metadata => ({
    title: 'Products',
    description: 'Browse our wide selection of products across various categories.',
    keywords: 'products, shop, ecommerce, electronics, clothing, books, categories',
    openGraph: {
      title: `Products | ${SEO_DEFAULTS.SITE_NAME}`,
      description: 'Browse our wide selection of products across various categories.',
      url: '/products',
      type: 'website',
      images: [
        {
          url: 'public/images/logo.svg',
          width: 1200,
          height: 630,
          alt: 'Browse Products',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Products | ${SEO_DEFAULTS.SITE_NAME}`,
      description: 'Browse our wide selection of products across various categories.',
    },
    other: {
      'script:ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Products',
        description: 'Browse our wide selection of products across various categories.',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
        mainEntity: {
          '@type': 'ItemList',
          name: 'Product Catalog',
        },
      }),
    },
  }),
};