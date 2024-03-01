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
// import { Pagination, Spin } from 'antd';

// const socket = io('http://localhost:4300'); // Connect to your socket server


// const Images = () => {
//     const [fileObjects, setFileObjects] = useState([])
//     // const [uploadSuccess, setUploadSuccess] = useState(false)
//     // const [currentPage, setCurrentPage] = useState(1)
//     const [show, setShow] = useState(false)
//     const [loading, setLoading] = useState(false)
//     const [images, setImages] = useState([])

//     // const [page, setPage] = useState(1)
//     // const [total, setTotal] = useState(1)
//     // const [pageSize, setPageSize] = useState(20)

//     const [pagination, setPagination] = useState({
//         total: 1,
//         currentPage: 1,
//         limit: 100,
//     });

//     const itemRender = (_, type, originalElement) => {
//         if (type === 'prev') {
//             return <a>Previous</a>;
//         }
//         if (type === 'next') {
//             return <a>Next</a>;
//         }
//         return originalElement;
//     };
//     const handlePagination = (i, j) => {
//         console.log("gxjhsdgfjh", i, j)

//         setPagination((prevPagination) => ({
//             ...prevPagination,
//             currentPage: i,
//         }));
//         fetchImages(i, j)
//     }


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
//         // socket.on('queueCompleted', (soc) => {
//         //     console.log(soc, "soccccc")
//         //     // Trigger the action to fetch images from the backend
//         //     fetchImages(pagination.currentPage, pagination.limit);
//         // });

//         // Fetch initial set of images when component mounts
//         fetchImages(pagination.currentPage, pagination.limit);

//         // Cleanup function to remove socket listener when component unmounts
//         return () => {
//             socket.off('queueCompleted');
//         };
//     }, [pagination.currentPage]);


//     const fetchImages = async (page) => {
//         setLoading(true)
//         try {

//             await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination.currentPage}`)
//                 .then((res) => {
//                     setImages(res?.data?.data?.result)

//                     let total = res?.data?.data?.totalItems / pagination.limit
//                     console.log(res?.data?.data?.totalItems, "responseemmm")
//                     setPagination((prevPagination) => ({
//                         ...prevPagination,
//                         total: total * 10,
//                     }));


//                     // setTotal(total * 10)
//                     // setPage(...page, { totalItems: res?.data?.data?.totalItems })
//                     // toast.success("images fetched successfully")

//                 })
//                 .catch((err) => {
//                     // toast.error("error while fetching images")
//                 })
//                 .finally(() => {
//                     setLoading(false)
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
//             <header className="header">Uplaod Images </header>
//             {loading ? (<>
//                 <Loader />
//             </>) : (
//                 <>
//                     <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
//                     <main className="main-content container-fluid">
//                         <Spin spinning={loading}>
//                             <div className="image-gallery">
//                                 <CCard className="cardImage mb-0 mt-2">
//                                     <CCardBody className="browse_img">
//                                         <div className="horizontal-scroll">
//                                             <div className="itemGallery d-flex align-items-center justify-content-center m-2">
//                                                 <span className="position-absolute">
//                                                     <span className="testSpan"></span>
//                                                 </span>
//                                                 <label htmlFor={`check${"index"}`} className="upload_img mb-0 position-relative">
//                                                     <img
//                                                         onClick={() => setShow(true)}
//                                                         className="addImage "
//                                                         src={addIcon}
//                                                         alt=""
//                                                         loading="lazy" // Add lazy loading
//                                                     />
//                                                 </label>
//                                             </div>
//                                             {
//                                                 images?.map((image, index) => (
//                                                     <div key={index} className="itemGallery m-2 border p-2">
//                                                         <span className="position-absolute">
//                                                             <span className="testSpan"></span>
//                                                             <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
//                                                         </span>
//                                                         <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
//                                                             <img className="layerImg" src={`${BITBUCKET_URL}/${image.imageUrl}`} alt="" />
//                                                         </label>
//                                                     </div>
//                                                 ))
//                                             }
//                                         </div>
//                                     </CCardBody>
//                                     {/* {console.log(total, "totallllll")} */}
//                                     <div className={style.pagination}>
//                                         <div className="d-flex justify-content-end">
//                                             <Pagination total={pagination?.total} current={pagination.currentPage} itemRender={itemRender} onChange={(i, j) => handlePagination(i, j)} className="mt-3" />
//                                         </div>
//                                         {/* <PaginationComponent itemsCount={page.totalItems} itemsPerPage={page.pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} /> */}
//                                     </div>
//                                 </CCard>
//                             </div>
//                         </Spin>
//                     </main>
//                 </>
//             )}
//         </div>
//     );
// }

// export { Images };


import React, { useState, useEffect } from 'react';
import "./images.css"
import { toast } from "react-toastify"
import axios from "axios"
import addIcon from "../Assets/AddIcon.png"
import { UploadImage } from "../Modal/UploadImages"
import { GET_UPLOAD_IMAGES, BITBUCKET_URL, UPLOAD_IMAGES } from "../Constant/Constant"
import { PaginationComponent } from '../Components/Pagination/PaginationComponent'
import style from "../Components/Pagination/Pagination.module.css"
import { Loader } from "../Components/Loader/Loader"
import { useQuery } from 'react-query';
import { Button, Image, Pagination, Spin } from 'antd';
import ProgressiveImage from 'react-progressive-image';
import { useInView } from 'react-intersection-observer';

const MAX_FILE_SIZE_BYTES = 1.8 * 1024 * 1024 * 1024; // 1GB in bytes
// const socket = io('http://localhost:4300'); // Connect to your socket server

