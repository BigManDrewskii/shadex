'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button, ButtonProps } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { X, Copy, Check, Palette, Droplet, SunDim, Wand2, Eye, Download, Clipboard } from 'lucide-react'
import { HexColorPicker } from "react-colorful"
import colorNamer from 'color-namer'
import { hexToHsl, hslToHex } from "../../lib/colorUtils"

interface ColorInfoProps {
  colorName: string
  hexColor: string
  onClose: () => void
}

type SchemeType = 'monochromatic' | 'analogous' | 'complementary' | 'splitComplementary' | 'triadic' | 'tetradic';

function ColorSwatch({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <div 
      className="w-12 h-12 rounded-md shadow-md cursor-pointer transition-all hover:scale-105"
      style={{ backgroundColor: color }}
      onClick={onClick}
    />
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button 
      variant="secondary"
      size="sm" 
      onClick={handleCopy}
      className="w-full"
    >
      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
      {copied ? 'Copied!' : `Copy ${label}`}
    </Button>
  )
}

function ColorAdjuster({ color, onChange }: { color: string; onChange: (color: string) => void }) {
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 })

  useEffect(() => {
    const { h, s, l } = hexToHsl(color)
    setHsl({ h, s, l })
  }, [color])

  const handleChange = (key: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [key]: value }
    setHsl(newHsl)
    onChange(hslToHex(newHsl.h, newHsl.s, newHsl.l))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Hue</label>
        <Slider
          min={0}
          max={360}
          step={1}
          value={[hsl.h]}
          onValueChange={(value: number[]) => handleChange('h', value[0])}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Saturation</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[hsl.s]}
          onValueChange={(value: number[]) => handleChange('s', value[0])}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Lightness</label>
        <Slider
          min={0}
          max={100}
          step={1}
          value={[hsl.l]}
          onValueChange={(value: number[]) => handleChange('l', value[0])}
        />
      </div>
    </div>
  )
}

function ColorInputs({ color, onChange }: { color: string; onChange: (color: string) => void }) {
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 })

  useEffect(() => {
    setRgb(hexToRgb(color))
  }, [color])

  const handleChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [key]: value }
    setRgb(newRgb)
    onChange(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-300">R</label>
        <Input
          type="number"
          min={0}
          max={255}
          value={rgb.r}
          onChange={(e) => handleChange('r', parseInt(e.target.value))}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-300">G</label>
        <Input
          type="number"
          min={0}
          max={255}
          value={rgb.g}
          onChange={(e) => handleChange('g', parseInt(e.target.value))}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-300">B</label>
        <Input
          type="number"
          min={0}
          max={255}
          value={rgb.b}
          onChange={(e) => handleChange('b', parseInt(e.target.value))}
        />
      </div>
    </div>
  )
}

function ColorBlindnessSimulation({ type, color }: { type: string; color: string }) {
  const simulatedColor = simulateColorBlindness(color, type);
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-300 capitalize">{type}</h4>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-md" style={{ backgroundColor: simulatedColor }} />
        <div>
          <p className="text-sm text-gray-400">Simulated color: {simulatedColor}</p>
          <p className="text-xs text-gray-500">{getColorBlindnessDescription(type)}</p>
        </div>
      </div>
    </div>
  );
}

function getColorBlindnessDescription(type: string): string {
  switch (type) {
    case 'protanopia':
      return 'Difficulty distinguishing between red and green';
    case 'deuteranopia':
      return 'Difficulty distinguishing between green and red';
    case 'tritanopia':
      return 'Difficulty distinguishing between blue and yellow';
    case 'achromatopsia':
      return 'Complete color blindness, sees only shades of gray';
    default:
      return '';
  }
}

