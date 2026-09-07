// Comprehensive mapping of verified partner brand names to their real logo files in public/logos/
export const BRAND_LOGO_MAP = {
  "salé sucré": "/logos/1.png",
  "sale sucre": "/logos/1.png",
  "ساليه سوكريه": "/logos/1.png",
  "mcdonald's": "/logos/2.png",
  "mcdonalds": "/logos/2.png",
  "ماكدونالدز": "/logos/2.png",
  "othaim market": "/logos/3.png",
  "othaim": "/logos/3.png",
  "العثيم": "/logos/3.png",
  "العثيم ماركت": "/logos/3.png",
  "tbs": "/logos/4.png",
  "the bakery shop": "/logos/4.png",
  "تي بي اس": "/logos/4.png",
  "pizza hut": "/logos/5.png",
  "بيتزا هت": "/logos/5.png",
  "domino's pizza": "/logos/6.png",
  "dominos": "/logos/6.png",
  "دومينوز": "/logos/6.png",
  "nine two nine": "/logos/7.png",
  "929": "/logos/7.png",
  "circle k": "/logos/8.png",
  "سيركل كيه": "/logos/8.png",
  "spinneys": "/logos/9.png",
  "سبينيس": "/logos/9.png",
  "tabali": "/logos/10.png",
  "طبالي": "/logos/10.png",
  "carrefour": "/logos/11.png",
  "كارفور": "/logos/11.png",
  "kfc": "/logos/12.png",
  "كنتاكي": "/logos/12.png",
  "master": "/logos/13.png",
  "ماستر": "/logos/13.png",
  "breadfast": "/logos/14.png",
  "بريدفاست": "/logos/14.png",
  "el abd": "/logos/15.png",
  "el abd patisserie": "/logos/15.png",
  "العبد": "/logos/15.png",
  "حلواني العبد": "/logos/15.png",
  "hunger station": "/logos/16.png",
  "hungerstation": "/logos/16.png",
  "هنقرستيشن": "/logos/16.png",
  "papa john's": "/logos/17.png",
  "papa johns": "/logos/17.png",
  "بابا جونز": "/logos/17.png",
  "tseppas": "/logos/18.png",
  "تسيباس": "/logos/18.png",
  "حلواني تسيباس": "/logos/18.png",
  "fawzy": "/logos/19.png",
  "فوزي": "/logos/19.png",
  "el ezaby pharmacy": "/logos/20.png",
  "el ezaby": "/logos/20.png",
  "صيدلية العزبي": "/logos/20.png",
  "العزبي": "/logos/20.png",
  "etoile": "/logos/21.png",
  "إيتوال": "/logos/21.png",
  "karam el sham": "/logos/22.png",
  "karam elsham": "/logos/22.png",
  "كرم الشام": "/logos/22.png",
  "buffalo burger": "/logos/23.png",
  "بافالو برجر": "/logos/23.png",
  "bazooka": "/logos/24.png",
  "بازوكا": "/logos/24.png",
  "dream 2000": "/logos/25.png",
  "دريم 2000": "/logos/25.png",
  "al koftageya": "/logos/26.png",
  "alkoftageya": "/logos/26.png",
  "الكفتجية": "/logos/26.png",
  "al borg": "/logos/27.png",
  "al borg laboratories": "/logos/27.png",
  "معامل البرج": "/logos/27.png",
  "البرج": "/logos/27.png",
  "second cup": "/logos/28.png",
  "2b": "/logos/29.png",
  "تو بي": "/logos/29.png",
  "stuffit": "/logos/30.png",
  "ستافت": "/logos/30.png",
  "just smash": "/logos/31.png",
  "جست سماش": "/logos/31.png",
  "shashlik": "/logos/32.png",
  "شاشلك": "/logos/32.png",
  "nos dasta": "/logos/33.png",
  "نص دستة": "/logos/33.png",
  "kufta": "/logos/34.png",
  "كفتة": "/logos/34.png",
  "kabzo": "/logos/35.png",
  "كابزو": "/logos/35.png",
  "wahba": "/logos/36.png",
  "وهبي": "/logos/36.png",
  "b.laban": "/logos/37.png",
  "b laban": "/logos/37.png",
  "بلبن": "/logos/37.png",
  "osta rosto": "/logos/38.png",
  "اسطى روستو": "/logos/38.png",
  "doshka burger": "/logos/39.png",
  "دوشكا برجر": "/logos/39.png",
  "alfa": "/logos/40.png",
  "معامل ألفا": "/logos/40.png",
  "al sadda": "/logos/41.png",
  "السدة": "/logos/41.png",
  "exception": "/logos/42.png",
  "اكسبشن": "/logos/42.png",
  "fetar": "/logos/43.png",
  "فطار": "/logos/43.png",
  "remas land": "/logos/44.png",
  "ريماس لاند": "/logos/44.png",
  "dina farms": "/logos/45.png",
  "مزارع دينا": "/logos/45.png",
  "technoscan": "/logos/46.png",
  "تكنوسكان": "/logos/46.png",
  "ormet fahmy": "/logos/47.png",
  "أورمة فهمي": "/logos/47.png",
  "hesham rabie": "/logos/48.png",
  "هشام ربيع": "/logos/48.png",
  "burger republic": "/logos/49.png",
  "برجر ريبابليك": "/logos/49.png",
  "bakery khan": "/logos/50.png",
  "بيكري خان": "/logos/50.png",
  "sultana": "/logos/51.png",
  "sultana ice cream": "/logos/51.png",
  "سلطانة": "/logos/51.png",
  "max muscle": "/logos/52.png",
  "ماكس ماسل": "/logos/52.png",
  "pizza party": "/logos/53.png",
  "بيتزا بارتي": "/logos/53.png",
  "shawerma reem": "/logos/54.png",
  "شاورما ريم": "/logos/54.png"
};

