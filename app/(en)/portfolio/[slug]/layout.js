import projects from '@/data/projects.json';

const slugMap = {
  'chillout-10th-of-ramadan-banks': '10th-of-ramadan-chillout-station',
  'chillout-mostafa-kamel': 'mostafa-kamel-axis-new-cairo',
  'chillout-marina-5': 'marina-5-north-coast',
  'chillout-10th-of-ramadan-alrowad': 'al-rowad-club-10th-of-ramadan',
  'sour-nady-el-nady': 'sour-nady-el-nady-sheraton',
  'sour-nady-el-obour': 'sour-nady-el-obour',
  'el-salam-plaza-mall': 'el-salam-plaza-mall'
};

const reverseSlugMap = Object.entries(slugMap).reduce((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

export async function generateMetadata({ params }) {
  const { slug } = params;
  const id = reverseSlugMap[slug] || slug;
  const project = projects.find(p => p.id === id);

  if (!project) return { title: 'Not Found' };

  return {
    title: `${project.name} – Commercial Spaces for Brands | F.B Company`,
    description: project.overview,
    alternates: {
      canonical: `/portfolio/${slug}`,
      languages: {
        'en': `/portfolio/${slug}`,
        'ar': `/ar/portfolio/${slug}`,
        'x-default': `/portfolio/${slug}`
      }
    }
  };
}

export default function Layout({ children }) {
  return children;
}
