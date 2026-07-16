# SEO launch guide — More Than a Kiosk

## Production URL

`https://morethanakiosk.com/`

The canonical URLs, Open Graph previews, Twitter previews, LocalBusiness structured data, robots.txt, sitemap.xml, manifest and GitHub Pages CNAME are configured for this standalone domain.

## Required deployment steps

1. In the GitHub repository, open **Settings → Pages** and set the custom domain to `morethanakiosk.com`.
2. In the DNS provider for `morethanakiosk.com`, configure the apex/root domain for GitHub Pages using the GitHub-provided A/AAAA records, or an ALIAS/ANAME record if your DNS provider supports it.
3. Optionally configure `www.morethanakiosk.com` as a CNAME pointing to your GitHub Pages host and redirect it to the apex domain.
4. Enable **Enforce HTTPS** after GitHub's certificate becomes available.
5. In Google Search Console choose either:
   - **Domain property:** enter `morethanakiosk.com` and verify with Google's DNS TXT record; or
   - **URL-prefix property:** enter `https://morethanakiosk.com/` and verify using the included HTML file or meta tag.
6. After deployment, confirm this file opens publicly:
   `https://morethanakiosk.com/googlea29d0e60f918dc02.html`
7. Submit this sitemap:
   `https://morethanakiosk.com/sitemap.xml`
8. Inspect `https://morethanakiosk.com/` and click **Request indexing**.
9. In the verified Google Business Profile, use `https://morethanakiosk.com/` as the website and `https://morethanakiosk.com/menu.html` as the menu link.

## Consistency checklist

- Name: More Than a Kiosk
- Alternate branding: More Than Coffee
- Address: Ποσειδώνος 13, Χαλκούτσι, Αττική
- Phone: 22950 71211
- Maps: https://maps.app.goo.gl/wuxAspR66vvUeKUTA
