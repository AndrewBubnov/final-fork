import React, { useState } from 'react'
import './ZoomPhoto.css'

const ZoomPhoto = ({src}) => {
    const [className, setClassname] = useState('image original')
    const handleClick = () => {
        setClassname(className === 'image original' ? 'image zoomed' : 'image original')
    }
    return(
        <img onClick={handleClick} src={src} className={className} alt=''/>
    )
}

export default ZoomPhoto