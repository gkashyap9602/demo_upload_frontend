// import React, { useState, useEffect } from 'react';
// import "./images.css"
// import { toast } from "react-toastify"
// import axios from "axios"
// import addIcon from "../Assets/AddIcon.png"
// import { UploadImage } from "../Modal/UploadImages"
// import { GET_UPLOAD_IMAGES, BITBUCKET_URL, UPLOAD_IMAGES } from "../Constant/Constant"
// import { PaginationComponent } from '../Components/Pagination/PaginationComponent'
// import style from "../Components/Pagination/Pagination.module.css"
// import { Loader } from "../Components/Loader/Loader"
// import { useQuery } from 'react-query';
// import { Button, Image, Pagination, Spin } from 'antd';
// import ProgressiveImage from 'react-progressive-image';
// import { useInView } from 'react-intersection-observer';

// const MAX_FILE_SIZE_BYTES = 1.8 * 1024 * 1024 * 1024; // 1GB in bytes
// // const socket = io('http://localhost:4300'); // Connect to your socket server

// const Images = () => {
//     const [fileObjects, setFileObjects] = useState([])
//     const [show, setShow] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [images, setImages] = useState([]);
//     const [currentDataLen, setCurrentDataLen] = useState(null);

//     const { ref, inView } = useInView({ threshold: 0.4 })

//     const [pagination, setPagination] = useState({
//         total: 1,
//         currentPage: 1,
//         limit: 15,
//         hasNextPage: true, // Enable pagination initially
//     });

//     async function fetchImages1(currentPage) {
//         try {
//             console.log(pagination, "CallsidelimittCall")
//             const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination.currentPage}`);
//             return response.data?.data; // Assuming API response has data field containing the actual data
//         } catch (error) {
//             throw new Error('Failed to fetch images');
//         }
//     }


//     const { data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData, isFetching, refetch } = useQuery({
//         queryKey: ['images'],
//         // queryFn: fetchImages1(), // Make sure fetchImages function is correctly defined and returns data
//         queryFn: () => fetchImages1(), // Pass a reference to fetchImages1
//         // enabled: false, // Initially disabled
//         onSuccess: (data) => {
//             console.log("Data fetched successfully:", data);
//             // setImages(data?.result)
//             setImages((prevImages) => [...prevImages, ...data.result]);
//             setPagination((prevPagination) => ({
//                 ...prevPagination,
//                 total: data.totalItems,
//             }));

//             //   Check if all items have been fetched
//             // const totalFetchedItems = pagination.limit * pagination.currentPage;
//             // console.log(totalFetchedItems, "totalFetchedItems")
//             // console.log(data?.totalItems, "data?.totalItems")

//             // if (totalFetchedItems >= data?.totalItems) {
//             //     setPagination(prevPagination => ({
//             //         ...prevPagination,
//             //         hasNextPage: false, // Disable further pagination
//             //     }));
//             // }

//         },
//         onError: (error) => {
//             console.error("Error fetching data:", error);
//         },
//         // enabled: false, // Initially disabled
//         // staleTime: 60000, // Data considered fresh for 60 seconds
//         getNextPageParam: (lastPage, pages) => {
//             // Assuming the API provides information about the next page
//             return lastPage.hasNextPage ? pages + 1 : undefined;
//         },
//         // refetchInterval: currentDataLen == pagination?.limit ? 3600000 : 12000,
//         // networkStatusRefetchInterval: 3000, // Refetch every 5 minutes if network status changes
//         // retry: 3, // Retry 3 times in case of failure
//         // retryDelay: 1000, // Wait 1 second between retries
//         // refetchOnWindowFocus: true, // Refetch when window regains focus after being inactive
//     });

//     // const fetchData = async () => {
//     //     // Check if the component is in view
//     // if (inView && !isLoading && !isRefetching && images.length < data?.totalItems) {
//     //     // setPagination((prevPagination) => ({
//     //     //     ...prevPagination,
//     //     //     currentPage: prevPagination.currentPage + 1,
//     //     // }));
//     //     setPagination((prevPagination) => ({
//     //         ...prevPagination,
//     //         limit: prevPagination.limit + 15,
//     //     }));

//     //     refetch()

//     //     }
//     // };

//     // useEffect(() => {
//     //     fetchData()
//     // }, [inView])

//     // useEffect(() => {
//     //     if (pagination.currentPage == 1) {
//     //         refetch()
//     //     }
//     // }, [])




//     const handleOnChange = (_files) => {
//         setFileObjects(_files)
//     }

