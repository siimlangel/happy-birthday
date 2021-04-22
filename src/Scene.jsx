import React, {useEffect, useState } from 'react';
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch/sketch";


// Run window resize handler only after some given time
function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}

const Scene = () => {

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            setDimensions({
              height: window.innerHeight,
              width: window.innerWidth
            })
          }, 500)

    

        window.addEventListener('resize', debouncedHandleResize)

        return _ => {
            window.removeEventListener('resize', debouncedHandleResize);
        }
    }, [dimensions]);


    return (
        <div>
            <P5Wrapper sketch={sketch} dimensions={dimensions} />
        </div>
    )
}
export default Scene;