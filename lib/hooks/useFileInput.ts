import { initialVideoState } from "@/constants"
import { ChangeEvent, useRef, useState } from "react"

export const useFileInput = (maxSize: number) =>{
const [file,setFile] = useState(null) 
const [previewUrl,setPriviewUrl] = useState ('')
const [duration , setDuration] = useState( 0 )
const inputRef = useRef(null)

const handleFileChange= (e: ChangeEvent){
if (e.target.files?.[0]){
    const selectedFile = e.target.files[0];
}
}

}