import React from "react"
import style from "./loader.module.css"
import { Spinner } from "reactstrap"

export const Loader = props => {
  return (
    <>
      <div className={style.loader}>
        <Spinner className={style.spinnerLoad}/>
        <span className="visually-hidden">Loading...</span>

      </div>
{/*     
      <div className={style["spinner-outer"]}>
        <div className={style.boxNew}>
          
          <div className={style.loaderNew}></div>
        </div>
        
        </div> */}

    </>
  )
}
