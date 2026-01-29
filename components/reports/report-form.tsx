'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ReportFormSchema,
  type ReportFormData,
  REPORT_TYPE_INFO,
} from '@/lib/schemas/report'
import { useSubmitReport, useLakes } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ReportForm() {
  const router = useRouter()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const { data: lakes } = useLakes()
  const submitReport = useSubmitReport()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      location: { latitude: 24.5854, longitude: 73.7125 }, // Default to Udaipur
    },
  })

  // Handle Location Detection
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('location', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to retrieve your location. Using default center.')
        setIsGettingLocation(false)
      }
    )
  }

  const onSubmit = async (data: ReportFormData) => {
    try {
      let imageUrl = 'https://picsum.photos/seed/lake/800/600' // Default mock URL

      // In a real app, we'd upload to Supabase Storage first
      // if (imageFile) {
      //   const { url } = await uploadImage.mutateAsync(imageFile);
      //   imageUrl = url;
      // }

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
      className="space-y-8 max-w-2xl mx-auto"
    >
      {/* Lake Selection */}
      <div className="space-y-2">
        <Label>Select Affected Lake</Label>
        <Select
          onValueChange={(val) => setValue('lakeId', val)}
          defaultValue={watch('lakeId')}
        >
          <SelectTrigger className="w-full h-12 bg-card border-muted">
            <SelectValue placeholder="Which lake is this near?" />
          </SelectTrigger>
          <SelectContent>
            {lakes?.map((lake) => (
              <SelectItem key={lake.id} value={lake.id}>
                {lake.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.lakeId && (
          <p className="text-sm text-destructive font-medium">
            {errors.lakeId.message}
          </p>
        )}
      </div>

      {/* Report Type Selection */}
      <div className="space-y-4">
        <Label className="text-base">What did you observe?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(REPORT_TYPE_INFO).map(([type, info]) => {
            const isSelected = watch('reportType') === type
            return (
              <label
                key={type}
                className={cn(
                  'relative flex items-start p-4 cursor-pointer rounded-xl border-2 transition-all hover:bg-muted/50',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-muted bg-card'
                )}
              >
                <input
                  type="radio"
                  value={type}
                  className="sr-only"
                  {...register('reportType')}
                />
                <span className="text-2xl mr-3">{info.icon}</span>
                <div>
                  <span className="block text-sm font-semibold text-foreground">
                    {info.label}
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {info.description}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
        {errors.reportType && (
          <p className="text-sm text-destructive font-medium">
            {errors.reportType.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Please describe what you saw, specific location details, or any other relevant information."
          className="min-h-[120px] resize-y bg-card border-muted"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive font-medium">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Verification Location</Label>
        <div className="flex gap-2">
          <Input
            readOnly
            value={`Lat: ${watch('location.latitude').toFixed(4)}, Lng: ${watch('location.longitude').toFixed(4)}`}
            className="bg-muted/50 text-muted-foreground border-muted"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleGetLocation}
            disabled={isGettingLocation}
          >
            {isGettingLocation ? '📍 Detecting...' : '📍 Use Current Location'}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Your location will be used to verify the report and notify local
          authorities.
        </p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Evidence (Photo)</Label>
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors bg-card">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            {preview ? (
              <div className="relative w-full max-w-sm">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-lg object-cover shadow-sm w-full h-64"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => {
                    setPreview(null)
                    setImageFile(null)
                  }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 rounded-full bg-muted p-4">
                  <svg
                    className="h-8 w-8 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90"
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
                <p className="text-xs text-muted-foreground/70 mt-2">
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full py-6 text-lg"
          disabled={submitReport.isPending}
        >
          {submitReport.isPending
            ? 'Submitting Report...'
            : '📤 Submit Official Report'}
        </Button>
      </div>
    </form>
  )
}
