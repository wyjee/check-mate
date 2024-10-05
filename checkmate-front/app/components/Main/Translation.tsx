'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import OpenAI from "openai";
import DiffMatchPatch from 'diff-match-patch';
import Loader from '../Shared/Loader';
import './Translation.css'

const config = {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
};
const openai = new OpenAI(config);
const openaiModel = 'gpt-3.5-turbo'

const dmp = new DiffMatchPatch();

const Main = ()=> {
    const [text, setText] = useState("");
    const [fixedText, setFixedText] = useState("");
    const [words, setWords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fixed, setFixed] = useState(false);
    const [language, setLanguage] = useState("en");
    const langPairs: {
        [key: string]: string
    } = {
        en: 'English',
        kr: 'Korean'
    }

    const callOpenAi = async () => {

        setFixed(true);
        const params = {
            model: openaiModel,
            messages: [
                {
                    "role": "system",
                    "content": `You will be provided with statements, and your task is to convert them to standard ${langPairs[language]}.`
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature: 0.7,
            max_tokens: 64,
            top_p: 1
        }
        // const res = await openai.chat.completions.create(params);
        // const data = res.choices[0]?.message?.content;
        // const message = data.text;

        const message = "She did not go to the market."
        const diff = dmp.diff_main(text, message);
        console.log(diff);
        setFixedText(message)

        setFixed(false);

    }

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
        callOpenAi()
    }

    useEffect(() => {
        if (loading || !fixed) return;

        try {
            setLoading(true);
        } catch (error) {
            return console.error(`[ERROR] ${error}`);
        }
    }, [fixed]);

    return (
        <div className={'flex_row'}>
            <div className={'translation_box left'}>
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
                    </div>
                </div>
            </div>
            <div className={'result_box right'}>
                <textarea
                    className={'textarea'}
                    value={fixedText}
                    readOnly={true}
                />
                <div className={'buttons flex_right'}>
                    <button onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    )
}

export default Main;