import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';


const ZoomPhoto = ({ src, subject, height }) => {
    const [zoomed, setZoomed] = useState(false)
    const handleClick = () => {
        setZoomed(!zoomed)
    }

    const handleClose = () => {
        setZoomed(false)
    }
    const zoomedHeight = subject === 'user' ? '50vh' : 200
    let outputImage = null
    if (!zoomed) {
        outputImage = <img onClick={handleClick} src={src} style={{height}} alt=''/>
    } else {
        outputImage = (
            <Dialog
                onClose={handleClose}
                open={zoomed}
                PaperProps={{
                    style: {
                        margin: 0,
                    },
                }}
            >
                <img onClick={handleClick} src={src} style={{height: zoomedHeight, padding: 10}} alt=''/>
            </Dialog>
        )
    }

    return (
        outputImage
    )
}


export default ZoomPhoto


