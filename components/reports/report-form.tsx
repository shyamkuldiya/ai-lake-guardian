'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  ReportFormSchema,
  type ReportFormData,
  REPORT_TYPE_INFO,
} from '@/lib/schemas/report'
import { reportsApi } from '@/lib/api/client' // We'll bypass the hook for now to keep it simple or use the hook
import { useSubmitReport, useUploadImage } from '@/lib/hooks'

export function ReportForm() {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      lakeId: '550e8400-e29b-41d4-a716-446655440001', // Default to Pichola
      location: { latitude: 24.5764, longitude: 73.6827 },
    },
  })

  const submitReport = useSubmitReport()
  const uploadImage = useUploadImage()

  const onSubmit = async (data: ReportFormData) => {
    try {
      let imageUrl = ''

      // Upload image if present
      if (imageFile) {
        // In a real app, we'd wait for the upload
        // const result = await uploadImage.mutateAsync(imageFile);
        // imageUrl = result.url;
        imageUrl = URL.createObjectURL(imageFile) // Mock for now
      }

      await submitReport.mutateAsync({
        ...data,
        imageUrl,
      })

      router.push('/reports?success=true')
    } catch (error) {
      console.error('Failed to submit report:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {/* Report Type Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          What did you observe?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(REPORT_TYPE_INFO).map(([type, info]) => (
            <label
              key={type}
              className={`
                relative flex items-start p-4 cursor-pointer rounded-lg border transition-all
                ${
                  watch('reportType') === type
                    ? 'border-sky-500 bg-sky-500/10 ring-1 ring-sky-500'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }
              `}
            >
              <input
                type="radio"
                value={type}
                className="sr-only"
                {...register('reportType')}
              />
              <span className="text-2xl mr-3">{info.icon}</span>
              <div>
                <span className="block text-sm font-medium text-slate-200">
                  {info.label}
                </span>
                <span className="block text-xs text-slate-400 mt-1">
                  {info.description}
                </span>
              </div>
            </label>
          ))}
        </div>
        {errors.reportType && (
          <p className="text-sm text-red-500">{errors.reportType.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-slate-300"
        >
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
          placeholder="Please describe what you saw, specific location details, or any other relevant information."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Location (Simplified for MVP - just text or auto-detected in real app) */}
      <div className="space-y-1">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-slate-300"
        >
          Location
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value="Current Location (24.5854° N, 73.7125° E)"
            className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm"
          />
          <button
            type="button"
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200"
          >
            📍 Update
          </button>
        </div>
        <p className="text-xs text-slate-500">
          For this prototype, we default to Udaipur center.
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-300">
          Evidence (Photo)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-lg hover:border-slate-500 transition-colors">
          <div className="space-y-1 text-center">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null)
                    setImageFile(null)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-slate-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-sky-500 hover:text-sky-400 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={submitReport.isPending}
          className={`
            w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
          `}
        >
          {submitReport.isPending ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  )
}
