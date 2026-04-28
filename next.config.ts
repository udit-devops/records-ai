import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript:{
    ignoreBuildErrors:true
  },
 images:{
remotePatterns:[
  // {hostname:'cast-u.b-cdn.net' ,protocol:'https',port:'',pathname:'/**'},
  // {hostname:'reo-ucast.b-cdn.net',protocol:'https',port:'',pathname:'/**'},
  {hostname:'*',protocol:'https',port:'',pathname:'/**'}
]
 }
};

export default nextConfig;
