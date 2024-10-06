'use client'

import axios from "axios";
import {useState} from "react";

import Translation from "@/app/components/Main/Translation";
import History from "@/app/components/Main/History"
import {IHistory} from "@/app/types/History";

export default function Home () {
    const [history, setHistory] = useState<IHistory[]>([]);
    const getHistory = async ()=> {
        const {data} = await axios.get('http://localhost:8000/history');
        setHistory(data);
    }

    return (
        <main className={'main flex_col'}>
            <Translation getHistory={getHistory} />
            <History history={history} getHistory={getHistory} />
        </main>
    )
}