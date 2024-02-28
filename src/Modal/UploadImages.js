import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import style from "./UploadImage.module.css";
import { toast } from "react-toastify";
// import { ADD_BROWSE_IMAGE } from "admin/Api/api";

export const UploadImage = (props) => {

    const { show, setShow, setUpload, onSubmit, handleOnChange } = props;

    const handleClose = () => setShow(false);

    return (
        <>
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton className={style.uploadHeader}>
                        <h5>Upload Image</h5>
                    </Modal.Header>
                    <form
                        encType="multipart/form-data"
                        onSubmit={(e) => {
                            onSubmit(e)
                        }}
                    >
                        <Modal.Body className={style.uploadBody}>
                            <div className="text-center">
                                <input 
                                onChange={(e) => handleOnChange(e.target.files)} 
                                type="file" name="name" multiple="multiple" required />

                            </div>
                        </Modal.Body>
                        <Modal.Footer className={style.uploadFooter}>
                            <Button
                                variant="light"
                                onClick={handleClose}
                                className={style.Btn}
                            >
                                Close
                            </Button>
                            <Button type="submit" className={style.uploadImageBtn}>
                                Upload
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
        </>
    );
};

