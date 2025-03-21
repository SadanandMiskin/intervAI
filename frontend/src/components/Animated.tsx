"use client"

import type React from "react"
import { forwardRef, useRef } from "react"

import { cn } from "../lib/utils"
import { AnimatedBeam } from "./magicui/AnimatedBeam"
import { FaUser } from "react-icons/fa"

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 ",
          className,
        )}
      >
        {children}
      </div>
    )
  },
)

Circle.displayName = "Circle"

export default function Animated() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)
  const div8Ref = useRef<HTMLDivElement>(null)

  return (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden p-10" ref={containerRef}>
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
      
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref} className="size-13">
            <Icons.googleDrive />
          </Circle>
          <Circle ref={div4Ref} className="size-20 shadow-[0px_1px_13px_2px_rgba(147,_51,_234,_0.5)]">
            <Icons.openai />
          </Circle>
          <Circle ref={div5Ref} className="size-13">
            <Icons.googleDocs />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref} className="size-13">
            <Icons.notion />
          </Circle>

          <Circle ref={div6Ref} className="size-13">
            <Icons.zapier />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref} className="size-13">
            <Icons.whatsapp />
          </Circle>
          <Circle ref={div7Ref} className="size-19 border border-cyan-700" >
            <Icons.messenger />
          </Circle>
          <Circle ref={div8Ref} className="size-13 ">
            <Icons.notion1 />
          </Circle>
        </div>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div4Ref} curvature={75} endYOffset={-10} />
      <AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div4Ref} curvature={50} />
      <AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} curvature={75} endYOffset={10} />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam containerRef={containerRef} fromRef={div6Ref} toRef={div4Ref} curvature={50} reverse />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
      <AnimatedBeam
  containerRef={containerRef}
  fromRef={div4Ref} // IntervAI
  toRef={div7Ref}  // User
  curvature={75}
  endYOffset={10}
  pathWidth={4}
  pathColor="blue"
  gradientStartColor="#40a8ff"
  gradientStopColor="#0256ff"
/>
    </div>
  )
}

const Icons = {
  // user: () => {
  //   <p className="text-black">User</p>
  // },
  notion: () => (
    <p className="text-pink-800 font-bold">AI</p>
  ),
  notion1: () => (
    <p className="text-pink-800 font-bold">More</p>
  ),
  openai: () => (
    <p className="text-cyan-800 font-bold">IntervAI</p>
  ),
  googleDrive: () => (
    <p className="text-pink-800 font-bold">Web</p>
  ),
  whatsapp: () => (
    <p className="text-pink-800 font-bold">ML</p>
  ),
  googleDocs: () => (
    <p className="text-pink-800 font-bold">Data</p>
  ),
  zapier: () => (
    <p className="text-pink-800 font-bold">Web3</p>
  ),
  messenger: () => (
   <p className="text-pink-800 font-bold shadow-amber-400 shadow-lg"><FaUser/></p>
  ),
}

