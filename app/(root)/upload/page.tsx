"use client";
import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import React, { ChangeEvent, useState } from "react";

const page = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "public",
  })

  const video = {};
  const thumbnail = {};
  const [error, setError] = useState(null);
  
  const handleInputChange = (e:ChangeEvent) =>{
    const {name , value} = e.target;

    setFormData((prevState)=>({...prevState, [name]:value}))
  }
  
  return (
    <div className="wrapper-md upload-page">
      <h1>Upload a Video</h1>

     {error && <div className="error-field">{error}</div>}
     <form className="rounded-20 shadow-10 gap-5 w-full flex flex-col px-5 py-8">
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
      onFileChange={video.handleFileChange}
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
      onFileChange={thumbnail.handleFileChange}
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
      
     </form>
      
    </div>
  );
};

export default page;
