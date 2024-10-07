'use client'

import axios from "axios";
import {useState} from "react";

import Translation from "@/app/components/Main/Translation";
import History from "@/app/components/Main/History"
import {IHistory, IPagination} from "@/app/types/History";

export default function Home () {
    const [history, setHistory] = useState<IHistory[]>([]);
    const [pagination, setPagination] = useState<IPagination>({} as IPagination);
    const getHistory = async (page: number=1)=> {
        const {data} = await axios.get('http://localhost:8000/history?page=' + page);
        setHistory(data?.results);
        setPagination({
            count: data?.count,
            next: data?.next,
            previous: data?.previous
        })
    }

    return (
        <main className={'main flex_col'}>
            <Translation getHistory={getHistory} />
            <History pagination={pagination} history={history} getHistory={getHistory} />
        </main>
    )
}