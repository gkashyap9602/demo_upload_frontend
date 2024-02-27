import React from "react";
import { CCard, CCardBody } from "@coreui/react";
import { Skeleton } from "@mui/material";

export const ImageSkeleton = () => {
  // Dummy data to generate placeholders
  const data = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 }
  ];

  return (
    <CCard className="cardImage mb-0 mt-2">
      <CCardBody className="browse_img">
        <div className="horizontal-scroll">
          {data.map((item) => (
            <div key={item.id} className="itemGallery">
              <span className="position-absolute">
                <span className="testSpan"></span>
              </span>
              <label htmlFor={`check${item.id}`} className="upload_img mb-0 position-relative">
                <Skeleton
                  variant="rectangulara"
                  width={86}
                  height={71}
                  style={{ borderRadius: "4px" }}
                />
              </label>
            </div>
          ))}
        </div>
      </CCardBody>
      {/* <div className={style.pagination}>
      </div> */}
    </CCard>
  );
};
