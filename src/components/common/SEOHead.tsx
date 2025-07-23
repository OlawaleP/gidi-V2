import { Metadata } from 'next'

interface SEOData {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  price?: number
  currency?: string
  availability?: 'in_stock' | 'out_of_stock' | 'preorder'
}

interface SEOHeadProps extends SEOData {
  siteName?: string
}

export function generateSEOMetadata({
  title = 'gidi-e',
  description = 'Discover amazing products at great prices. Shop now for the latest deals and best quality items.',
  keywords = ['ecommerce', 'shopping', 'products', 'deals'],
  image = '/images/og-default.jpg',
  url = '',
  type = 'website',
  price,
  currency = 'USD',
  availability = 'in_stock',
  siteName = 'gidi-e'
}: SEOHeadProps = {}): Metadata {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  const keywordsString = keywords.join(', ')
  
  const openGraphType: 'website' | 'article' = type === 'product' ? 'website' : type

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywordsString,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: openGraphType, 
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: `@${siteName.toLowerCase().replace(/\s+/g, '')}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  if (type === 'product' && price) {
    metadata.other = {
      'product:price:amount': price.toString(),
      'product:price:currency': currency,
      'product:availability': availability,
    }
  }

  return metadata
}

export function SEOHead({ children }: { children?: React.ReactNode }) {
  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'E-commerce Platform',
            url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/products?search={search_term_string}`,
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </>
  )
}