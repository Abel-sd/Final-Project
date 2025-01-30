import React from 'react'

import { TailSpin } from 'react-loader-spinner'
export default function LoadingPage() {
  return (
    <div className="w-screen  h-[400px] flex items-center justify-center">
       <TailSpin
  visible={true}
  height="80"
  width="80"
  color="black"
  ariaLabel="tail-spin-loading"
  radius="1"
  wrapperStyle={{}}
  wrapperClass=""
  />
    </div>
  )
}
