'use client'

import React, {useEffect, useMemo} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {createHTMLWithDiff} from '@/app/lib/CreateHtmlWithDiff'
import {IHistory, IPagination} from '@/app/types/History';
import Pagination from "@/app/components/Shared/Pagination";
import './History.css'

const PAGINATION_MAX_ITEMS = 10;

const History = ({history, getHistory, pagination}: {history: IHistory[]; getHistory: (page: number | undefined)=>void; pagination: IPagination}) => {
    const pages = useMemo(() => {
        return Math.ceil(pagination.count/PAGINATION_MAX_ITEMS);
    }, [pagination]);

    const page = useMemo(() => {
        return pages
    }, []);


    const handleDelete = (id: number)=> async ()=> {
        try {
            await axios.delete(`http://localhost:8000/history/${id}`);
            await getHistory(1);
        } catch (error) {
            console.error(`[ERROR] ${error}`);
        }
    }

    const handleClickPage = (idx: number) => {
        getHistory(idx)
    }

    useEffect(() => {
        getHistory(1)
    }, []);

    return (
        <>
            <div className={'tab'}>History</div>
            <div className={'history_area'}>
                <div className={'info_box'}>
                    <span className={'indicator-red'}>삭제됨</span>
                    <span className={'indicator-green'}>대체되거나 추가됨</span>
                </div>
                {history?.map(({id, text, diff, created_at}: IHistory) => {
                    const resultText = `${createHTMLWithDiff(diff)}`

                    return (<div className={'history_box flex_row'} key={id}>
                        <div className={'flex_item'}>{text}</div>
                        <div className={'flex_item flex_col'}>
                            <div dangerouslySetInnerHTML={{__html: resultText}}></div>
                            <div className={'bottom-left'}>{dayjs(created_at).format('YYYY.MM.DD HH:mm:ss')}</div>
                            <div className={'buttons'}>
                                <button onClick={handleDelete(id)} className={'button right'}>삭제</button>
                            </div>
                        </div>
                    </div>)
                })}
                {history?.length && <Pagination count={pagination.count} page={page} pages={pages} setPage={handleClickPage} />}
            </div>
        </>
    );
}

export default History;