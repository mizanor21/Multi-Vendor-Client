import React from "react";
import BannerSliderClient from "./BannerSliderClient";

// Server Component - Fetches data with revalidation
async function getActiveSliders() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sliders/active`, {
      next: { 
        revalidate: 300, // Revalidate every 5 minutes (300 seconds)
        tags: ['sliders'] // Tag for on-demand revalidation
      },
      cache: 'force-cache',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch sliders');
    }

    const data = await res.json();
    return data?.data?.sliders || [];
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return [];
  }
}

export default async function BannerSlider() {
  const sliders = await getActiveSliders();

  // Return null or fallback if no sliders
  if (!sliders || sliders.length === 0) {
    return null;
  }

  return <BannerSliderClient sliders={sliders} />;
}