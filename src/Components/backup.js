// import React, { useState, useEffect } from 'react';
// import { CCard, CCardBody } from "@coreui/react"
// import "./images.css"
// import { toast } from "react-toastify"
// import axios from "axios"
// import addIcon from "../Assets/AddIcon.png"
// import { UploadImage } from "../Modal/UploadImages"
// import { GET_UPLOAD_IMAGES, BITBUCKET_URL, UPLOAD_IMAGES } from "../Constant/Constant"
// import { PaginationComponent } from '../Components/Pagination/PaginationComponent'
// import style from "../Components/Pagination/Pagination.module.css"
// import { Loader } from "../Components/Loader/Loader"
// import { useQuery, useQueryClient } from 'react-query';
// // import { ImageSkeleton } from './SkeltonShimmer/ImageSkeleton';

// // const queryClient = new QueryClient();
// import io from 'socket.io-client';

// const socket = io('http://localhost:4300'); // Connect to your socket server


// const Images = () => {
//     const [fileObjects, setFileObjects] = useState([])
//     const [uploadSuccess, setUploadSuccess] = useState(false)
//     const [page, setPage] = useState({ current: 1, totalItems: 0, pageSize: 75 })
//     const [currentPage, setCurrentPage] = useState(1)
//     const [show, setShow] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [images, setImages] = useState([])

//     // const queryClient = useQueryClient(); // Access queryClient

//     // const { data: images, isLoading, isError } = useQuery(['images', currentPage], () =>
//     //     axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${page.pageSize}&page=${currentPage}`, {
//     //         // withCredentials: true // Add withCredentials: true here
//     //     })
//     //         .then(response => response?.data?.data?.result),
//     //     {
//     //         // enabled: currentPage === 1, // Disable query fetching after the first page
//     //         // Pass query-specific configurations if needed
//     //         // onSuccess: () => {
//     //         //     // Invalidate the query to refetch data from the server when images are uploaded successfully
//     //         //     queryClient.invalidateQueries('images');
//     //         // }
//     //     }
//     // );

//     // socket.on('queueCompleted', (soc) => {
//     //     console.log(soc, "soccccc")
//     //     // Trigger the action to fetch images from the backend
//     //     // fetchImages();
//     // });


//     useEffect(() => {
//         // Listen for 'queueResolved' event from the backend
//         socket.on('queueCompleted', (soc) => {
//             console.log(soc, "soccccc")
//             // Trigger the action to fetch images from the backend
//             fetchImages();
//         });

//         // Fetch initial set of images when component mounts
//         fetchImages();

//         // Cleanup function to remove socket listener when component unmounts
//         return () => {
//             socket.off('queueCompleted');
//         };
//     }, [currentPage]);


//     const fetchImages = async () => {
//         try {
//             await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${page.pageSize}&page=${currentPage}`)
//                 .then((res) => {
//                     console.log(res, "responseemmm")
//                     setImages(res?.data?.data?.result)
//                     setPage(...page, { totalItems: res?.data?.data?.totalItems })
//                     toast.success("images fetched successfully")

//                 })
//                 .catch((err) => {
//                     // toast.error("error while fetching images")
//                 })


//         } catch (error) {
//             // setLoading(false)
//             console.error("Error fetching images:", error)
//             // toast.error(error.response.data.message)
//         }
//     }

//     const handleOnChange = (_files) => {
//         setFileObjects(_files)
//     }

//     const uploadImages = async (e) => {
//         try {
//             e.preventDefault()
//             setLoading(true)
//             if (fileObjects) {
//                 let formdata = new FormData();
//                 for (let file of fileObjects) {
//                     formdata.append('upload_images', file)
//                 }

//                 const response = await axios.post(`${UPLOAD_IMAGES}`, formdata, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data; '
//                     },
//                 })

//                 toast.success(response?.data?.message)
//                 // queryClient.invalidateQueries('images'); // Invalidate the query to refetch data from the server when images are uploaded successfully
//                 setShow(false)
//                 setLoading(false)
//                 // setUploadSuccess(true)
//             }
//         } catch (error) {
//             setLoading(false)
//             console.error("Error uploading images:", error)
//             toast.error(error.response.data.message)
//         }
//     }

//     // Disable the query after the first successful fetch
//     //   if (!isLoading && currentPage > 1) {
//     //     queryClient.setQueryData(['images', currentPage], images);
//     // }

//     return (
//         <div className="gallery-container">
//             <header className="header">Header Content</header>
//             {loading ? (<>
//                 <Loader />
//             </>) : (
//                 <>
//                     <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
//                     <main className="main-content container-fluid">
//                         <div className="image-gallery">
//                             <CCard className="cardImage mb-0 mt-2">
//                                 <CCardBody className="browse_img">
//                                     <div className="horizontal-scroll">
//                                         <div className="itemGallery">
//                                             <span className="position-absolute">
//                                                 <span className="testSpan"></span>
//                                             </span>
//                                             <label htmlFor={`check${"index"}`} className="upload_img mb-0 position-relative">
//                                                 <img
//                                                     onClick={() => setShow(true)}
//                                                     className="addImage"
//                                                     src={addIcon}
//                                                     alt=""
//                                                     style={{
//                                                         height: "-webkit-fill-available",
//                                                         maxWidth: "86px",
//                                                         maxHeight: "71px",
//                                                         marginTop: "69px",
//                                                         marginLeft: "5px"
//                                                     }}
//                                                     loading="lazy" // Add lazy loading
//                                                 />
//                                             </label>
//                                         </div>
//                                         {
//                                             images?.map((image, index) => (
//                                                 <div key={index} className="itemGallery">
//                                                     <span className="position-absolute">
//                                                         <span className="testSpan"></span>
//                                                         <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
//                                                     </span>
//                                                     <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
//                                                         <img className="layerImg" src={`${BITBUCKET_URL}/${image.imageUrl}`} alt="" />
//                                                     </label>
//                                                 </div>
//                                             ))
//                                         }
//                                     </div>
//                                 </CCardBody>
//                                 <div className={style.pagination}>
//                                     <PaginationComponent itemsCount={page.totalItems} itemsPerPage={page.pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} />
//                                 </div>
//                             </CCard>
//                         </div>
//                     </main>
//                 </>
//             )}
//         </div>
//     );
// }

// export { Images };
