import React from 'react'
import Header from './Header'

export default function HeaderCombine(
 
    {element}
) {
  return (
    <div className='w-full  flex flex-col items-center justify-center '>

        <Header />
        {element}
    </div>
  )
}
