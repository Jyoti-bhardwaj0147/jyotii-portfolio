# Search visibility for jyotiibhardwaj.com

The four public pages use unique titles, descriptions, canonical URLs, Open Graph,
and Twitter metadata. `lib/seo.ts` owns the production origin. Next.js generates
`/sitemap.xml` and `/robots.txt`; `next-seo` renders WebSite structured data on the
home page and ProfilePage/Person data on the About page.

## After deployment

1. Confirm the HTTPS custom domain serves all four pages successfully and that
   `/robots.txt` and `/sitemap.xml` are publicly accessible.
2. Verify the `jyotiibhardwaj.com` domain property in Google Search Console using
   the DNS TXT record supplied by Google. Keep the existing DNS records.
3. Submit `https://jyotiibhardwaj.com/sitemap.xml` in Search Console's Sitemaps tool.
4. Inspect the home page with URL Inspection, run the live test, and request
   indexing. Check the Page Indexing report for any crawl or indexing failures.
5. In hosting settings, redirect any alternate public hostnames to the matching
   path on `https://jyotiibhardwaj.com` using permanent redirects. Keep preview
   deployments private or configure them as noindex at the hosting layer.

No Search Console verification token has been invented or committed. DNS and
hosting settings must be configured in the domain owner's accounts. Canonicals
are signals, not redirects. Metadata and sitemaps support discovery but cannot
guarantee indexing, ranking, or the wording of Google's search snippets.

References:
- https://github.com/garmeeh/next-seo
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
