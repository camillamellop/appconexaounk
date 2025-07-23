"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function UNKProfileCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 })
  const [targetTilt, setTargetTilt] = useState({ x: 0, y: 0 })
  const [isFlipping, setIsFlipping] = useState(false)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const backCardRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateTimeRef = useRef<number>(0)

  const router = useRouter()

  // Função de interpolação linear
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }

  // Animação suave do tilt usando requestAnimationFrame
  const updateTilt = useCallback(() => {
    const now = performance.now()
    const deltaTime = now - lastUpdateTimeRef.current
    lastUpdateTimeRef.current = now

    if (isFlipping) {
      setCardTilt({ x: 0, y: 0 })
      setTargetTilt({ x: 0, y: 0 })
      return
    }

    setCardTilt((current) => {
      const lerpFactor = Math.min(deltaTime / 16, 1) * 0.15
      const newX = lerp(current.x, targetTilt.x, lerpFactor)
      const newY = lerp(current.y, targetTilt.y, lerpFactor)

      const threshold = 0.1
      return {
        x: Math.abs(newX - targetTilt.x) < threshold ? targetTilt.x : newX,
        y: Math.abs(newY - targetTilt.y) < threshold ? targetTilt.y : newY,
      }
    })

    if (isFlipped && !isFlipping) {
      animationFrameRef.current = requestAnimationFrame(updateTilt)
    }
  }, [targetTilt, isFlipped, isFlipping])

  // Rastreamento global do mouse para o lado traseiro
  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isFlipped && !isFlipping && cardContainerRef.current) {
        const rect = cardContainerRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        const maxTilt = 15
        const tiltX = (mouseY / (rect.height / 2)) * maxTilt * -1
        const tiltY = (mouseX / (rect.width / 2)) * maxTilt

        const constrainedTiltX = Math.max(-maxTilt, Math.min(maxTilt, tiltX))
        const constrainedTiltY = Math.max(-maxTilt, Math.min(maxTilt, tiltY))

        setTargetTilt({ x: constrainedTiltX, y: constrainedTiltY })

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        })
      }
    },
    [isFlipped, isFlipping],
  )

  // Gerenciamento do loop de animação
  useEffect(() => {
    if (isFlipped && !isFlipping) {
      lastUpdateTimeRef.current = performance.now()
      animationFrameRef.current = requestAnimationFrame(updateTilt)
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isFlipped, isFlipping, updateTilt])

  useEffect(() => {
    if (isFlipped) {
      document.addEventListener("mousemove", handleGlobalMouseMove, { passive: true })
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
    }
  }, [isFlipped, handleGlobalMouseMove])

  const handleCardClick = () => {
    setIsFlipping(true)
    setIsFlipped(!isFlipped)

    setTimeout(() => {
      setIsFlipping(false)
    }, 600)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!isFlipped) {
      setMousePosition({ x: 50, y: 50 })
      setCardTilt({ x: 0, y: 0 })
      setTargetTilt({ x: 0, y: 0 })
    }
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isFlipped && isHovered && cardContainerRef.current) {
        const rect = cardContainerRef.current.getBoundingClientRect()

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        })
      }
    },
    [isFlipped, isHovered],
  )

  const getTransform = () => {
    const hoverTilt = isHovered && !isFlipped && !isFlipping ? "rotateZ(4deg)" : "rotateZ(0deg)"
    const flip = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
    const tilt3D = isFlipped && !isFlipping ? `rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)` : ""

    return `${hoverTilt} ${flip} ${tilt3D}`
  }

  const getHolographicStyle = () => {
    if (!isFlipped) {
      return {
        background: "transparent",
        transition: "background 0.15s ease-out",
      }
    }

    const { x, y } = mousePosition
    const { x: tiltX, y: tiltY } = cardTilt

    const tiltIntensity = (Math.abs(tiltX) + Math.abs(tiltY)) / 30
    const colorIntensity = 0.7 + tiltIntensity * 0.3

    const tiltOffsetX = tiltY * 2
    const tiltOffsetY = tiltX * 2

    const adjustedX = Math.max(0, Math.min(100, x + tiltOffsetX))
    const adjustedY = Math.max(0, Math.min(100, y + tiltOffsetY))

    const gradient1 = `radial-gradient(circle at ${adjustedX}% ${adjustedY}%, 
      rgba(220, 160, 225, ${colorIntensity}) 0%, transparent 50%)`
    const gradient2 = `radial-gradient(circle at ${100 - adjustedX}% ${100 - adjustedY}%, 
      rgba(30, 210, 220, ${colorIntensity * 0.8}) 0%, transparent 40%)`
    const gradient3 = `radial-gradient(circle at ${adjustedX}% ${100 - adjustedY}%, 
      rgba(60, 230, 65, ${colorIntensity * 0.9}) 0%, transparent 45%)`
    const gradient4 = `linear-gradient(${(x + tiltY) * 3.6}deg, 
      rgba(220, 160, 225, ${colorIntensity * 0.6}), 
      rgba(30, 210, 220, ${colorIntensity * 0.6}), 
      rgba(140, 145, 255, ${colorIntensity * 0.6}))`

    return {
      background: `${gradient1}, ${gradient2}, ${gradient3}, ${gradient4}`,
      transition: "none",
    }
  }

  const getFrontHolographicStyle = () => {
    if (!isHovered || isFlipped) {
      return {
        background: "transparent",
        transition: "background 0.15s ease-out",
      }
    }

    const { x, y } = mousePosition
    const baseOpacity = 0.1

    return {
      background: `radial-gradient(circle at ${x}% ${y}%, 
        rgba(255, 0, 255, ${baseOpacity}) 0%, 
        rgba(0, 255, 255, ${baseOpacity * 0.7}) 30%, 
        transparent 60%)`,
      transition: "background 0.15s ease-out",
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 font-mono">
      {/* Back Button */}
      <Button
        onClick={() => router.push("/")}
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-50 text-white hover:text-emerald-400 hover:bg-zinc-800/50 backdrop-blur-sm"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div className="relative w-full max-w-md mx-auto">
        <div
          ref={cardContainerRef}
          className="relative w-full h-[600px] cursor-pointer"
          style={{ perspective: "1000px" }}
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              transform: getTransform(),
              transitionProperty: "transform",
              transitionDuration: "0.5s",
              transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Lado Frontal - Quem Somos */}
            <Card
              className="absolute inset-0 w-full h-full bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl rounded-xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            >
              <div
                className="h-48 relative bg-cover bg-center bg-no-repeat rounded-t-xl"
                style={{ backgroundImage: "url(/images/bg2.png)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/30 to-transparent rounded-t-xl"></div>
                <div
                  className="absolute inset-0 rounded-t-xl mix-blend-screen"
                  style={getFrontHolographicStyle()}
                ></div>
              </div>

              <CardHeader className="text-center -mt-20 relative z-10 pb-2">
                <div className="relative">
                  <Avatar className="w-[120px] h-[120px] mx-auto mb-6 bg-black border-zinc-800 border-[1]">
                    <AvatarImage
                      src="/images/unk-logo.png"
                      alt="UNK Logo"
                      className="w-[90%] h-[90%] absolute inset-0 m-auto object-contain"
                    />
                    <AvatarFallback className="bg-black text-emerald-400 text-3xl font-mono">UNK</AvatarFallback>
                  </Avatar>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-mono">UNK</h1>
                <p className="text-zinc-400 text-lg font-mono py-[0]">Assessoria</p>
              </CardHeader>

              <CardContent className="px-4 pb-4 relative">
                <div
                  className="absolute inset-0 rounded-b-xl mix-blend-soft-light opacity-50"
                  style={getFrontHolographicStyle()}
                ></div>

                <div className="text-center relative z-10 px-2">
                  <h2 className="text-lg font-bold text-emerald-400 mb-3 font-mono">Quem Somos</h2>
                  <p className="text-zinc-300 leading-tight font-mono text-xs mb-3">
                    A Conexão UNK é um núcleo de desenvolvimento artístico real, criado por quem vive a música de
                    verdade e conhece o peso que ela pode carregar.
                  </p>
                  <p className="text-zinc-300 leading-tight font-mono text-xs mb-3">
                    Aqui, o artista não é só mais um perfil na vitrine. A gente olha pra a pessoa por trás do projeto.
                  </p>
                  <p className="text-emerald-400 leading-tight font-mono text-xs italic">
                    "Essa é a raiz da Conexão UNK. Se for pra construir algo, que seja com propósito."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Lado Traseiro - Termos do Contrato */}
            <Card
              ref={backCardRef}
              className="absolute inset-0 w-full h-full bg-zinc-900 border-zinc-800 overflow-hidden shadow-2xl rounded-xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <div className="h-full w-full bg-zinc-900 rounded-xl relative">
                <div
                  className="absolute inset-0 rounded-xl opacity-90 mix-blend-multiply"
                  style={getHolographicStyle()}
                ></div>

                <div
                  className="absolute inset-0 rounded-xl opacity-25 mix-blend-overlay"
                  style={{
                    background: isFlipped
                      ? `linear-gradient(${(mousePosition.x + cardTilt.y) * 2}deg, 
                    transparent 30%, 
                    rgba(255, 255, 255, ${0.3 + Math.abs(cardTilt.x + cardTilt.y) / 100}) 50%, 
                    transparent 70%)`
                      : "transparent",
                    transition: "none",
                  }}
                ></div>

                <div className="relative z-10 p-6 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2 font-mono">Termos do Contrato</h2>
                    <div className="w-full h-px bg-zinc-700"></div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-2 font-mono">Regras Contratuais</h3>
                      <div className="bg-zinc-800/50 rounded-lg p-4 min-h-[120px] border border-zinc-700">
                        <p className="text-zinc-400 text-sm font-mono italic">
                          [Área editável - Inserir regras contratuais]
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-emerald-400 mb-2 font-mono">Cache & Políticas</h3>
                      <div className="bg-zinc-800/50 rounded-lg p-4 min-h-[120px] border border-zinc-700">
                        <p className="text-zinc-400 text-sm font-mono italic">
                          [Área editável - Inserir políticas de cache e termos]
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-zinc-500 text-xs font-mono">UNK Assessoria © 2025</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
