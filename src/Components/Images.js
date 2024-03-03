import React, { useState, useEffect } from 'react';
import "./images.css"
import { toast } from "react-toastify"
import axios from "axios"
import addIcon from "../Assets/AddIcon.png"
import { UploadImage } from "../Modal/UploadImages"
import { GET_UPLOAD_IMAGES, BITBUCKET_URL, UPLOAD_IMAGES } from "../Constant/Constant"
// eslint-disable-next-line no-unused-vars
import style from "../Components/Pagination/Pagination.module.css"
import { Loader } from "../Components/Loader/Loader"
// import { useInfiniteQuery } from 'react-query'; // Import useInfiniteQuery
import { useInfiniteQuery } from '@tanstack/react-query'; // Import useInfiniteQuery

import { Image, Spin } from 'antd';
import ProgressiveImage from 'react-progressive-image';
import { useInView } from 'react-intersection-observer';

const MAX_FILE_SIZE_BYTES = 1.8 * 1024 * 1024 * 1024; // 1GB in bytes

const Images = () => {
    const [fileObjects, setFileObjects] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    // const [images, setImages] = useState([]);
    // const [limit, setLimit] = useState(15);

    // eslint-disable-next-line no-unused-vars
    const { ref, inView } = useInView({ threshold: 0.4 })

    const fetchImages = async ({ pageParam }) => { // Modify fetch function to accept page parameter
        try {
            console.log("propsssFetching page", pageParam)
            // console.log("Fetching page:", page);
            const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${15}&page=${pageParam}`);
            return response.data?.data?.result;
        } catch (error) {
            throw new Error('Failed to fetch images');
        }
    };

    const { data, fetchNextPage, error, hasNextPage, isLoading, isError, isSuccess, isFetching, status, isFetchingNextPage,
    } = useInfiniteQuery(
        {
            queryKey: ['images'],
            queryFn: fetchImages,
            initialPageParam: 1,
            // refetchInterval: 3600000000,
            getNextPageParam: (lastPage, allPages) => {
                console.log(lastPage, "lastpages")
                // console.log(pages,"pages")
                let nextPage = lastPage.length ? allPages.length + 1 : undefined;
                return nextPage

            },
            // refetchInterval: currentDataLen == pagination?.limit ? 3600000 : 12000,
            // networkStatusRefetchInterval: 3000, // Refetch every 5 minutes if network status changes
            retry: 3, // Retry 3 times in case of failure
            retryDelay: 10000, // Wait 1 second between retries
            refetchOnWindowFocus: false, // Refetch when window regains focus after being inactive
        },

    );

    console.log(data, "dataaaaKKK")
    const handleOnChange = (_files) => {
        setFileObjects(_files)
    }


    useEffect(() => {
        console.log(inView, "invieww")
        if (inView && hasNextPage) {
            console.log("firerr")
            fetchNextPage()
        }

    }, [inView, hasNextPage, fetchNextPage])

    // const handleScroll = async (e) => {
    //     e.preventDefault();
    //     const { scrollTop, clientHeight, scrollHeight } = e.target;
    //     if (scrollTop + clientHeight >= scrollHeight - 20 && hasNextPage) {
    //         console.log("fetchNextPagefetch again")
    //         fetchNextPage(); // Fetch next page
    //     }
    // }

    const uploadImages = async (e) => {
        try {
            e.preventDefault()
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

                const response = axios.post(`${UPLOAD_IMAGES}`, formdata, {
                    headers: {
                        'Content-Type': 'multipart/form-data; '
                    },
                })

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


    console.log(status, "status")
    console.log(isFetchingNextPage, "isFetchingNextPage")
    console.log(isError, "isError")
    console.log(hasNextPage, "hasNextPage")

    const content = data?.pages?.map((page) => (
        page?.map((image, index) => (
            <div key={index} className="itemGallery m-2 border" style={{ minWidth: '12rem', height: '12rem', display: 'grid', placeItems: 'center' }} >
                <span className="position-absolute">
                    <span className="testSpan"></span>
                    <img onClick={(e) => { }} className="crossImg" src={"cross"} alt="" />
                </span>
                <label htmlFor={`check${index}`} className="upload_img mb-0 position-relative">
                    {/* <ProgressiveImage src={`${BITBUCKET_URL}/${image.imageUrl}`}>
                        {(src, loading) => (
                            loading ?
                                <Spin />
                                :
                                <Image src={src} />
                        )}
                    </ProgressiveImage> */}
                    <Image src={`${BITBUCKET_URL}/${image.imageUrl}`} />


                </label>
            </div>
        ))
    ))

    if (status === 'pending') {
        return <p>....Loading</p>
    }
    if (status === 'error') {
        return <p>....Error{error.message}</p>
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
                                <div className="image-gallery" >
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
                                                loading="lazy"
                                            />
                                        </div>
                                        {content}
                                        {/* <button */}
                                        <div
                                            ref={ref} disabled={!hasNextPage || isFetchingNextPage}
                                            onClick={() => fetchNextPage()}>
                                            {isFetchingNextPage ? <p> Loaddinng more... </p> : hasNextPage ? <p>Loadmore</p> : <p> No more Images </p>}
                                        </div>
                                        {isFetchingNextPage && <Loader />}
                                        {/* </button> */}
                                    </div>
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
