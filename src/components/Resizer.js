import React, {useEffect, useRef} from 'react'
import styled from '@xstyled/styled-components'
import {debounce} from 'lodash'


const setBorder = dir => props => props.direction === dir && `1px solid ${props.border}`

const StyledSizer = styled.div`
  flex: 0 0 ${props => props.size};
  width: ${props => props.direction === 'vertical' ? props.size : '100%'};
  height: ${props => props.direction === 'horizontal' ? props.size : '100%'};
  background-color: ${props => props.color};
  cursor: ${props => props.direction === 'horizontal' ? 'row-resize' : 'col-resize'};
  border-left: ${setBorder('vertical')};
  border-right: ${setBorder('vertical')};
  border-top: ${setBorder('horizontal')};
  border-bottom: ${setBorder('horizontal')};
  &:hover {
    opacity: .5;
  }
`

const background = document.createElement('div')
background.style = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  opacity: 0;
  cursor: row-resize;
`

// function getCoords(elem) {
//   var box = elem.getBoundingClientRect()
//
//   return {
//     top: box.top + pageYOffset,
//     left: box.left + pageXOffset,
//     width: box.width,
//     height: box.height,
//   }
// }

let bodyUserSelect
let params = {start: null, param: null, lastPos: null, lastCursor: null}

const saveSettings = debounce((key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error(e)
  }
}, 250)

export const Resizer = ({
  direction,
  color = '#ccc',
  border = 'rgba(0, 0, 0, .5)',
  size = '6px',
  style,
  onResize,
  value,
  min,
  max,
  save,
  cursor,
}) => {
  const ref = useRef(null)

  const handleMouseMove = e => {
    params.newCursor = (direction === 'vertical' ? e.pageX : e.pageY)
    const shift = params.newCursor - params.start
    const dir = Math.sign(params.lastCursor - params.newCursor)
    if (Math.abs(params.lastCursor - params.newCursor) < 1) return
    let result = shift + params.value
    if (result < min) result = min
    if (result > max) result = max
    if (dir > 0 && Math.abs(result - min) < 20) {
      result = min
    } else if (dir < 0 && Math.abs(result - max) < 50) {
      result = max
    }
    requestAnimationFrame(() => {
      params.newValue = onResize && onResize(result, shift, params.value)
      save && saveSettings(save, result)
    })
    params.lastCursor = params.newCursor
  }

  const handleMouseUp = e => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.removeChild(background)
    document.body.style['user-select'] = bodyUserSelect
  }

  const handleMouseDown = e => {
    if (e.button !== 0 || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return

    background.style.cursor = cursor || (direction === 'vertical' ? 'col-resize' : 'row-resize')
    bodyUserSelect = document.body.style['user-select'] || ''
    document.body.appendChild(background)
    document.body.style['user-select'] = 'none'

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    if (direction === 'vertical') {
      params.start = params.lastCursor = e.pageX
      params.value = value
    } else {
      params.start = params.lastCursor = e.pageY
      params.value = value
    }
  }

  useEffect(() => {
    ref.current.addEventListener('mousedown', handleMouseDown)
    return () => {
      ref.current.removeEventListener('mousedown', handleMouseDown)
    }
  }, [value])

  return (
    <StyledSizer
      ref={ref}
      direction={direction}
      color={color}
      border={border}
      size={size}
      style={style}
    />
  )
}
