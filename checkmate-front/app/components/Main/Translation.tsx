'use client'

import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import OpenAI from 'openai';
import DiffMatchPatch from 'diff-match-patch';
import Loader from '../Shared/Loader';
import {createHTMLWithDiff} from '@/app/lib/CreateHtmlWithDiff'
import './Translation.css'

const config = {
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
};
const openai = new OpenAI(config);
const openaiModel = 'gpt-3.5-turbo'
const LANGUAGE = {
    KOREAN: 'Korean',
    ENGLISH: 'English',
    ORIGINAL: 'the original language',
}

const dmp = new DiffMatchPatch();

const Main = ({getHistory}: {getHistory: ()=>void})=> {
    const [text, setText] = useState("");
    const [fixedText, setFixedText] = useState("");
    const [words, setWords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [fixed, setFixed] = useState(true);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
    const [language, setLanguage] = useState<string>(LANGUAGE.ORIGINAL);

    const callOpenAi = async () => {
        try {
            setFixed(false);
            const params = {
                model: openaiModel,
                messages: [
                    {
                        "role": "system",
                        "content": `You will be provided with statements, and your task is to convert them to standard Language in ${language}.`
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
            const res = await openai.chat.completions.create(params);
            const message = res.choices[0]?.message?.content;

            if (!message) return alert('번역 결과가 존재하지 않습니다.')
            setFixedText(message)
            setFixed(true);
        } catch (error) {
            setFixed(true);
            console.error(`[ERROR] ${error}`);
        }
    }

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (timeoutId) clearTimeout(timeoutId);
        const id: NodeJS.Timeout = setTimeout(()=> {
            setWords(countWords(text));
            clearTimeout(timeoutId);
            console.log('serWords', setWords,
                'timeoutId', timeoutId);
        },500)
        setTimeoutId(id);

    }

    const countWords = (str: string)=> {
        const matches = str.match(/[\w\d\’\'-가-힣]+|[\uAC00-\uD7A3]+/gi);
        return matches ? matches.length : 0;
    }

    const handleSave= async () => {
        if (!text) return alert('입력된 내용이 존재하지 않습니다.\n첨삭 받을 내용을 입력해 첨삭 결과를 저장해보세요.');
        if (!fixedText) return alert('첨삭 결과가 존재하지 않습니다. 첨삭 버튼을 눌러 첨삭 내용을 저장해보세요.');
        await axios.post('http://localhost:8000/history', {
            text: text,
            diff: dmp.diff_main(text, fixedText)
        })
        alert('저장되었습니다.');
        await getHistory();
    }

    const initialize = () => {
        setText('');
        setWords(0);
        setFixedText('')
        setLanguage(LANGUAGE.ORIGINAL);
    }

    const handleSubmit = () => {
        callOpenAi();
    };

    const handleCopy = async () => {
        if(!fixedText) return alert('첨삭 결과가 존재하지 않습니다. 첨삭 버튼을 눌러 첨삭 내용을 저장해보세요.')
        try {
            await navigator.clipboard.writeText(fixedText);
            alert('클립보드에 복사되었습니다.');
        } catch (error) {
            console.error('[ERROR] ', error);
        }
    };

    const resultText = useMemo(() => {
        return `${createHTMLWithDiff(dmp.diff_main(text, fixedText))}`
    }, [fixedText]);

    const setLanguageToKorean = () => {
        if(language === LANGUAGE.KOREAN) setLanguage(LANGUAGE.ORIGINAL);
        else setLanguage(LANGUAGE.KOREAN);
    }

    const setLanguageToEnglish = () => {
        if(language === LANGUAGE.ENGLISH) setLanguage(LANGUAGE.ORIGINAL);
        else setLanguage(LANGUAGE.ENGLISH);
    }

    useEffect(() => {
        if (!fixed && !loading) return setLoading(true);
        setLoading(false);
    }, [fixed]);

    useEffect(() => {
        if(!text && fixedText) return initialize();
    }, [text, fixedText]);

    return (
        <div className={'translation_area flex_row'}>
            <div className={'translation_box'}>
                <textarea
                    className={'textarea'}
                    placeholder="내용을 입력해주세요."
                    onChange={handleTextChange}

                    value={text}
                />
                <div className={'tags'}>
                    <span onClick={setLanguageToKorean} className={`${language === 'Korean' ? 'marked':''} tag`}>한글로 바꾸기</span>
                    <span onClick={setLanguageToEnglish} className={`${language === 'English' ? 'marked':''} tag`}>영어로 바꾸기</span>
                </div>
                <div className="buttons">
                    <span className={'flex_item'}>글자 수: {words}</span>
                    <div className={'flex_item flex_end'}>
                        <button type="button" onClick={initialize} className={'button'} >
                            입력창 초기화
                        </button>
                        <button type="button"
                                disabled={!words || loading}
                                onClick={handleSubmit}
                                className={'button'}
                        >
                            {!loading ? <span>첨삭</span> : <Loader/>}
                        </button>
                    </div>
                </div>
            </div>
            <div className={'result_box'}>
                <div className={'textarea'}><div dangerouslySetInnerHTML={{__html: resultText}}></div></div>
                <div className={'buttons flex_end'}>
                    <button onClick={handleSave} className={'button'}>저장</button>
                    <button onClick={handleCopy} className={'button'}>복사</button>
                </div>
            </div>
        </div>
    )
}

export default Main;