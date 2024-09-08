'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useDropzone } from 'react-dropzone'
import ColorThief from 'colorthief'
import colorNamer from 'color-namer'
import { Button, ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CloudIcon, AlertCircle, CopyIcon, CheckIcon, EyeIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ColorInfo from '@/components/ui/color-info'

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SHADExLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 221 41" className="w-full h-12 text-white">
      <g fill="currentColor">
        <path d="M23.1,12.9c-.1-1.3-.6-2.3-1.5-3-.9-.7-2.2-1.1-3.9-1.1s-2,.1-2.7.4c-.7.3-1.2.6-1.6,1-.3.4-.5,1-.5,1.5,0,.5,0,.9.3,1.3.2.4.5.7,1,1,.4.3,1,.6,1.7.8.7.2,1.5.5,2.4.6l3.3.7c2.2.5,4.1,1.1,5.7,1.8,1.6.7,2.8,1.6,3.8,2.6,1,1,1.7,2.1,2.2,3.4.5,1.3.7,2.6.7,4.1,0,2.6-.7,4.7-2,6.5-1.3,1.8-3.1,3.1-5.6,4.1-2.4.9-5.3,1.4-8.6,1.4s-6.5-.5-9.1-1.5c-2.6-1-4.6-2.5-6-4.6-1.4-2.1-2.1-4.8-2.1-8h10.3c0,1.2.4,2.2.9,3,.5.8,1.3,1.4,2.3,1.8,1,.4,2.2.6,3.6.6s2.1-.1,2.9-.4c.8-.3,1.4-.7,1.8-1.2.4-.5.6-1.1.6-1.7,0-.6-.2-1.1-.6-1.6-.4-.5-1-.9-1.9-1.2-.9-.4-2-.7-3.5-1l-4-.8c-3.5-.7-6.3-2-8.3-3.8-2-1.8-3-4.2-3-7.2,0-2.5.7-4.6,2-6.5,1.4-1.9,3.3-3.3,5.7-4.4C11.8.7,14.6.2,17.7.2s6,.5,8.3,1.6c2.3,1.1,4.1,2.5,5.4,4.5,1.3,1.9,1.9,4.1,1.9,6.7h-10.3Z"/>
        <path d="M37,39.7V.7h10.8v15.2h14.3V.7h10.8v39h-10.8v-15.2h-14.3v15.2h-10.8Z"/>
        <path d="M87.2,39.7h-11.7L88.7.7h14.8l13.1,39h-11.7l-8.7-28.3h-.3l-8.7,28.3Z"/>
        <path d="M134.6,39.7h-15.3V.7h15.1c4.1,0,7.6.8,10.6,2.3,3,1.5,5.3,3.8,6.9,6.7,1.6,2.9,2.4,6.4,2.4,10.5s-.8,7.6-2.4,10.5c-1.6,2.9-3.9,5.1-6.9,6.7-3,1.5-6.5,2.3-10.5,2.3ZM130.1,30.8h4.1c2,0,3.6-.3,5-.9,1.4-.6,2.5-1.7,3.2-3.2.7-1.5,1.1-3.6,1.1-6.4s-.4-4.8-1.1-6.4c-.7-1.5-1.8-2.6-3.3-3.2-1.4-.6-3.2-.9-5.2-.9h-3.8v21Z"/>
        <path d="M158.3,39.7V.7h28.7v8.5h-17.9v6.7h16.4v8.5h-16.4v6.7h17.8v8.5h-28.6Z"/>
        <path d="M200.6,10.5l4.3,9.1,4.6-9.1h10.6l-8,14.6,8.4,14.6h-10.6l-5.1-9.3-4.9,9.3h-10.7l8.5-14.6-7.9-14.6h10.7Z"/>
      </g>
    </svg>
  )
}

