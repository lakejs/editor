import type { Translation } from '../types';
import { modifierText } from '../../utils/modifier-text';

export default {
  toolbar: {
    undo: `작업취소 (${modifierText('mod+Z')})`,
    redo: `다시 실행 (${modifierText('mod+Y')})`,
    selectAll: `전체 선택 (${modifierText('mod+A')})`,
    paragraph: '텍스트',
    blockQuote: '인용문',
    numberedList: '순서 목록',
    bulletedList: '비순서 목록',
    checklist: '체크리스트',
    alignLeft: '왼쪽 정렬',
    alignCenter: '가운데 정렬',
    alignRight: '오른쪽 정렬',
    alignJustify: '좌우로 정렬',
    increaseIndent: '들여쓰기 증가',
    decreaseIndent: '들여쓰기 줄이기',
    bold: `굵게 (${modifierText('mod+B')})`,
    italic: `기울임꼴 (${modifierText('mod+I')})`,
    underline: `밑줄 (${modifierText('mod+U')})`,
    strikethrough: '취소선',
    superscript: '위첨자',
    subscript: '아래 첨자',
    code: '인라인 코드',
    removeFormat: '형식 지우기',
    formatPainter: '형식 복사기',
    link: '링크',
    hr: '구분선',
    video: '동영상',
    codeBlock: '코드 블록',
    heading: '제목',
    heading1: '제목 1',
    heading2: '제목 2',
    heading3: '제목 3',
    heading4: '제목 4',
    heading5: '제목 5',
    heading6: '제목 6',
    list: '목록',
    align: '정렬',
    indent: '들여쓰기',
    fontFamily: '글꼴',
    fontSize: '글자 크기',
    moreStyle: '더 많은 스타일',
    fontColor: '글자 색상',
    highlight: '글자 배경',
    image: '이미지',
    file: '파일',
    emoji: '이모지',
    equation: '수학 공식',
    removeColor: '기본 색상',
  },
  slash: {
    heading1: '제목 1',
    heading1Desc: '1 단계 제목을 작성',
    heading2: '제목 2',
    heading2Desc: '2 단계 제목을 작성',
    heading3: '제목 3',
    heading3Desc: '3 단계 제목을 작성',
    heading4: '제목 4',
    heading4Desc: '4 단계 제목을 작성',
    heading5: '제목 5',
    heading5Desc: '5 단계 제목을 작성',
    heading6: '제목 6',
    heading6Desc: '6 단계 제목을 작성',
    paragraph: '텍스트',
    paragraphDesc: '단락을 작성',
    blockQuote: '인용문',
    blockQuoteDesc: '인용문을 작성',
    numberedList: '순서 목록',
    numberedListDesc: '순서 목록을 작성',
    bulletedList: '비순서 목록',
    bulletedListDesc: '비순서 목록을 작성',
    checklist: '체크리스트',
    checklistDesc: '체크리스트를 작성',
    hr: '구분선',
    hrDesc: '구분선을 삽입',
    codeBlock: '코드 블록',
    codeBlockDesc: '코드 블록을 삽입',
    video: '동영상',
    videoDesc: '유튜브 동영상을 삽입',
    equation: '수학 공식',
    equationDesc: 'TeX 수식을 삽입',
    image: '이미지',
    imageDesc: '이미지를 업로드',
    file: '파일',
    fileDesc: '파일을 업로드',
  },
  link: {
    newLink: '새 링크',
    url: '링크 URL',
    title: '링크 텍스트',
    copy: '클립보드에 복사',
    open: '링크 열기',
    save: '저장',
    unlink: '링크 제거',
  },
  image: {
    view: '큰 이미지 보기',
    remove: '삭제',
    previous: '이전 이미지',
    next: '다음 이미지',
    close: '닫기 (Esc)',
    loadingError: '이미지를 로드할 수 없습니다',
    zoomOut: '축소',
    zoomIn: '확대',
    align: '정렬',
    alignLeft: '왼쪽 정렬',
    alignCenter: '가운데 정렬',
    alignRight: '오른쪽 정렬',
    resize: '이미지 크기 조정',
    pageWidth: '페이지 너비',
    originalWidth: '원본 이미지 크기',
    imageWidth: '{0} 이미지 크기',
    open: '새 탭에서 이미지 열기',
    caption: '캡션',
    captionPlaceholder: '캡션을 입력하세요',
  },
  file: {
    download: '다운로드',
    remove: '삭제',
  },
  video: {
    embed: '동영상 삽입',
    remove: '삭제',
    description: '아래 입력란에 YouTube 링크를 붙여넣으세요.',
    url: '링크',
    urlError: '유효한 링크를 입력하세요.',
  },
  codeBlock: {
    langType: '코드 언어 선택',
  },
  equation: {
    save: '저장',
    help: '지원되는 기능',
    placeholder: 'TeX 수식을 입력하세요',
  },
} satisfies Translation;
