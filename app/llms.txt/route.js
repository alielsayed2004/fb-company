import { SITE_URL } from '@/lib/seo';
import { getAllLocations, locationSlug } from '@/lib/projects';
import company from '@/data/company.json';
import { ENTITY } from '@/lib/schema';

// /llms.txt — plain-language summary for AI assistants, generated from the same data files as the site.
export const dynamic = 'force-static';

export function GET() {
  const c = company.counters;
  const contact = company.contactInfo;
  const locations = getAllLocations()
    .map((p) => `- [${p.name}](${SITE_URL}/portfolio/${locationSlug(p)}): ${p.city}. Status: ${p.status}.`)
    .join('\n');

  const body = `# F.B Company

> ${ENTITY.en} Tagline: "From Vision to Value".

Figures from company data as of ${company.countersMeta?.asOf || '2026'}: ${c.locations} commercial locations, ${c.brands} brand partners, ${c.area} m² of commercial space managed and sourced.

Content on this website is general information, not investment advice. No return, occupancy or value is guaranteed. See ${SITE_URL}/risk-disclaimer.

## Services
- [Commercial Real Estate Asset Management](${SITE_URL}/asset-management): leasing and tenant mix, lease administration, day-to-day operations, development coordination.
- [Franchise Location Sourcing](${SITE_URL}/franchise-sourcing): locations in fuel stations, malls and clubs; site and traffic research, lease negotiation, permit coordination and handover.

## Locations
${locations}

## Company
- [About F.B Company](${SITE_URL}/about)
- [Portfolio](${SITE_URL}/portfolio)
- [Contact](${SITE_URL}/contact): ${contact.address}. Phone ${contact.phone}. Email ${contact.email}.
- [Careers](${SITE_URL}/careers)

## Arabic
- The full site is available in Arabic at ${SITE_URL}/ar
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