const Images = () => {
    const [fileObjects, setFileObjects] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([]);
    const [currentDataLen, setCurrentDataLen] = useState(null);

    const { ref, inView } = useInView({ threshold: 0.4 })

    const [pagination, setPagination] = useState({
        total: 1,
        currentPage: 1,
        limit: 15,
        hasNextPage: true, // Enable pagination initially
    });


    console.log("pagination out", pagination?.currentPage)
    async function fetchImages1() {
        try {
            const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination?.currentPage}`);
            return response.data?.data; // Assuming API response has data field containing the actual data
        } catch (error) {
            throw new Error('Failed to fetch images');
        }
    }


    const { data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData, isFetching, refetch } = useQuery({
        queryKey: ['images'],
        queryFn: () => fetchImages1(), // Pass a reference to fetchImages1
        onSuccess: (data) => {
            console.log("Data fetched successfully:", data);
            // setImages(data?.result)
            setImages((prevImages) => [...prevImages, ...data.result]);
            setPagination((prevPagination) => ({
                ...prevPagination,
                total: data.totalItems,
            }));
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
        },
    });

    // const fetchData = async () => {
    //     // Check if the component is in view
    // if (inView && !isLoading && !isRefetching && images.length < data?.totalItems) {
    //     // setPagination((prevPagination) => ({
    //     //     ...prevPagination,
    //     //     currentPage: prevPagination.currentPage + 1,
    //     // }));
    //     setPagination((prevPagination) => ({
    //         ...prevPagination,
    //         limit: prevPagination.limit + 15,
    //     }));

    //     refetch()

    //     }
    // };

    // useEffect(() => {
    //     fetchData()
    // }, [inView])



    const handleOnChange = (_files) => {
        setFileObjects(_files)
    }

    const handleScroll = (e) => {
        e.preventDefault(); // Prevent default browser behavior
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading && !isRefetching && images.length < data?.totalItems) {
            console.log("Refetchinggggg")

            // setPagination((prevPagination) => ({
            //     ...prevPagination,
            //     currentPage: prevPagination.currentPage + 1,
            // }));
            // refetch(pagination?.currentPage)

        };
    }

    console.log(pagination, "paginationendddd")

    const uploadImages = async (e) => {
        try {
            e.preventDefault()
            // setLoading(true)
            if (fileObjects) {
                let formdata = new FormData();
                let totalFileSize = 0;

                for (let file of fileObjects) {
                    totalFileSize += file.size;
                    if (totalFileSize > MAX_FILE_SIZE_BYTES) {
                        toast.error("Total file size exceeds 1GB limit");
                        return;
                    }
                    formdata.append('upload_images', file)
                }

                const response = await axios.post(`${UPLOAD_IMAGES}`, formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data; '
                    },
                })

                // toast.success(response?.data?.message)
                toast.success(`Your images have been successfully uploaded and will appear shortly`)
                setShow(false)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.error("Error uploading images:", error)
            toast.error(error.response.data.message)
        } finally {
            setShow(false)
            setLoading(false)

        }
    }

    console.log(images, "imagesssss")
    console.log("QUERYYYYYYdtaaaaa", data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData)

    const loadMoreData = (a, b) => {
        console.log("jjjjj", a, b)
    }


    return (
        <div className="gallery-container">
            <header className="header">Upload Images </header>
            {isLoading | loading ? (<>
                {/* <Loader /> */}
            </>) : (
                <>
                    <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
                    {true ?
                        <main className="main-content container-fluid border">
                            <Spin spinning={loading}>
                                <div className="image-gallery" id="scrollableDiv" >
                                    <InfiniteScroll
                                        dataLength={pagination?.total}
                                        next={loadMoreData}
                                        hasMore={images.length < pagination?.limit}
                                        loader={<Skeleton avatar paragraph={{ rows: 1, }} active />}
                                        endMessage={<Divider plain>No More Data Found</Divider>}
                                        scrollableTarget="scrollableDiv"
                                    >
                                        <div className="horizontal-scroll d-flex justify-content-start">
                                            <div role='button' className="border m-2" style={{ minWidth: '12rem', height: '12rem', display: 'grid', placeItems: 'center' }}>
                                                <img
                                                    onClick={() => setShow(true)}
                                                    className="addImage1"
                                                    src={addIcon}
                                                    alt=""
                                                    style={{
                                                        maxWidth: "86px",
                                                        maxHeight: "86px",
                                                        marginLeft: "5px"
                                                    }}
                                                    loading="lazy" // Add lazy loading
                                                />
                                            </div>
                                            {
                                                images?.map((image, index) => (
                                                    <div key={index} className="itemGallery m-2 border" style={{ minWidth: '12rem', height: '12rem', display: 'grid', placeItems: 'center' }} >
                                                        <span className="position-absolute">
                                                            <span className="testSpan"></span>
                                                            <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
                                                        </span>
                                                        <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
                                                            <ProgressiveImage src={`${BITBUCKET_URL}/${image.imageUrl}`}>
                                                                {(src, loading) => (
                                                                    loading ?
                                                                        <Spin />
                                                                        :
                                                                        <Image src={src} />
                                                                )}
                                                            </ProgressiveImage>
                                                            {/* <Image
                                                            src={`${BITBUCKET_URL}/${image.imageUrl}`}

                                                        /> */}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </InfiniteScroll>
                                </div>
                            </Spin>
                        </main>
                        :
                        <>
                            No Images Found!
                        </>
                    }
                </>
            )}
        </div>
    );
}

export { Images };