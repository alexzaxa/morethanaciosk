# SEO launch guide — More Than a Kiosk

## Production URL
`https://more-than-a-kiosk.alexzaxa.com/`

The HTML metadata, canonical URLs, Open Graph previews, Twitter previews, LocalBusiness structured data, `robots.txt`, `sitemap.xml`, manifest and GitHub Pages `CNAME` are already configured for this address.

## Required deployment steps

1. In the DNS provider for `alexzaxa.com`, create a CNAME record:
   - Name: `more-than-a-kiosk`
   - Target: your GitHub Pages host, normally `<github-username>.github.io`
2. In the GitHub repository, open **Settings → Pages** and set the custom domain to `more-than-a-kiosk.alexzaxa.com`.
3. Enable **Enforce HTTPS** after the certificate becomes available.
4. Open Google Search Console and add a **Domain property** for `alexzaxa.com`, or a **URL-prefix property** for `https://more-than-a-kiosk.alexzaxa.com/`.
5. Complete Google’s DNS verification. No verification code is included in the website because Google generates a unique value for the property owner.
6. Submit this sitemap in Search Console:
   `https://more-than-a-kiosk.alexzaxa.com/sitemap.xml`
7. Inspect `https://more-than-a-kiosk.alexzaxa.com/` and click **Request indexing**.
8. In the verified Google Business Profile, add `https://more-than-a-kiosk.alexzaxa.com/` as the website and `https://more-than-a-kiosk.alexzaxa.com/menu.html` as the menu link.

## Consistency checklist
Use exactly these public details everywhere:
- Name: More Than a Kiosk
- Alternate branding: More Than Coffee
- Address: Ποσειδώνος 13, Χαλκούτσι, Αττική
- Phone: 22950 71211
- Maps: https://maps.app.goo.gl/wuxAspR66vvUeKUTA

Search ranking is not guaranteed, but this technical setup gives Google consistent, machine-readable business information and a clean path to crawl and index the site.