//     const handleScroll = (e) => {
//         e.preventDefault(); // Prevent default browser behavior
//         const { scrollTop, clientHeight, scrollHeight } = e.target;
//         if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading && !isRefetching && images.length < data?.totalItems) {
//             console.log("Refetchinggggg")

//             setPagination((prevPagination) => ({
//                 ...prevPagination,
//                 currentPage: prevPagination.currentPage + 1,
//                 // currentPage: prevPagination.currentPage > 1 ? prevPagination.currentPage : 2, // Set currentPage to 2 if it's not already greater than 1

//             }));
//             // setPagination((prevPagination) => ({
//             //     ...prevPagination,
//             //     limit: prevPagination.limit + 15,
//             // }));

//             refetch()

//         };
//     }

//     console.log(pagination, "paginationendddd")

//     const uploadImages = async (e) => {
//         try {
//             e.preventDefault()
//             // setLoading(true)
//             if (fileObjects) {
//                 let formdata = new FormData();
//                 let totalFileSize = 0;

//                 for (let file of fileObjects) {
//                     totalFileSize += file.size;
//                     if (totalFileSize > MAX_FILE_SIZE_BYTES) {
//                         toast.error("Total file size exceeds 1GB limit");
//                         return;
//                     }
//                     formdata.append('upload_images', file)
//                 }

//                 //dont wait for response as it is in the queue
//                 const response = axios.post(`${UPLOAD_IMAGES}`, formdata, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data; '
//                     },
//                 })

//                 // toast.success(response?.data?.message)
//                 toast.success(`Your images have been successfully uploaded and will appear shortly`)
//                 setShow(false)
//                 setLoading(false)
//             }
//         } catch (error) {
//             setLoading(false)
//             console.error("Error uploading images:", error)
//             toast.error(error.response.data.message)
//         } finally {
//             setShow(false)
//             setLoading(false)

//         }
//     }

//     console.log(images, "imagesssss")
//     console.log("QUERYYYYYYdtaaaaa", data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData)


//     return (
//         <div className="gallery-container">
//             <header className="header">Upload Images </header>
//             {isLoading | loading ? (<>
//                 {/* <Loader /> */}
//             </>) : (
//                 <>
//                     <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
//                     {true ?
//                         <main className="main-content container-fluid border">
//                             <Spin spinning={loading}>
//                                 <div className="image-gallery" onScroll={handleScroll} >
//                                     <div className="horizontal-scroll d-flex justify-content-start">
//                                         <div role='button' className="border m-2" style={{ minWidth: '12rem', height: '12rem', display: 'grid', placeItems: 'center' }}>
//                                             <img
//                                                 onClick={() => setShow(true)}
//                                                 className="addImage1"
//                                                 src={addIcon}
//                                                 alt=""
//                                                 style={{
//                                                     maxWidth: "86px",
//                                                     maxHeight: "86px",
//                                                     marginLeft: "5px"
//                                                 }}
//                                                 loading="lazy" // Add lazy loading
//                                             />
//                                         </div>
//                                         {
//                                             images?.map((image, index) => (
//                                                 <div key={index} className="itemGallery m-2 border" style={{ minWidth: '12rem', height: '12rem', display: 'grid', placeItems: 'center' }} >
//                                                     <span className="position-absolute">
//                                                         <span className="testSpan"></span>
//                                                         <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
//                                                     </span>
//                                                     <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
//                                                         <ProgressiveImage src={`${BITBUCKET_URL}/${image.imageUrl}`}>
//                                                             {(src, loading) => (
//                                                                 loading ?
//                                                                     <Spin />
//                                                                     :
//                                                                     <Image src={src} />
//                                                             )}
//                                                         </ProgressiveImage>
//                                                         {/* <Image
//                                                             src={`${BITBUCKET_URL}/${image.imageUrl}`}

//                                                         /> */}
//                                                     </label>
//                                                 </div>
//                                             ))
//                                         }
//                                     </div>
//                                     {/* <div ref={ref} style={{ textAlign: "center" }}>
//                                         Loading..
//                                     </div> */}
//                                     {/* {pagination?.total > 0 &&
//                                         <div className={style.pagination}>
//                                             <PaginationComponent itemsCount={pagination.total} itemsPerPage={pagination.limit} currentPage={pagination.currentPage} setPagination={setPagination} />

//                                         </div>
//                                     } */}
//                                 </div>
//                             </Spin>
//                         </main>
//                         :
//                         <>
//                             No Images Found!
//                         </>
//                     }
//                 </>
//             )}
//         </div>
//     );
// }

// export { Images };