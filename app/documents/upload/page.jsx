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
    <div className="w-full min-h-[91vh] bg-paper py-8 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-ink text-center mb-6">
          Upload your document
        </h1>
        <label
          className="w-full flex flex-col gap-2 items-center justify-center border-2 border-dashed border-line rounded-card text-muted h-[26vh] bg-cream hover:bg-mist transition-colors cursor-pointer"
          htmlFor="file"
        >
          <img
            width="34"
            height="34"
            src="https://img.icons8.com/ios/50/8a8a82/upload--v1.png"
            alt=""
          />
          <span className="text-sm">
            {file ? file.name : "Click here to select a file"}
          </span>
        </label>
        <input
          name="file"
          id="file"
          className="hidden"
          type="file"
          onChange={(e) => {
            setFile(e.target.files?.[0]);
          }}
        />
        <div className="w-full py-2 flex flex-row items-center justify-center my-4">
          <button
            className="w-full h-12 rounded-lg bg-ink mx-auto relative text-white overflow-hidden font-medium"
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
          <span className="relative text-base z-50 text-white">Upload</span>
          <span
            className="bg-white/25 h-full z-20 absolute top-0 left-0 transition-all duration-150 ease-in-out"
            style={{ width: `${progress}%` }}
          ></span>
        </button>
        </div>
      </div>
    </div>
  );
}