function simulateColorBlindness(color: string, type: string): string {
  const rgb = hexToRgb(color);
  let simulated: { r: number; g: number; b: number };

  switch (type) {
    case 'protanopia':
      simulated = simulateProtanopia(rgb);
      break;
    case 'deuteranopia':
      simulated = simulateDeuteranopia(rgb);
      break;
    case 'tritanopia':
      simulated = simulateTritanopia(rgb);
      break;
    case 'achromatopsia':
      simulated = simulateAchromatopsia(rgb);
      break;
    default:
      return color;
  }

  return rgbToHex(simulated.r, simulated.g, simulated.b);
}

function simulateProtanopia(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const m = [
    0.567, 0.433, 0,
    0.558, 0.442, 0,
    0, 0.242, 0.758
  ];
  return applyColorMatrix(rgb, m);
}

function simulateDeuteranopia(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const m = [
    0.625, 0.375, 0,
    0.7, 0.3, 0,
    0, 0.3, 0.7
  ];
  return applyColorMatrix(rgb, m);
}

function simulateTritanopia(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const m = [
    0.95, 0.05, 0,
    0, 0.433, 0.567,
    0, 0.475, 0.525
  ];
  return applyColorMatrix(rgb, m);
}

function simulateAchromatopsia(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const m = [
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114,
    0.299, 0.587, 0.114
  ];
  return applyColorMatrix(rgb, m);
}

function applyColorMatrix(rgb: { r: number; g: number; b: number }, matrix: number[]): { r: number; g: number; b: number } {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const simR = r * matrix[0] + g * matrix[1] + b * matrix[2];
  const simG = r * matrix[3] + g * matrix[4] + b * matrix[5];
  const simB = r * matrix[6] + g * matrix[7] + b * matrix[8];

  return {
    r: Math.round(simR * 255),
    g: Math.round(simG * 255),
    b: Math.round(simB * 255)
  };
}

// Add this type definition
type HSL = { h: number; s: number; l: number }

// Add this object for scheme descriptions
const schemeDescriptions = {
  monochromatic: "Uses variations in lightness and saturation of a single color. Great for creating a harmonious, cohesive look.",
  analogous: "Uses colors that are next to each other on the color wheel. Ideal for creating a harmonious and balanced design.",
  complementary: "Uses colors opposite each other on the color wheel. Perfect for creating strong contrast and making things stand out.",
  triadic: "Uses three colors equally spaced around the color wheel. Good for creating vibrant and balanced color schemes.",
  tetradic: "Uses four colors equally spaced around the color wheel. Provides a wide range of colors for a more complex and dynamic design."
}

