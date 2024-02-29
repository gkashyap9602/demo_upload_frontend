// export const API_BASE_URL = "https://devapi.mwwondemand.com";
export const API_BASE_URL = "http://localhost:4300";
// export const BITBUCKET_URL= "https://d35sh5431xvp8v.cloudfront.net"
export const BITBUCKET_URL= "https://d2kblzfdkn7o5w.cloudfront.net"

// console.log("hellow")
const getApiUrl = (endpoint) => API_BASE_URL + endpoint;

export const UPLOAD_IMAGES = getApiUrl("/api/v1/common/upload_images");
export const GET_UPLOAD_IMAGES = getApiUrl("/api/v1/common/get_upload_images");