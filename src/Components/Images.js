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
// const queryClient = new QueryClient();
// import io from 'socket.io-client';
import { Button, Image, Pagination, Spin } from 'antd';

const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024 * 1024; // 1GB in bytes
// const socket = io('http://localhost:4300'); // Connect to your socket server

const Images = () => {
    const [fileObjects, setFileObjects] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])

    const [pagination, setPagination] = useState({
        total: 1,
        currentPage: 1,
        limit: 33,
    });


    async function fetchImages1(currentPage) {
        try {
            // setLoading(true)
            const response = await axios.get(`${GET_UPLOAD_IMAGES}?pageSize=${pagination.limit}&page=${pagination.currentPage}`);
            return response.data; // Assuming API response has data field containing the actual data
        } catch (error) {
            throw new Error('Failed to fetch images');
        }
        finally {
            // setLoading(false)

        }
    }

    const { data, isLoading, isError, isSuccess, isRefetching, isPlaceholderData } = useQuery({
        queryKey: ['images', pagination.currentPage],
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
            console.log("dataresponseemmm", data)
            setImages(data?.data?.result)

            setPagination((prevPagination) => ({
                ...prevPagination,
                total: data?.data?.totalItems,
            }));
        }
    }, [data, pagination.currentPage])

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

                toast.success(response?.data?.message)
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


    return (
        <div className="gallery-container">
            <header className="header">Upload Images </header>
            {isLoading | loading ? (<>
                <Loader />
            </>) : (
                <>
                    <UploadImage onSubmit={uploadImages} handleOnChange={handleOnChange} show={show} setShow={setShow} />
                    {true ?
                        <main className="main-content container-fluid border">
                            <Spin spinning={loading}>
                                <div className="image-gallery">
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

                                                        <Image
                                                            src={`${BITBUCKET_URL}/${image.imageUrl}`}
                                                        // height={'12.5rem'}
                                                        />
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {/* {console.log(pagination, "paginationnnnn")} */}
                                    {pagination?.total > 0 &&
                                        <div className={style.pagination}>
                                            <PaginationComponent itemsCount={pagination.total} itemsPerPage={pagination.limit} currentPage={pagination.currentPage} setPagination={setPagination} />

                                        </div>
                                    }
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
