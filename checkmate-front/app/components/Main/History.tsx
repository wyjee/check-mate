'use client'

import React, {useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import './History.css'
import DiffMatchPatch from "diff-match-patch";
import dayjs from "dayjs";

interface History {
    id: number;
    text: string;
    diff: [number, string][];
    created_at: string;
};

const dmp = new DiffMatchPatch();

const History = () => {
    const [history, setHistory] = useState<History[]>([])

    const getHistory = async ()=> {
        const {data} = await axios.get('http://localhost:8000/history');
        setHistory(data);
        console.log(data)
    }

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
                {history?.map(({id, text, diff, created_at}: History) => {
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