export default function ColorInfo({ colorName, hexColor, onClose }: ColorInfoProps) {
  const [currentColor, setCurrentColor] = useState(hexColor)
  const [schemes, setSchemes] = useState<Record<string, string[]>>({})

  const rgb = useMemo(() => hexToRgb(currentColor), [currentColor])
  const hsl = useMemo(() => hexToHsl(currentColor), [currentColor])
  const cmyk = useMemo(() => rgbToCmyk(rgb.r, rgb.g, rgb.b), [rgb])
  const [contrastColor, setContrastColor] = useState('#ffffff')

  useEffect(() => {
    setContrastColor(getContrastColor(currentColor))
    setSchemes(generateColorSchemes(currentColor))
  }, [currentColor])

  const exportScheme = (format: 'css' | 'sass' | 'palette') => {
    let output = ''
    switch (format) {
      case 'css':
        output = Object.entries(schemes).map(([name, colors]) => 
          colors.map((c, i) => `--${name}-${i + 1}: ${c};`).join('\n')
        ).join('\n\n')
        break
      case 'sass':
        output = Object.entries(schemes).map(([name, colors]) => 
          colors.map((c, i) => `$${name}-${i + 1}: ${c}`).join('\n')
        ).join('\n\n')
        break
      case 'palette':
        output = Object.values(schemes).flat().join('\n')
        break
    }
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `color-scheme-${format}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const [copiedScheme, setCopiedScheme] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyScheme = (schemeName: string, colors: string[]) => {
    const colorString = colors.join(', ');
    navigator.clipboard.writeText(colorString);
    setCopiedScheme(schemeName);
    setTimeout(() => setCopiedScheme(null), 2000);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <Card className="w-full max-w-2xl bg-gray-900 text-gray-200 shadow-2xl border-gray-800">
      <CardHeader className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-bold">{colorName}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full h-32 rounded-md shadow-md" style={{ backgroundColor: currentColor }} />
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">
              <Palette className="w-4 h-4 mr-2" />
              Info
            </TabsTrigger>
            <TabsTrigger value="adjust">
              <Droplet className="w-4 h-4 mr-2" />
              Adjust
            </TabsTrigger>
            <TabsTrigger value="schemes">
              <Wand2 className="w-4 h-4 mr-2" />
              Schemes
            </TabsTrigger>
            <TabsTrigger value="contrast">
              <SunDim className="w-4 h-4 mr-2" />
              Contrast
            </TabsTrigger>
            <TabsTrigger value="colorblind">
              <Eye className="w-4 h-4 mr-2" />
              Colorblind
            </TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="space-y-4">
            <p className="text-sm text-gray-400">View detailed color information and copy color codes.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">HEX</p>
                <p className="text-xs mb-2">{currentColor}</p>
                <CopyButton text={currentColor} label="HEX" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">RGB</p>
                <p className="text-xs mb-2">{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</p>
                <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} label="RGB" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">HSL</p>
                <p className="text-xs mb-2">{`${hsl.h}°, ${hsl.s}%, ${hsl.l}%`}</p>
                <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} label="HSL" />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">CMYK</p>
                <p className="text-xs mb-2">{cmyk.join(', ')}</p>
                <CopyButton text={cmyk.join(', ')} label="CMYK" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="adjust" className="space-y-4">
            <p className="text-sm text-gray-400">Fine-tune the selected color using various methods.</p>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white" style={{ backgroundColor: currentColor }} />
              <p className="text-sm font-medium">{currentColor}</p>
            </div>
            <Tabs defaultValue="picker">
              <TabsList>
                <TabsTrigger value="picker">Color Picker</TabsTrigger>
                <TabsTrigger value="sliders">Sliders</TabsTrigger>
                <TabsTrigger value="inputs">Inputs</TabsTrigger>
              </TabsList>
              <TabsContent value="picker">
                <HexColorPicker color={currentColor} onChange={setCurrentColor} />
              </TabsContent>
              <TabsContent value="sliders">
                <ColorAdjuster color={currentColor} onChange={setCurrentColor} />
              </TabsContent>
              <TabsContent value="inputs">
                <ColorInputs color={currentColor} onChange={setCurrentColor} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="schemes" className="h-[400px] overflow-y-auto">
            <div className="space-y-6">
              {Object.entries(schemes).map(([schemeName, schemeColors]) => (
                <div key={schemeName} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold capitalize">{schemeName}</h3>
                    <Button
                      onClick={() => handleCopyScheme(schemeName, schemeColors)}
                      className="text-xs"
                    >
                      {copiedScheme === schemeName ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Clipboard className="h-4 w-4 mr-2" />
                      )}
                      {copiedScheme === schemeName ? "Copied!" : "Copy Scheme"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {schemeColors.map((schemeColor, index) => (
                      <div 
                        key={index} 
                        className="space-y-1 cursor-pointer group"
                        onClick={() => handleCopyColor(schemeColor)}
                      >
                        <div
                          className="w-full aspect-square rounded-md relative overflow-hidden"
                          style={{ backgroundColor: schemeColor }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                            <Clipboard className="text-white h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                          {copiedColor === schemeColor && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                              <Check className="text-white h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-center">{schemeColor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="contrast" className="space-y-4">
            <p className="text-sm text-gray-400">Check the contrast ratio between the selected color and a background color.</p>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-white" style={{ backgroundColor: currentColor }} />
              <p className="text-sm font-medium">{currentColor}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-white" style={{ backgroundColor: contrastColor }} />
              <p className="text-sm font-medium">{contrastColor}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Contrast Ratio</label>
              <p className="text-sm text-gray-400">{calculateContrastRatio(currentColor, contrastColor).toFixed(2)}:1</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">WCAG Compliance</label>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${isWCAGAA(currentColor, contrastColor) ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm text-gray-400">AA</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${isWCAGAAA(currentColor, contrastColor) ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm text-gray-400">AAA</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${isWCAGAALargeText(currentColor, contrastColor) ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm text-gray-400">AA Large Text</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-4 h-4 rounded-full ${isWCAGAAALargeText(currentColor, contrastColor) ? 'bg-green-500' : 'bg-red-500'}`} />
                <p className="text-sm text-gray-400">AAA Large Text</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="colorblind" className="space-y-4">
            <p className="text-sm text-gray-400">Simulate how the selected color appears to individuals with different types of color blindness.</p>
            <div className="space-y-4">
              <ColorBlindnessSimulation type="protanopia" color={currentColor} />
              <ColorBlindnessSimulation type="deuteranopia" color={currentColor} />
              <ColorBlindnessSimulation type="tritanopia" color={currentColor} />
              <ColorBlindnessSimulation type="achromatopsia" color={currentColor} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper functions
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - (r / 255)
  let m = 1 - (g / 255)
  let y = 1 - (b / 255)
  let k = Math.min(c, m, y)

  c = (c - k) / (1 - k)
  m = (m - k) / (1 - k)
  y = (y - k) / (1 - k)

  return [
    Math.round(c * 100),
    Math.round(m * 100),
    Math.round(y * 100),
    Math.round(k * 100)
  ]
}

