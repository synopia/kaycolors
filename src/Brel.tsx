import './App.css'

import React, { useCallback, useEffect, useState } from 'react'

import brelBlue from './brel3_blue.png'
import brelRed from './brel3_red.png'
import brelYellow from './brel3_yellow.png'

const AuraColors = [brelBlue, brelRed, brelYellow]

const StarColors = ['#DDDD00', '#FF0000', '#0000FF']

enum Role {
  StarRedYellow,
  StarBlueYellow,
  CubeTop,
  CubeRight,
  CubeLeft,
  DiamondLeft,
  DiamondRight,
  DiamondBottom,
}

const Angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]

interface SVGProps {
  x: number
  y: number
  color: string
  onClick?: () => void
}

function Diamond(props: SVGProps) {
  const { onClick, x, y, color } = props
  const transform = `translate(${x + 5}, ${y + 5}) `
  return (
    <polygon
      transform={transform}
      fill={color}
      points="10,0 20,10 10,20 0,10"
      onClick={onClick}
    />
  )
}

function Cube(props: SVGProps) {
  const { onClick, x, y, color } = props
  const transform = `translate(${x + 5}, ${y + 5}) `

  return (
    <polygon
      transform={transform}
      points="0,0 20,0 20,20 0,20"
      fill={color}
      onClick={onClick}
    />
  )
}

function Star(props: SVGProps) {
  const { onClick, x, y, color } = props
  const transform = `translate(${x + 5}, ${y + 5})`
  return (
    <path
      transform={transform}
      d="M20.9244 9.07557L20.8931 9.10687L16.8321 13.1679C16.3185 13.6815 16.1238 14.4331 16.3233 15.1315L17.9462 20.8117C17.9646 20.8761 17.8928 20.9285 17.837 20.8913L17.8186 20.879L13.1094 17.7396C12.4376 17.2917 11.5624 17.2917 10.8906 17.7396L6.17083 20.8861C6.1124 20.9251 6.03711 20.8701 6.0564 20.8026L6.06393 20.7762L7.67671 15.1315C7.87625 14.4331 7.68147 13.6815 7.16787 13.1679L3.13547 9.13547L3.09579 9.09579C3.06044 9.06044 3.08548 9 3.13547 9H8.16667C8.97407 9 9.70228 8.51452 10.0128 7.76923L11.9369 3.15144C11.9603 3.09535 12.0397 3.09535 12.0631 3.15144L13.9872 7.76923C14.2977 8.51452 15.0259 9 15.8333 9H20.8931C20.9326 9 20.9523 9.04768 20.9244 9.07557Z"
      fill={color}
      onClick={onClick}
    />
  )
}

function parseInput(input: string): Role | undefined {
  const lower = input.trim().toLowerCase().replaceAll('/', '').replaceAll(' ', '')
  if (lower === 'ry') {
    return Role.StarRedYellow
  } else if (lower === 'by') {
    return Role.StarBlueYellow
  } else if (lower.startsWith('c')) {
    if (lower.includes('11')) {
      return Role.CubeTop
    } else if (lower.includes('3') || lower.includes('4') || lower.includes('5')) {
      return Role.CubeRight
    } else if (lower.includes('7') || lower.includes('8') || lower.includes('9')) {
      return Role.CubeLeft
    }
  } else if (lower.startsWith('d')) {
    if (lower.includes('9') || lower.includes('10') || lower.includes('11')) {
      return Role.DiamondLeft
    } else if (lower.includes('1') || lower.includes('2') || lower.includes('3')) {
      return Role.DiamondRight
    } else if (lower.includes('5') || lower.includes('6') || lower.includes('7')) {
      return Role.DiamondBottom
    }
  }
}

function validate(color: string, role: Role, shapes: { [key: string]: boolean }): string {
  const clickedShapes = Object.keys(shapes)
    .filter((k) => !shapes[k])
    .sort()
    .join(',')
  console.log(color, clickedShapes)
  let match = false
  switch (role) {
    case Role.StarBlueYellow:
      if (color.includes('blue')) {
        match = clickedShapes === 'star0,star3,star6'
      } else {
        match = clickedShapes === 'star2,star5,star8'
      }
      break
    case Role.StarRedYellow:
      if (color.includes('red')) {
        match = clickedShapes === 'star0,star3,star6'
      } else {
        match = clickedShapes === 'star1,star4,star7'
      }
      break
    case Role.CubeTop:
      match = clickedShapes === 'cube0,cube1,cube8'
      break
    case Role.CubeRight:
      match = clickedShapes === 'cube5,cube6,cube7'
      break
    case Role.CubeLeft:
      match = clickedShapes === 'cube2,cube3,cube4'
      break
    case Role.DiamondLeft:
      match = clickedShapes === 'diamond5,diamond6,diamond7'
      break
    case Role.DiamondRight:
      match = clickedShapes === 'diamond2,diamond3,diamond4'
      break
    case Role.DiamondBottom:
      match = clickedShapes === 'diamond0,diamond1,diamond8'
      break
  }
  return match ? 'Correct!' : 'Wrong!'
}

