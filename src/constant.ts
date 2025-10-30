import { groq } from "next-sanity"

export const siteConfigImages={
    "profile":"/profile.jpeg",
    "architectural-visualization":"/archviz.jpeg",
    "product-visualization":"/productviz.jpg",   
    "others":"/others.jpeg",
}


export const siteQueries={
    "categories":{
        "query":groq`*[_type == "category"] {
            title,
            _id,
          }`,
        "cacheTag":"categories-list"
    },
    "projectsByCategory":{
        "query":groq`*[_type == "post" && references($categoryId)] | order(orderRank) {
            title,
            slug,
            description,
            mainImage {
                asset-> {
                    url,
                    "imageUrl": url + "?w=624&h=428&fit=crop"
                }
            }
        }`,
        "cacheTag":(slug:string)=>`category-projects-${slug}`
    },
    "project":{
        "query":groq`*[_type == "post" && slug.current == $slug][0] {
            title,
            description,
            videoId,
            category,
            slug{
             current
            },
            mainImage {
              asset-> {
                "imageUrl": url + "?w=800&h=600&fit=crop"
              }
            },
            "images": images[] {
              asset-> {
                url,
                "imageUrl": url + "?w=800&h=600&fit=fillmax"
              }
            }
          }`,
          "cacheTag":(slug:string)=>`project-${slug}`
    },
    "similarProjects":{
        "query":groq`*[_type == "post" && slug.current != $slug && category[0]._ref == $categoryId] | order(orderRank) [0...5] {
            title,
            slug,
            description,
            mainImage {
              asset-> {
                url,
                "imageUrl": url + "?w=624&h=428&fit=crop"
              }
            }
          }`,
          "cacheTag":({categoryId}:{categoryId:string})=>`similar-projects-${categoryId}`
    },
    "allProjects":{
      "query":groq`*[_type == "post" ] | order(orderRank) {
        title,
        slug,
        description,
        mainImage {
          asset-> {
            url,
            "imageUrl": url + "?w=624&h=428&fit=crop"
          }
        }
      }`,
      "cacheTag":"all-projects"
    }

}


