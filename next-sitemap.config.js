/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: 'https://www.westerncybersociety.ca',
    generateRobotsTxt: true,
    exclude: ['/sign-in', '/sign-up', '/myevents', '/profile', '/contact'], // pages to exclude
    robotsTxtOptions: {
        additionalSitemaps: [
            'https://www.westerncybersociety.ca/sitemap.xml',
        ],
    },
};

module.exports = config;
