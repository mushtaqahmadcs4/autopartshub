import React from 'react'
import HeroSection from './HeroSection'
import BrowseCategory from './browseCategory'
import DefaultCategory from './DefaultCategory'
import connectDb from '@/lib/db'
import { AutoPart } from "@/models/autoparts.model"
import { Category } from "@/models/category.model"

async function UserDashboard() {
  await connectDb()

  const rawProducts = await AutoPart.find({})
  const autoParts = JSON.parse(JSON.stringify(rawProducts))

  // Load categories in the order they were created.
  // This keeps the category order predictable.
  const rawCategories = await Category.find({}).sort({ createdAt: 1 })
  const categories = JSON.parse(JSON.stringify(rawCategories))

  // Categories explicitly marked true go BEFORE the default banners.
  // Everything else goes AFTER the default banners.
  const beforeDefaultCategories = categories.filter(
    (cat: any) => cat.placeBeforeDefault === true
  )

  const afterDefaultCategories = categories.filter(
    (cat: any) => cat.placeBeforeDefault !== true
  )

  return (
    <div className="w-full">
      <HeroSection />

      <BrowseCategory />

      <DefaultCategory
        autoParts={autoParts}
        beforeCategories={beforeDefaultCategories}
        afterCategories={afterDefaultCategories}
      />
    </div>
  )
}

export default UserDashboard