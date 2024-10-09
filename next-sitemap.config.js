/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: 'https://www.westerncybersociety.ca',
    generateRobotsTxt: true,
    exclude: ['/sign-in', '/sign-up', '/myevents', '/profile', '/contact'], // pages to exclude
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/', // Allow all crawlers to access all pages except those excluded
        },
        {
          userAgent: 'Googlebot',
          allow: '/', // Specific rules for Googlebot (can be customized)
        },
        {
          userAgent: '*',
          disallow: ['/sign-in', '/sign-up', '/myevents', '/profile', '/contact'], // Block specific pages
        },
      ],
      additionalSitemaps: [
        'https://www.westerncybersociety.ca/sitemap-0.xml',
      ],
    },
  };

module.exports = config;
