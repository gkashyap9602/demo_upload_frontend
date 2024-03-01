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
import { useInfiniteQuery } from 'react-query'; // Import useInfiniteQuery
import { Button, Image, Pagination, Spin } from 'antd';
import ProgressiveImage from 'react-progressive-image';
import { useInView } from 'react-intersection-observer';

const MAX_FILE_SIZE_BYTES = 1.8 * 1024 * 1024 * 1024; // 1GB in bytes

const Images = () => {
    const [fileObjects, setFileObjects] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([]);

    const { ref, inView } = useInView({ threshold: 0.4 })

    const fetchImages = async (key, page = 1) => { // Modify fetch function to accept page parameter
        try {
            console.log("Fetching page:", page);
            const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=15&page=${page}`);
            return response.data?.data;
        } catch (error) {
            throw new Error('Failed to fetch images');
        }
    };

    const { data, fetchNextPage, hasNextPage, refetch, isLoading, isError, isSuccess, isFetching, status, isFetchingNextPage,
    } = useInfiniteQuery(
        {
            queryKey: ['images'],
            queryFn: () => fetchImages(),
            getNextPageParam: (lastPage, pages) => {
                // console.log(lastPage,"lastpages")
                // console.log(pages,"pages")
                return lastPage.length ? pages + 1 : undefined; // Return next page number if there is more data, else return undefined
            },
        },

    );

    const handleOnChange = (_files) => {
        setFileObjects(_files)
    }

    const handleScroll = async (e) => {
        e.preventDefault();
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading && !isFetching && images.length < data.pages[data.pages.length - 1].totalItems) {
            console.log("fetch again")
            // refetch()
            fetchNextPage(); // Fetch next page

            // fetchNextPage(); // Fetch next page
        }
    }

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
                                <div className="image-gallery" onScroll={handleScroll} >
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
                                        {
                                            data.pages.map((page) => (
                                                page.result.map((image, index) => (
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
                                                        </label>
                                                    </div>
                                                ))
                                            ))
                                        }
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
