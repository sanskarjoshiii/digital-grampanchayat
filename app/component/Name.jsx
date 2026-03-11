"use client"
import React from 'react'
import { useGlobalContext } from '../context/context'

const Name = ({breaks}) => {
  const {language}=useGlobalContext();
  return (
    <div className='text-blue-600'>{language=="english"?<><span className='text-xl text-red-700'>D</span>igital Gram Panchayat</>:"डिजिटल ग्राम पंचायत"}</div>
  )
}

export default Name