export function getBrandLogoUrl(name) {
  if (!name) return null;
  const key = String(name).toLowerCase().trim();
  return BRAND_LOGO_MAP[key] || null;
}

export const LOGO_RATIO_MAP = {
  "/logos/1.png": 0.98,
  "/logos/2.png": 1.15,
  "/logos/3.png": 0.92,
  "/logos/4.png": 0.85,
  "/logos/5.png": 1.48,
  "/logos/6.png": 1.12,
  "/logos/7.png": 1.50,
  "/logos/8.png": 1.00,
  "/logos/9.png": 1.35,
  "/logos/10.png": 1.58,
  "/logos/11.png": 1.11,
  "/logos/12.png": 1.00,
  "/logos/13.png": 2.20,
  "/logos/14.png": 1.51,
  "/logos/15.png": 1.05,
  "/logos/16.png": 2.49,
  "/logos/17.png": 2.34,
  "/logos/18.png": 2.40,
  "/logos/19.png": 1.85,
  "/logos/20.png": 2.71,
  "/logos/21.png": 1.25,
  "/logos/22.png": 0.80,
  "/logos/23.png": 1.15,
  "/logos/24.png": 1.07,
  "/logos/25.png": 2.75,
  "/logos/26.png": 2.16,
  "/logos/27.png": 1.95,
  "/logos/28.png": 0.95,
  "/logos/29.png": 2.32,
  "/logos/30.png": 1.61,
  "/logos/31.png": 0.76,
  "/logos/32.png": 4.49,
  "/logos/33.png": 2.65,
  "/logos/34.png": 3.31,
  "/logos/35.png": 3.26,
  "/logos/36.png": 2.15,
  "/logos/37.png": 1.10,
  "/logos/38.png": 1.05,
  "/logos/39.png": 1.50,
  "/logos/40.png": 1.20,
  "/logos/41.png": 1.80,
  "/logos/42.png": 1.50,
  "/logos/43.png": 0.85,
  "/logos/44.png": 1.80,
  "/logos/45.png": 1.60,
  "/logos/46.png": 2.80,
  "/logos/47.png": 2.50,
  "/logos/48.png": 2.90,
  "/logos/49.png": 3.62,
  "/logos/50.png": 1.85,
  "/logos/51.png": 3.14,
  "/logos/52.png": 1.50,
  "/logos/53.png": 1.05,
  "/logos/54.png": 0.47
};

export function getOptimalBentoSpans(items) {
  const n = items.length;
  if (n === 0) return [];
  if (n === 1) return [6];

  // Helper to generate all partitions of n using only row sizes 2 and 3
  const partitions = [];
  function backtrack(rem, current) {
    if (rem === 0) {
      partitions.push([...current]);
      return;
    }
    if (rem >= 2) {
      current.push(2);
      backtrack(rem - 2, current);
      current.pop();
    }
    if (rem >= 3) {
      current.push(3);
      backtrack(rem - 3, current);
      current.pop();
    }
  }
  backtrack(n, []);

  // If no pure 2/3 partition (should only occur if n < 2), fallback
  if (partitions.length === 0) {
    return Array(n).fill(2);
  }

  // Score each partition and determine optimal spans
  let bestScore = -Infinity;
  let bestSpans = null;

  for (const partition of partitions) {
    let idx = 0;
    let score = 0;
    const currentSpans = [];

    for (const rowSize of partition) {
      const rowItems = items.slice(idx, idx + rowSize);
      if (rowSize === 3) {
        currentSpans.push(2, 2, 2);
        for (const it of rowItems) {
          const r = it.ratio || 1.1;
          if (r <= 1.25) score += 15;
          else if (r <= 1.5) score += 5;
          else if (r <= 2.2) score -= 5;
          else score -= 15;
        }
      } else if (rowSize === 2) {
        const r1 = rowItems[0].ratio || 1.1;
        const r2 = rowItems[1].ratio || 1.1;
        if (r1 >= 1.45 && r2 <= 1.35) {
          currentSpans.push(4, 2);
          score += 32;
        } else if (r1 <= 1.35 && r2 >= 1.45) {
          currentSpans.push(2, 4);
          score += 32;
        } else if (r1 >= 1.35 && r2 >= 1.35) {
          currentSpans.push(3, 3);
          score += 24;
        } else {
          currentSpans.push(3, 3);
          score += 14;
        }
      }
      idx += rowSize;
    }

    if (score > bestScore) {
      bestScore = score;
      bestSpans = currentSpans;
    }
  }

  return bestSpans || Array(n).fill(2);
}


