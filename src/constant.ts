export const siteConfigImages={
    "profile":"/profile.jpeg",
    "architectural-visualization":"/archviz.jpeg",
    "product-visualization":"/productviz.jpg",   
}
const transformCategory=(category:string)=>{
    return category.replace("-", " ").replace(/\b\w/g, char => char.toUpperCase());
}