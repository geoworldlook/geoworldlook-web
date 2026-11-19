import { ImageResponse } from 'next/og';
import { getSite } from '@/lib/content/site';

// Obrazek podglądu linku (Open Graph) dla całej strony: widoczny przy udostępnianiu na LinkedIn.
export const alt = 'GeoWorldLook: Earth observation by Dawid Sajewski';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const site = getSite();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0a0a0a',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 36, color: '#34d399' }}>
          <div style={{ width: 24, height: 24, borderRadius: 12, background: '#34d399', marginRight: 16 }} />
          {site.name}
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, marginTop: 32, lineHeight: 1.1 }}>
          {`${site.home.hero.title} ${site.home.hero.titleAccent}`}
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#9ca3af', marginTop: 32 }}>
          {`${site.author} · remote sensing · open Copernicus data`}
        </div>
      </div>
    ),
    size,
  );
}
