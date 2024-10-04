'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import OpenAI from "openai";
import Loader from './Loader';

import './index.css';

const configuration = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    dangerouslyAllowBrowser: true
};
const openai = new OpenAI(configuration);

const Main = ()=> {
    const [isAlready, setAlready] = useState(false);
    const [text, setText] = useState("");
    // const [previousText, setPreviousText] = useState("");
    const [words, setWords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [corrected, setCorrected] = useState(false);

    const ping = async () => {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: 'Hello!',
                },
            ],
        });

        console.log(response._request_id);
    }

    // const callOpenAi = async () => {
    //     const res = await fetch("/api/openai", {
    //         method: "POST",
    //         body: JSON.stringify({
    //             name: text
    //         }),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    //         },
    //     })
    //     const data = await res.json();
    //     const message = data.text;
    //     let i = -1;
    //
    //     setText("");
    //
    //     const typingEffect = setInterval(() => {
    //         setText((prevText) => prevText + message[i]);
    //         i++;
    //
    //         if (i === message.length - 1) {
    //             clearInterval(typingEffect);
    //
    //             setWords(countWords(text));
    //             setCorrected(false);
    //             setLoading(false);
    //         }
    //     }, 50);
    // }

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setWords(countWords(e.target.value));
    }

    const countWords = (str: string)=> {
        const matches = str.match(/[\w\d\’\'-]+/gi);
        return matches ? matches.length : 0;
    }

    const handleSave= () => {
        alert('저장되었습니다.')
    }

    const handleInitialization = () => {
        setText('');
        setWords(countWords(text));
    }

    const handleSubmit = () => {
        setCorrected(true);
    }

    useEffect(() => {
        if (loading || !corrected) return;
        ping(); // should be removed

        try {
            setLoading(true);
            // setPreviousText(text);
        } catch (error) {
            return console.error(`[ERROR] ${error}`);
        }
    }, [corrected]);

    return (
        <div>
            <div className={'translation_box'}>
                <textarea
                    className={'textarea'}
                    placeholder="내용을 입력해주세요."
                    onChange={handleTextChange}
                    value={text}
                />

                <div className="buttons">
                    <span className={'left'}>글자 수: {words}</span>
                    <div className={'right'}>
                        <button type="button" onClick={handleInitialization}>
                            입력창 초기화
                        </button>
                        <button type="button"
                                disabled={!words}
                                onClick={handleSubmit}
                        >
                            {!loading ? <span>첨삭</span> : <Loader/>}
                        </button>
                        <button onClick={handleSave}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;