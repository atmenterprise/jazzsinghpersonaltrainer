import React from 'react';
import { programmeBlocks } from '../utils/programmeCopy';

function InlineCopy({ text }) {
  return text.split(/(\[[^\]]+\]\(\/booking#book\)|\n)/g).map((part, index) => {
    if (part === '\n') return <br key={index} />;
    const link = part.match(/^\[([^\]]+)\]\(\/booking#book\)$/);
    return link ? <a key={index} href="/booking#book">{link[1]}</a> : part;
  });
}
export default function ProgrammeCopy({ text, introduction = false, highlightFirst = false }) {
  return programmeBlocks(text).map((block, index) => block.type === 'list'
    ? <ul className="programme-inclusions" key={index}>{block.items.map((item, i) => <li className="list-padding" key={i}><InlineCopy text={item} /></li>)}</ul>
    : <p className={introduction ? `lead${highlightFirst && index === 0 ? ' highlight' : ''}` : 'text-justify'} key={index}><InlineCopy text={block.text} /></p>);
}
