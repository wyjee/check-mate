'use client'

import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import OpenAI from "openai";
import DiffMatchPatch from 'diff-match-patch';
import Loader from '../Shared/Loader';
import './Translation.css'
import axios from "axios";

const config = {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
};
const openai = new OpenAI(config);
const openaiModel = 'gpt-3.5-turbo'

const dmp = new DiffMatchPatch();

const Main = (props: any)=> {
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

    const handleSave= async () => {
        if (!text) return alert('입력된 내용이 존재하지 않습니다.\n첨삭 받을 내용을 입력해 첨삭 결과를 저장해보세요.');
        if (!fixedText) return alert('첨삭 결과가 존재하지 않습니다. 첨삭 버튼을 눌러 첨삭 내용을 저장해보세요.');
        const response = await axios.post('http://localhost:8000/history', {
            text: text,
            diff: dmp.diff_main(text, fixedText)
        })
        console.log('저장 결과',response)
        alert('저장되었습니다.')
        await props.getHistory();
    }

    const handleInitialization = () => {
        setText('');
        setWords(countWords(text));
    }

    const handleSubmit = () => {
        callOpenAi()
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

    const resultText = useMemo(() => {
        return `${createHTMLWithDiff(dmp.diff_main(text, fixedText))}`
    }, [fixedText]);

    useEffect(() => {
        if (loading || !fixed) return;

        try {
            setLoading(true);
        } catch (error) {
            return console.error(`[ERROR] ${error}`);
        }
    }, [fixed]);

    return (
        <div className={'translation_area flex_row'}>
            <div className={'translation_box'}>
                <textarea
                    className={'textarea'}
                    placeholder="내용을 입력해주세요."
                    onChange={handleTextChange}
                    value={text}
                />

                <div className="buttons">
                    <span>글자 수: {words}</span>
                    <div>
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
            <div className={'result_box'}>
                <div className={'textarea'}><div dangerouslySetInnerHTML={{__html: resultText}}></div></div>
                <div className={'buttons flex_right'}>
                    <button onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    )
}

export default Main;