import React from 'react'

const DocumentCard = ({data}) => {
  return (
    <div className="w-[85%] h-auto py-4 px-2 box-shadow flex flex-row items-center justify-around my-4">
        <div className="flex flex-row items-center gap-4 w-[60%]">
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/color/48/pdf.png"
            alt="pdf"
          />
          <p className='w-[60%] break-words'>{data.title}</p>
        </div>
        <a
          href={data.url}
          target="_blank"
          style={{ textDecoration: "none" }}
          className="max-w-40  h-10 py-2 px-6 flex flex-row items-center text-white justify-center bg-purple-700"
        >
          View
        </a>
      </div>

  )
}

export default DocumentCard