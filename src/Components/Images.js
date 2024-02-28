import React, { useState, useEffect } from 'react';
import { CCard, CCardBody } from "@coreui/react"
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
// import { ImageSkeleton } from './SkeltonShimmer/ImageSkeleton';

// const queryClient = new QueryClient();
import io from 'socket.io-client';
import { Pagination, Spin } from 'antd';

// const socket = io('http://localhost:4300'); // Connect to your socket server


const Images = () => {
    const [fileObjects, setFileObjects] = useState([])
    // const [uploadSuccess, setUploadSuccess] = useState(false)
    // const [currentPage, setCurrentPage] = useState(1)
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])

    // const [page, setPage] = useState(1)
    // const [total, setTotal] = useState(1)
    // const [pageSize, setPageSize] = useState(20)

    const [pagination, setPagination] = useState({
        total: 1,
        currentPage: 1,
        limit: 100,
    });

    const itemRender = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>Previous</a>;
        }
        if (type === 'next') {
            return <a>Next</a>;
        }
        return originalElement;
    };
    const handlePagination = (i, j) => {
        console.log("gxjhsdgfjh", i, j)

        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: i,
        }));
        fetchImages(i, j)
    }


    // const queryClient = useQueryClient(); // Access queryClient

    // const { data: images, isLoading, isError } = useQuery(['images', currentPage], () =>
    //     axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${page.pageSize}&page=${currentPage}`, {
    //         // withCredentials: true // Add withCredentials: true here
    //     })
    //         .then(response => response?.data?.data?.result),
    //     {
    //         // enabled: currentPage === 1, // Disable query fetching after the first page
    //         // Pass query-specific configurations if needed
    //         // onSuccess: () => {
    //         //     // Invalidate the query to refetch data from the server when images are uploaded successfully
    //         //     queryClient.invalidateQueries('images');
    //         // }
    //     }
    // );

    // socket.on('queueCompleted', (soc) => {
    //     console.log(soc, "soccccc")
    //     // Trigger the action to fetch images from the backend
    //     // fetchImages();
    // });


    // useEffect(() => {
    //     // Listen for 'queueResolved' event from the backend
    //     // socket.on('queueCompleted', (soc) => {
    //     //     console.log(soc, "soccccc")
    //     //     // Trigger the action to fetch images from the backend
    //     //     fetchImages(pagination.currentPage, pagination.limit);
    //     // });

    //     // Fetch initial set of images when component mounts
    //     // fetchImages(pagination.currentPage, pagination.limit);

    //     // Cleanup function to remove socket listener when component unmounts
    //     // return () => {
    //     //     socket.off('queueCompleted');
    //     // };
    // }, [pagination.currentPage]);


    const fetchImages = async (page) => {
        console.log("ggggg", Math.random())
        setLoading(true)
        try {

            await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination.currentPage}`)
                .then((res) => {
                    setImages(res?.data?.data?.result)

                    let total = res?.data?.data?.totalItems / pagination.limit
                    console.log(res?.data?.data?.totalItems, "responseemmm")
                    setPagination((prevPagination) => ({
                        ...prevPagination,
                        total: total * 10,
                    }));

                    return res
                    // setTotal(total * 10)
                    // setPage(...page, { totalItems: res?.data?.data?.totalItems })
                    // toast.success("images fetched successfully")

                })
                .catch((err) => {
                    // toast.error("error while fetching images")
                })
                .finally(() => {
                    setLoading(false)
                })


        } catch (error) {
            // setLoading(false)
            console.error("Error fetching images:", error)
            // toast.error(error.response.data.message)
        }
    }
    async function fetchImages1() {
        try {
            const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination.currentPage}`);
            return response.data; // Assuming API response has data field containing the actual data
        } catch (error) {
            throw new Error('Failed to fetch images');
        }
    }

    const { data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData } = useQuery({
        queryKey: ['images'],
        queryFn: fetchImages1, // Make sure fetchImages function is correctly defined and returns data
        onSuccess: (data) => {

            console.log("Data fetched successfully:", data);
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
        },
        refetchInterval: 9000, //9 seconds
        networkStatusRefetchInterval: 3000, // Refetch every 5 minutes if network status changes
        retry: 3, // Retry 3 times in case of failure
        retryDelay: 1000, // Wait 1 second between retries
        refetchOnWindowFocus: true, // Refetch when window regains focus after being inactive
    });

    useEffect(() => {
        if (data) {
            console.log("data", data)
            setImages(data?.data?.result)

            let total = data?.data?.totalItems / pagination.limit
            console.log(data?.data?.totalItems, "responseemmm")
            setPagination((prevPagination) => ({
                ...prevPagination,
                total: total * 10,
            }));
        }
    }, [data])

    console.log("QUERYYYYYY", data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData)

    const handleOnChange = (_files) => {
        setFileObjects(_files)
    }

    const uploadImages = async (e) => {
        try {
            e.preventDefault()
            setLoading(true)
            if (fileObjects) {
                let formdata = new FormData();
                for (let file of fileObjects) {
                    formdata.append('upload_images', file)
                }

                const response = await axios.post(`${UPLOAD_IMAGES}`, formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data; '
                    },
                })

                toast.success(response?.data?.message)
                // queryClient.invalidateQueries('images'); // Invalidate the query to refetch data from the server when images are uploaded successfully
                setShow(false)
                setLoading(false)
                // setUploadSuccess(true)
            }
        } catch (error) {
            setLoading(false)
            console.error("Error uploading images:", error)
            toast.error(error.response.data.message)
        }
    }

    // Disable the query after the first successful fetch
    //   if (!isLoading && currentPage > 1) {
    //     queryClient.setQueryData(['images', currentPage], images);
    // }

    return (
        <div className="gallery-container">
            <header className="header">Uplaod Images </header>
            {loading ? (<>
                {/* <Loader /> */}
            </>) : (
                <>
                    <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
                    <main className="main-content container-fluid">
                        <Spin spinning={loading}>
                            <div className="image-gallery">
                                <CCard className="cardImage mb-0 mt-2">
                                    <CCardBody className="browse_img">
                                        <div className="horizontal-scroll">
                                            <div className="itemGallery d-flex align-items-center justify-content-center m-2">
                                                <span className="position-absolute">
                                                    <span className="testSpan"></span>
                                                </span>
                                                <label htmlFor={`check${"index"}`} className="upload_img mb-0 position-relative">
                                                    <img
                                                        onClick={() => setShow(true)}
                                                        className="addImage "
                                                        src={addIcon}
                                                        alt=""
                                                        loading="lazy" // Add lazy loading
                                                    />
                                                </label>
                                            </div>
                                            {
                                                images?.map((image, index) => (
                                                    <div key={index} className="itemGallery m-2 border p-2">
                                                        <span className="position-absolute">
                                                            <span className="testSpan"></span>
                                                            <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
                                                        </span>
                                                        <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
                                                            <img className="layerImg" src={`${BITBUCKET_URL}/${image.imageUrl}`} alt="" />
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </CCardBody>
                                    {/* {console.log(total, "totallllll")} */}
                                    <div className={style.pagination}>
                                        <div className="d-flex justify-content-end">
                                            <Pagination total={pagination?.total} current={pagination.currentPage} itemRender={itemRender} onChange={(i, j) => handlePagination(i, j)} className="mt-3" />
                                        </div>
                                        {/* <PaginationComponent itemsCount={page.totalItems} itemsPerPage={page.pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} /> */}
                                    </div>
                                </CCard>
                            </div>
                        </Spin>
                    </main>
                </>
            )}
        </div>
    );
}

export { Images };