function Brel() {
  const [input, setInput] = useState('')
  const [state, setState] = useState<'init' | 'started' | 'finished'>('init')
  const [role, setRole] = useState<Role | undefined>(undefined)
  const [color, setColor] = useState<string | undefined>(undefined)
  const [time, setTime] = useState(10000.0)
  const [result, setResult] = useState('')
  const [shapes, setShapes] = useState<{ [key: string]: boolean }>({
    star0: false,
    star1: false,
    star2: false,
    star3: false,
    star4: false,
    star5: false,
    star6: false,
    star7: false,
    star8: false,
    cube0: false,
    cube1: false,
    cube2: false,
    cube3: false,
    cube4: false,
    cube5: false,
    cube6: false,
    cube7: false,
    cube8: false,
    diamond0: false,
    diamond1: false,
    diamond2: false,
    diamond3: false,
    diamond4: false,
    diamond5: false,
    diamond6: false,
    diamond7: false,
    diamond8: false,
  })
  useEffect(() => {
    if (state === 'init') {
      setShapes(
        Object.keys(shapes).reduce((res: { [k: string]: boolean }, k) => {
          res[k] = false
          return res
        }, {}),
      )
      setColor(undefined)
      setTime(10000)
      setResult('')
    } else if (state === 'started') {
      const role = parseInput(input)
      setRole(role)
      const idx = Math.floor(Math.random() * 3)
      setColor(AuraColors[idx])
    }
  }, [input, state])

  useEffect(() => {
    let interval = 0
    if (state === 'started') {
      interval = setInterval(() => {
        setTime((time: number) => time - 100)
      }, 100)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [state, time])

  useEffect(() => {
    if (time === 9000) {
      for (let i = 0; i < 9; i++) {
        setShapes((s) => ({ ...s, [`star${i}`]: true }))
      }
    } else if (time === 7000) {
      for (let i = 0; i < 9; i++) {
        setShapes((s) => ({ ...s, [`cube${i}`]: true }))
      }
    } else if (time === 5000) {
      for (let i = 0; i < 9; i++) {
        setShapes((s) => ({ ...s, [`diamond${i}`]: true }))
      }
    } else if (time === 0) {
      setState('finished')
      if (role !== undefined && color !== undefined) {
        setResult(validate(color, role, shapes))
      } else {
        setResult('you did not select a role')
      }
    }
  }, [time, role, shapes, color])
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <input
            type="text"
            value={input}
            disabled={state !== 'init'}
            onInput={(v) => {
              setInput((v.target as any).value)
            }}
          />
        </div>
        <div>
          {state === 'init' ? (
            <button
              onClick={() => {
                setState('started')
              }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={() => {
                setState('init')
              }}
            >
              Reset
            </button>
          )}
        </div>
        <div>Time: {time / 1000.0}</div>

        <div>
          <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
            {color ? (
              <image href={color} transform="translate(170,170) " width={100} />
            ) : null}
            {Angles.map((angle, index) => {
              const idx = `diamond${index}`

              return shapes[idx] ? (
                <Diamond
                  key={`diamond-${angle}`}
                  x={Math.cos(((angle - 90) / 180) * Math.PI) * 175 + 200}
                  y={-Math.sin(((angle - 90) / 180) * Math.PI) * 175 + 200}
                  color="#554422"
                  onClick={() => {
                    if (state === 'started') {
                      setShapes({ ...shapes, [idx]: false })
                    }
                  }}
                />
              ) : null
            })}
            {Angles.map((angle, index) => {
              const idx = `cube${index}`
              return shapes[idx] ? (
                <Cube
                  key={`cube-${angle}`}
                  x={Math.cos(((angle + 90) / 180) * Math.PI) * 120 + 200}
                  y={-Math.sin(((angle + 90) / 180) * Math.PI) * 120 + 200}
                  color="#224455"
                  onClick={() => {
                    if (state === 'started') {
                      setShapes({ ...shapes, [idx]: false })
                    }
                  }}
                />
              ) : null
            })}
            {Angles.map((angle, index) => {
              const idx = `star${index}`
              return shapes[idx] ? (
                <Star
                  key={`star-${angle}`}
                  color={StarColors[index % 3]}
                  x={Math.cos(((angle - 90) / 180) * Math.PI) * 90 + 200}
                  y={-Math.sin(((angle - 90) / 180) * Math.PI) * 90 + 200}
                  onClick={() => {
                    if (state === 'started') {
                      setShapes({ ...shapes, [idx]: false })
                    }
                  }}
                />
              ) : null
            })}
          </svg>
        </div>
        <div>{result}</div>
      </header>
    </div>
  )
}

export default Brel
