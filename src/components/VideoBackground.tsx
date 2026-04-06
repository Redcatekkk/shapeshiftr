"use client"

export default function VideoBackground() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover"
      style={{
        filter: "grayscale(100%) contrast(1.1)",
        zIndex: 0,
      }}
    >
      <source src="/bg.mp4" type="video/mp4" />
    </video>
  )
}