function getContrastColor(hexColor: string) {
  const rgb = hexToRgb(hexColor)
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

function calculateContrastRatio(color1: string, color2: string) {
  const luminance1 = calculateLuminance(hexToRgb(color1))
  const luminance2 = calculateLuminance(hexToRgb(color2))
  const lighter = Math.max(luminance1, luminance2)
  const darker = Math.min(luminance1, luminance2)
  return (lighter + 0.05) / (darker + 0.05)
}

function calculateLuminance({ r, g, b }: { r: number, g: number, b: number }) {
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function isWCAGAA(color1: string, color2: string) {
  const ratio = calculateContrastRatio(color1, color2)
  return ratio >= 4.5
}

function isWCAGAAA(color1: string, color2: string) {
  const ratio = calculateContrastRatio(color1, color2)
  return ratio >= 7
}

function isWCAGAALargeText(color1: string, color2: string) {
  const ratio = calculateContrastRatio(color1, color2)
  return ratio >= 3
}

function isWCAGAAALargeText(color1: string, color2: string) {
  const ratio = calculateContrastRatio(color1, color2)
  return ratio >= 4.5
}

function generateColorSchemes(baseColor: string): Record<string, string[]> {
  const hsl = hexToHsl(baseColor)
  return {
    monochromatic: generateMonochromatic(hsl),
    analogous: generateAnalogous(hsl),
    complementary: generateComplementary(hsl),
    triadic: generateTriadic(hsl),
    tetradic: generateTetradic(hsl),
  }
}

function generateMonochromatic(hsl: HSL): string[] {
  return [
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 30)}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(0, hsl.l - 15)}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 15)}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(100, hsl.l + 30)}%)`,
  ]
}

function generateAnalogous(hsl: HSL): string[] {
  return [
    `hsl(${(hsl.h - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h - 15 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 15) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  ]
}

function generateComplementary(hsl: HSL): string[] {
  return [
    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  ]
}

function generateTriadic(hsl: HSL): string[] {
  return [
    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  ]
}

function generateTetradic(hsl: HSL): string[] {
  return [
    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 90) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    `hsl(${(hsl.h + 270) % 360}, ${hsl.s}%, ${hsl.l}%)`,
  ]
}
