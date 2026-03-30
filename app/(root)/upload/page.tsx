"use client";
import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { useFileInput } from "@/lib/hooks/useFileInput";
import React, { ChangeEvent, FormEvent, use, useState } from "react";

const page = () => {
  const [isSubmitting,setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  })

  const video = useFileInput(MAX_VIDEO_SIZE);
  const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e:ChangeEvent<HTMLInputElement>) =>{
    const {name , value} = e.target;

    setFormData((prevState)=>({...prevState, [name]:value}))
  }
  const handleSubmit = async( e: FormEvent) => {
    e.preventDefault();
   setSubmitting(true);
  try{
       if(!video.file || !thumbnail.file){
        setError("something is missing please ensure to upload both thumbnail and video" );
        return;
       }
       if (!formData.title || !formData.description) {
        setError("please fill both title adn description");
        return;
       }
  } catch(error){
    console.log("error uplaodign the video",error);
    
  } finally{
    setSubmitting(false);
  }
  }
  
  return (
    <div className="wrapper-md upload-page">
      <h1>Upload a Video</h1>

     {error && <div className="error-field">{error}</div>}
     <form className="rounded-20 shadow-10 gap-5 w-full flex flex-col px-5 py-8 onSubmit={handleSubmit">
        <FormField 
        id="title"
        label="Title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Enter your video title"
        />

        <FormField 
        id="description"
        label="description"
        value={formData.description}
        onChange={handleInputChange}
        as="textarea"
        placeholder="Enter the description for the video"
        />
      <FileInput 
      id="video"
      label="video"
      accept="video/*"
      file={video.file}
      previewUrl={video.previewUrl}
      onChange={video.handleFileChange}
      inputRef={video.inputRef}
      onReset ={video.resetFile}
      type="video"

      />
      <FileInput 
      id="thumbnail"
      label="thumbnail"
      accept="image/*"
      file={thumbnail.file}
      previewUrl={thumbnail.previewUrl}
      onChange={thumbnail.handleFileChange}
      inputRef={thumbnail.inputRef}
      onReset ={thumbnail.resetFile}
      type="video"
/>
        <FormField 
        id="visibility"
        label="visibility"
        value={formData.visibility}
        onChange={handleInputChange}
        as="select"
        options={[
          {value: 'public' , label : 'public'},
          {value: 'private' , label : 'private'}
        ]}
         
        />
          <button type="submit" disabled={isSubmitting} className="submit-button">
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </button>
     </form>
      
    </div>
  );
};

export default page;
