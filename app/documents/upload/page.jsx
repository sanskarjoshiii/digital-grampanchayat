"use client";
import * as React from "react";
import { useEdgeStore } from "@/lib/edgestore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function Page() {
    const router=useRouter();
  const [file, setFile] = React.useState(null);
  const { edgestore } = useEdgeStore();
  const [progress, setProgress] = React.useState(0);
  return (
    <div className="w-full h-[80vh] py-2">
      <div className="w-full h-20 flex flex-row items-center justify-center text-2xl font-medium">
        Upload Your Document
      </div>
      <label
        className="w-[90%] mx-auto flex items-center justify-center border-4 text-white border-black h-[20vh] bg-gray-500  border-dashed"
        htmlFor="file"
      >
       Click Here to Upload File
      </label>
      <input
        name="file"
        id="file"
        className="hidden"
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        //   console.log(e.target.files?.[0])
        }}
      />
      <div className="w-full h-auto py-2 flex flex-row items-center justify-center my-4 px-2">
        <button
          className="w-[80%] h-[8vh] rounded-md bg-red-600 mx-auto relative text-white"
          onClick={async () => {
            if (file) {
              const res = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    setProgress(progress)
                  },
              });
             const data =  await fetch("/api/admin/document",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({title:file.name,url:res.url,createdAt:res.uploadedAt})
              })
              if(data.status==200){
                toast.success("File Uploaded Successfully")
                router.push("/documents")

              }
            }
            else{
                toast.error("Select file first")
            }
          }}
        >
          <span className="relative text-xl z-50 text-white">
            {" "}
            Upload
          </span>
          <span className="bg-green-500  h-full rounded-md z-20 absolute top-0 left-0 transition-all duration-150 ease-in-out" style={{width:`${progress}%`}}></span>
        </button>
      </div>
    </div>
  );
}
