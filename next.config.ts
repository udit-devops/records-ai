import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
remotePatterns:[
  {hostname:'cast-u.b-cdn.net' ,protocol:'https',port:'',pathname:'/**'},
  {hostname:'reo-ucast.b-cdn.net',protocol:'https',port:'',pathname:'/**'},
  {hostname:'lh3.googleusercontent.com',protocol:'https',port:'',pathname:'/**'}
]
 }
};

export default nextConfig;
