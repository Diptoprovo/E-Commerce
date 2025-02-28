import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        // <div className='text-center'>
        //     <span className='me-4'>{text1}</span><span>{text2}</span>
        // </div>
        <div className="w-screen flex justify-center mt-10">
            <span className="w-3/4 text-center border-b-green-800 border-b-4  leading-[0.1em] mt-10 relative block text-3xl roboto-mono">
                <span className="bg-white px-10"><span className=' font-bold text-green-600'>{text1}</span> <span className=' font-bold text-green-900'>{text2}</span></span>
            </span>
        </div>
    )
}

export default Title
