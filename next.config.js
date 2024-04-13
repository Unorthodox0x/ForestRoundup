
const generateCsp = () => {
const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const production = process.env.NODE_ENV === 'production';

  const cspHeader = `
    default-src 'self' https://explorer-api.walletconnect.com/w3m/v1/getWalletImage/ http://fonts.googleapis.com/css?family=Lato;
    script-src 'self' ${production ? '' : "'unsafe-eval'"} 'nonce-${nonce}' 'strict-dynamic';
    connect-src 'self' wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org/rpc https://rpc.sepolia.org/ https://mainnet.aurora.dev/ https://cloudflare-eth.com/ https://arb1.arbitrum.io/rpc https://api.avax.network/ext/bc/C/rpc https://explorer-api.walletconnect.com/w3m/v1/getDesktopListings;
    frame-src https://verify.walletconnect.com/ https://verify.walletconnect.org/;
    style-src 'self' ${production ? '' : "'unsafe-inline'"} http://fonts.googleapis.com/ 'nonce-${nonce}';
    img-src 'self' blob: data: https://explorer-api.walletconnect.com/w3m/v1/getWalletImage/;
    font-src 'self' https://fonts.gstatic.com/s/lato/v24/ http://fonts.gstatic.com/s/lato/v24/;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  return contentSecurityPolicyHeaderValue;
};

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function getConfig(config) {
  return config;
}

/** @type {import("next").NextConfig} */
module.exports = getConfig({

  /**
   * Dynamic configuration available for the browser and server.
   * @link https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
   */
  publicRuntimeConfig: { },

  typescript: {
    ignoreBuildErrors: true,
  },
  
  /** We run eslint as a separate task in CI */
  // eslint: { ignoreDuringBuilds: !!process.env.CI },

  poweredByHeader: false,
  swcMinify: true,
  images: {
    domains: [    ],
  },

   /**
    * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
    * out.
    * @see https://github.com/vercel/next.js/issues/41980
    * 
    * @requirement Rainbowkit  
    * https://github.com/rainbow-me/rainbowkit/blob/main/examples/with-next-app/next.config.js
    */
    reactStrictMode: true,
    webpack: (config) => {
      config.externals.push('pino-pretty', 'lokijs', 'encoding');
      return config;
    },
    i18n: {
      locales: ['en-US'],
      defaultLocale: 'en-US',
    },

  // Adding Content Security Policies:
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: "Access-Control-Allow-Origin", value: "https://www.checkout.etherjolt.com/" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { 
            key: "Access-Control-Allow-Headers", 
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
          {
            key: 'Content-Security-Policy',
            value: generateCsp()
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: "X-XXS-Protection",
            value: "1; mode=block"
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload"
          },
        ],
      },
    ];
  },
});