function ColorSwatch({ color, name, onInfoClick }: { color: string; name: string; onInfoClick: () => void }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(color)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group relative flex flex-col items-center">
            <div
              className="w-full aspect-square rounded-lg shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: color }}
              onClick={copyToClipboard}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {copied ? (
                  <CheckIcon className="w-6 h-6 text-white drop-shadow-md" />
                ) : (
                  <CopyIcon className="w-6 h-6 text-white drop-shadow-md" />
                )}
              </div>
              <button
                className="absolute top-2 right-2 p-1 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onInfoClick()
                }}
              >
                <EyeIcon className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-200">{name}</p>
            <p className="text-xs text-gray-400">{color}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? 'Copied!' : 'Click to copy'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function PaletteGrid({ colors, onColorInfoClick }: { colors: Array<{ color: string; name: string }>; onColorInfoClick: (color: { color: string; name: string }) => void }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      {colors.map((color, index) => (
        <ColorSwatch key={index} color={color.color} name={color.name} onInfoClick={() => onColorInfoClick(color)} />
      ))}
    </div>
  )
}

export default function SHADEx() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<Array<{ color: string; name: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedColor, setSelectedColor] = useState<{ color: string; name: string } | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  })

  const handleFileUpload = (file: File) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit')
        return
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPEG and PNG files are allowed')
        return
      }
      setUploadedImage(file)
      setError(null)
      extractColors(file)
    }
  }

  const extractColors = useCallback((imageFile: File) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      if (event.target?.result) {
        const img = document.createElement('img')
        img.crossOrigin = 'Anonymous'
        img.onload = () => {
          const colorThief = new ColorThief()
          try {
            const palette = colorThief.getPalette(img, 6)
            if (palette) {
              const extractedColors = palette.map((color) => {
                const [r, g, b] = color
                const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
                return {
                  color: hexColor,
                  name: colorNamer(hexColor).ntc[0].name
                }
              })
              setExtractedColors(extractedColors)
            }
          } catch (error) {
            console.error('Error extracting colors:', error)
            // Handle the error appropriately (e.g., show an error message to the user)
          }
        }
        img.src = event.target.result as string
      }
    }
    reader.readAsDataURL(imageFile)
  }, [])

  useEffect(() => {
    if (uploadedImage) {
      extractColors(uploadedImage)
    }
  }, [uploadedImage, extractColors])

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleColorInfoClick = (color: { color: string; name: string }) => {
    setSelectedColor(color)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950 p-4">
      <Card className="w-full max-w-4xl bg-gray-900 text-gray-200 shadow-2xl border-gray-800">
        <CardHeader className="space-y-1 pb-4">
          <div className="w-full max-w-[200px]">
            <SHADExLogo />
          </div>
          <p className="text-sm text-gray-400">Extract dominant colors from your images</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-900 transition-colors duration-300 ease-in-out ${
              isDragActive ? 'border-blue-500 bg-gray-800' : ''
            }`}
          >
            <input {...getInputProps()} ref={fileInputRef} onChange={(e) => handleFileUpload(e.target.files?.[0] as File)} />
            {uploadedImage ? (
              <div className="space-y-4">
                <Image
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded image"
                  width={300}
                  height={300}
                  className="mx-auto rounded-lg object-cover shadow-lg"
                />
                <p className="text-sm text-gray-400">{uploadedImage.name}</p>
                <Button onClick={() => setUploadedImage(null)} className="bg-gray-800 text-white hover:bg-gray-700">
                  Remove Image
                </Button>
              </div>
            ) : (
              <>
                <CloudIcon className="mx-auto mb-4 text-gray-600 h-12 w-12" />
                <p className="mb-2 text-lg font-semibold">Choose a file or drag & drop it here</p>
                <p className="text-sm text-gray-500 mb-4">JPEG, PNG, up to 5MB</p>
                <Button className="bg-gray-800 text-white hover:bg-gray-700" onClick={handleBrowseClick}>
                  Browse File
                </Button>
              </>
            )}
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {extractedColors.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Extracted Color Palette</h2>
              </div>
              <PaletteGrid colors={extractedColors} onColorInfoClick={handleColorInfoClick} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/ProfilePicture.jpg" alt="Creator avatar" />
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-400">Created by Drewskii</span>
          </div>
          <Link href="https://x.com/drewskii_xyz" target="_blank" rel="noopener noreferrer">
            <Button 
              variant="default"
              className="bg-blue-600 text-white border-0 hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              <TwitterIcon className="w-4 h-4 mr-2" />
              Follow me on Twitter
            </Button>
          </Link>
        </CardFooter>
      </Card>
      {selectedColor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ColorInfo
            colorName={selectedColor.name}
            hexColor={selectedColor.color}
            onClose={() => setSelectedColor(null)}
          />
        </div>
      )}
    </div>
  )
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}