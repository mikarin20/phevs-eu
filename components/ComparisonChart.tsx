'use client'

import { useEffect, useRef } from 'react'

interface ComparisonChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
    }[]
  }
  width?: number
  height?: number
  language?: string
}

export default function ComparisonChart({ data, width = 600, height = 400, language = 'en' }: ComparisonChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const padding = 60
    const chartWidth = width - (padding * 2)
    const chartHeight = height - (padding * 2)
    const barWidth = chartWidth / (data.labels.length * (data.datasets.length + 1))
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data))

    // Draw background
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)

    // Draw grid lines
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw bars
    data.datasets.forEach((dataset, datasetIndex) => {
      dataset.data.forEach((value, valueIndex) => {
        const barHeight = (value / 100) * chartHeight
        const x = padding + valueIndex * (chartWidth / data.labels.length) + datasetIndex * barWidth
        const y = padding + chartHeight - barHeight

        // Draw bar
        ctx.fillStyle = dataset.backgroundColor
        ctx.fillRect(x, y, barWidth * 0.8, barHeight)

        // Draw bar border
        ctx.strokeStyle = dataset.borderColor
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, barWidth * 0.8, barHeight)

        // Draw value on top of bar
        ctx.fillStyle = dataset.borderColor
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(Math.round(value).toString(), x + (barWidth * 0.4), y - 5)
      })
    })

    // Draw labels
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    data.labels.forEach((label, index) => {
      const x = padding + (index + 0.5) * (chartWidth / data.labels.length)
      ctx.fillText(label, x, height - 20)
    })

    // Draw legend
    const legendY = 20
    data.datasets.forEach((dataset, index) => {
      const legendX = 20 + index * 150
      
      // Draw legend color box
      ctx.fillStyle = dataset.backgroundColor
      ctx.fillRect(legendX, legendY, 20, 15)
      ctx.strokeStyle = dataset.borderColor
      ctx.lineWidth = 2
      ctx.strokeRect(legendX, legendY, 20, 15)
      
      // Draw legend text
      ctx.fillStyle = '#374151'
      ctx.font = '12px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(dataset.label, legendX + 25, legendY + 11)
    })

    // Draw scale labels
    ctx.fillStyle = '#64748b'
    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5
      const value = Math.round((100 * i) / 5)
      ctx.fillText(value.toString(), padding - 10, y + 4)
    }
  }, [data, width, height])

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-slate-200 rounded-lg bg-white shadow-sm"
      />
    </div>
  )
}
