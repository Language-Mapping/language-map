import React, { FC } from 'react'

export const ColoredCircle: FC<{ color: string }> = (props) => {
  const { color } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      height="0.5em"
      width="0.5em"
    >
      <circle cx="12" cy="12" r="12" fill={color} />
    </svg>
  )
}
