'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Upload, Loader2, ArrowLeft, CheckSquare, Square, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ICategory {
  _id: string
  name: string
  slug?: string
}

export default function AddAutoPart() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Categories fetched dynamically from DB API
  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Multi-selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Popular Auto Parts toggle state (Default: false)
  const [isPopular, setIsPopular] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    name: '',
    partNumber: '',
    brand: '',
    price: '',
    stock: '',
    unit: 'Piece',
    description: '',
    compatibility: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Fetch strictly existing categories from /api/category on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category')
        const data = await res.json()
        
        let fetchedList: string[] = []
        if (data.success && Array.isArray(data.categories)) {
          fetchedList = data.categories.map((c: ICategory) => c.name)
        } else if (Array.isArray(data.categories)) {
          fetchedList = data.categories.map((c: ICategory) => c.name)
        } else if (Array.isArray(data)) {
          fetchedList = data.map((c: any) => (typeof c === 'string' ? c : c.name))
        }

        // Only display categories that actually exist in the database
        setCategories(fetchedList)
      } catch (err) {
        console.error('Failed to load categories:', err)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((cat) => cat !== categoryName)
        : [...prev, categoryName]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (selectedCategories.length === 0) {
      setError('Please select at least one category.')
      setLoading(false)
      return
    }

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('partNumber', formData.partNumber)
      data.append('brand', formData.brand)
      data.append('category', JSON.stringify(selectedCategories))
      data.append('price', formData.price)
      data.append('stock', formData.stock)
      data.append('unit', formData.unit)
      data.append('description', formData.description)
      data.append('compatibility', formData.compatibility)
      
      // Pass isPopular flag explicitly selected by Admin
      data.append('isPopular', isPopular ? 'true' : 'false')

      if (imageFile) {
        data.append('image', imageFile)
      }

      const res = await fetch('/api/admin/add_product', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Failed to add auto part')
      }

      setSuccess('Auto part added successfully!')
      setFormData({
        name: '',
        partNumber: '',
        brand: '',
        price: '',
        stock: '',
        unit: 'Piece',
        description: '',
        compatibility: '',
      })
      setSelectedCategories([])
      setIsPopular(false)
      setImageFile(null)
      setImagePreview(null)

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-100/80 pt-28 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans antialiased">
      
      {/* Back to Home Link */}
      <Link
        href="/admin"
        className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-red-500" />
        <span>Back to home</span>
      </Link>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <PlusCircle className="text-red-600 w-6 h-6" />
            Add Auto Part
          </h1>
          <p className="text-xs text-gray-400 mt-1">Fill out the details below to add a new part to inventory.</p>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-normal border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-xs font-normal border border-green-100">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Part Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Part Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="eg: Brembo Brake Pads"
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Part Number & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Part Number / SKU *
              </label>
              <input
                type="text"
                name="partNumber"
                required
                value={formData.partNumber}
                onChange={handleChange}
                placeholder="eg: BP-2026-X"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="eg: Brembo, Bosch"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Dynamic Categories from DB */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Categories (Select all that apply) *
            </label>
            {loadingCategories ? (
              <div className="p-4 text-xs text-gray-400 bg-gray-50 rounded-xl flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                Loading categories from database...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-xs text-amber-600 bg-amber-50 rounded-xl border border-amber-100">
                No categories found in database. Please add categories first.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 border border-gray-200/80 rounded-2xl max-h-48 overflow-y-auto">
                {categories.map((catName) => {
                  const isChecked = selectedCategories.includes(catName)
                  return (
                    <button
                      key={catName}
                      type="button"
                      onClick={() => handleCategoryToggle(catName)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all text-left border ${
                        isChecked
                          ? 'bg-red-50 border-red-200 text-red-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-red-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className="truncate">{catName}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Admin Power: Popular Auto Parts Toggle Checkbox */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Featured Section
            </label>
            <button
              type="button"
              onClick={() => setIsPopular(!isPopular)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-medium transition-all ${
                isPopular
                  ? 'bg-amber-50/70 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className={`w-4 h-4 ${isPopular ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}`} />
                <span>Feature in Popular Auto Parts</span>
              </div>
              {isPopular ? (
                <CheckSquare className="w-4 h-4 text-amber-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-300" />
              )}
            </button>
          </div>

          {/* Unit, Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Unit*
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-600 bg-white"
              >
                <option value="Piece">Piece</option>
                <option value="Set">Set</option>
                <option value="Pair">Pair</option>
                <option value="Liter">Liter</option>
                <option value="Box">Box</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="eg: 120"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                required
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Vehicle Compatibility
            </label>
            <input
              type="text"
              name="compatibility"
              value={formData.compatibility}
              onChange={handleChange}
              placeholder="eg: Honda Civic 2022, Toyota Corolla 2021"
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter part details or specifications..."
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 text-xs text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <div className="mt-2 flex items-center justify-start">
              {imagePreview ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={imagePreview} alt="Preview" fill sizes="80px" className="object-cover" />
                  </div>
                  <label className="cursor-pointer text-xs font-medium text-red-600 hover:text-red-700">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="inline-flex items-center gap-2 px-4 py-2 border border-green-500/30 text-green-700 bg-green-50/50 rounded-lg cursor-pointer hover:bg-green-100/50 transition-colors text-xs font-medium">
                  <Upload className="w-4 h-4 text-green-600" />
                  <span>Upload Image</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 px-4 bg-red-600 text-white font-medium text-xs rounded-lg shadow-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding Auto Part...
              </>
            ) : (
              'Add Auto Part'
            )}
          </button>

        </form>
      </div>
    </div>
  )
}