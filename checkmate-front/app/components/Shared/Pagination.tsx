'use client'

import React, {useMemo} from 'react';
import {IPaginationProps} from "@/app/types/History";
import './Pagination.css'

const Pagination = ({page, pages, setPage}: IPaginationProps)=> {
    const pageArray = useMemo(() => {
        return new Array(pages).fill(0)
    }, [pages]);

    return (
        <div className={'pagination'}>
            <div className={'pagination_buttons'}>
                {
                    pageArray.map((_, i) => (
                        <button className={`pagination_button ${i+1 === page ? 'marked' : ''}`}
                                key={i+1}
                                onClick={() => setPage(i+1)}>
                            {i+1}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Pagination;