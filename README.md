해당 레포지토리는 openai api를 사용하며, 아래 요구조건을 바탕으로 작성하였습니다.

<h2>AI 문법 검수 웹사이트</h2>

<b>주요 기능:</b>
문법 자동 첨삭: 사용자가 작성한 한국어 또는 영어 문장을 AI가 분석하여 문법 오류를 찾아내고 수정합니다.
시각적 피드백: 수정된 부분은 빨간색(삭제), 초록색(추가)으로 표시하여 직관적으로 확인할 수 있도록 합니다.
문서 저장: 첨삭된 문서를 데이터베이스에 저장하여 사이트 내에서 다시 확인할 수 있습니다.

<b>기술 스택:</b>
프론트엔드: Next.js 또는 다른 React 기반 프레임워크를 사용하여 사용자 인터페이스를 구현합니다.
백엔드: FastAPI, Django, Flask 중 하나를 선택하여 서버를 구축하고, AI 모델과 데이터베이스를 연결합니다.
데이터베이스: Asynchronous 데이터베이스(PostgreSQL, MySQL, NoSQL 등)를 사용하여 문서를 저장합니다.
AI 모델: ChatGPT, Claude, Llama와 같은 LLM 또는 LanguageTool과 같은 오픈 소스 API를 활용하여 문법 첨삭 기능을 구현합니다.

<b>추가 고려 사항:</b>
Diff-match-patch 라이브러리: 수정 전후의 문장을 비교하여 차이점을 시각적으로 보여주는 데 활용할 수 있습니다.
ChatGPT API: 필요한 경우 제공받아 ChatGPT 모델을 활용할 수 있습니다.


checkmate-front 는 프론트 화면 구현 Next.js 앱입니다.
server 는 api 서버 구현 Django 앱입니다.
데이터베이스는 MySQL을 사용하였습니다.
구현 과정의 참고자료는 해당 링크([노션 링크](https://nlogn.notion.site/Ai-Grammar-Checker-11556075d14180a0ba28c0250a0b0220?pvs=4))에 작성하였습니다.

```
// Checkmate-Front 서버 실행
cd ./checkmate-front
npm i
vi ./.env // .env 내 아래 API 키를 생성하여 저장
npm run dev
// localhost:3000 으로 연결
cd ../
```

```
// .env
NEXT_PUBLIC_OPENAI_API_KEY=

// [API_KEY ](https://platform.openai.com/settings/profile?tab=api-keys) 사이트 내 projects api_keys 화면으로 이동
// https://platform.openai.com/api-keys 화면에서 API 키를 생성하여 사용하였습니다.
```

```
// Checkmate-Server 서버 실행
cd ./server
pip3 install virtualenv
virtualenv venv
source venv/bin/activate

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
// localhost:8000 으로 연결
cd ../
```

localhost:3000 으로 아래 화면을 확인할 수 있습니다. 
<img width="1075" alt="스크린샷 2024-10-07 오전 11 58 02" src="https://github.com/user-attachments/assets/6f24c657-e322-41be-b6df-2df0f0eb1a77">

https://github.com/user-attachments/assets/8a2359b8-562f-48d6-b5dc-2fbdf5f83ae7

