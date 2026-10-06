export default function sitemap() {
  const baseUrl = 'https://fbassets.com';
  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/asset-management`, lastModified: new Date() },
    { url: `${baseUrl}/franchise-sourcing`, lastModified: new Date() },
    { url: `${baseUrl}/portfolio`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];
}
