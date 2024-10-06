'use client'

import React, {useEffect} from 'react';
import './History.css'
import dayjs from "dayjs";
import {IHistory} from '@/app/types/History';

const History = ({history, getHistory}: {history: IHistory[]; getHistory: ()=>void; }) => {
    useEffect(() => {
        console.log('props changed',history)
    }, [history]);

    const createHTMLWithDiff = (diff: [number, string][]) => {
        let result = '';

        diff.forEach(([operation, char]) => {
            switch (operation) {
                case -1: // 삭제된 경우
                    result += `<span class="underline-red">${char}</span>`;
                    break;
                case 1: // 추가된 경우
                    result += `<span class="underline-green">${char}</span>`;
                    break;
                case 0: // 변화 없는 경우
                    result += char;
                    break;
            }
        });

        return result;
    }

    useEffect(() => {
        getHistory()
    }, []);
    return (
        <>
            <div className={'tab'}>History</div>
            <div className={'history_area'}>
                {history?.map(({id, text, diff, created_at}: IHistory) => {
                    const resultText = `${createHTMLWithDiff(diff)}`

                    return (<div className={'history_box flex_row'} key={id}>
                        <div className={'flex_item'}>{text}</div>
                        <div className={'flex_item flex_col'}>
                            <div>{dayjs(created_at).format('YYYY.MM.DD HH:mm:ss')}</div>
                            <div dangerouslySetInnerHTML={{__html: resultText}}></div>
                        </div>
                    </div>)
                })}
                <div className={'info_box'}>
                    <span className={'indicator-red'}>red (deleted)</span>
                    <span className={'indicator-green'}>green (replaced or added)</span>
                </div>
            </div>
        </>
    );
}

export default History;