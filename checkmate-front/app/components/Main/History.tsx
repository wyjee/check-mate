'use client'

import React, {useEffect} from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {createHTMLWithDiff} from '@/app/lib/CreateHtmlWithDiff'
import {IHistory} from '@/app/types/History';
import './History.css'

const History = ({history, getHistory}: {history: IHistory[]; getHistory: ()=>void; }) => {
    const handleDelete = (id: number)=> async ()=> {
        try {
            await axios.delete(`http://localhost:8000/history/${id}`);
            await getHistory();
        } catch (error) {
            console.error(`[ERROR] ${error}`);
        }
    }

    useEffect(() => {
        getHistory()
    }, []);

    return (
        <>
            <div className={'tab'}>History</div>
            <div className={'history_area'}>
                <div className={'info_box'}>
                    <span className={'indicator-red'}>deleted</span>
                    <span className={'indicator-green'}>replaced or added</span>
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
            </div>
        </>
    );
}

export default History;