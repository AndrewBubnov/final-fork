import React, {useState} from 'react';
import Dialog from '@material-ui/core/Dialog';


const ZoomPhoto = ({src, subject, height}) => {
    const [zoomed, setZoomed] = useState(false)
    const handleClick = () => {
        setZoomed(!zoomed)
    }

    const handleClose = () => {
        setZoomed(false)
    }
    const width = window.innerWidth > 380 ? 380 : window.innerWidth
    const zoomedCarHeight = Math.floor((width - 20) / 1.8) + 10
    const zoomedHeight = subject === 'user' ? '50vh' : zoomedCarHeight

    const dialog = zoomed ? (
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
    ) : null

    return (
        <>
            <img onClick={handleClick} src={src} style={{height}} alt=''/>
            {dialog}
        </>

    )
}


export default ZoomPhoto


