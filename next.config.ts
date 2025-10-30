
import createJiti from "jiti";
import { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const jiti = createJiti(fileURLToPath(import.meta.url));
 
jiti("./src/env");

const nextConfig:NextConfig = {
    images:{
        unoptimized:true
    },
    cacheComponents:true,
    typescript:{
        ignoreBuildErrors:true
    }
} ;

export default nextConfig;
