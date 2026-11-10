export function programmeBlocks(text = '') {
  const blocks = [];
  for (const paragraph of text.replace(/\n(?=- )/g, '\n\n').split(/\n\s*\n/).filter(part => part.trim())) {
    const list = paragraph.trim().startsWith('- ');
    const content = paragraph.trim().replace(/^- /, '');
    if (list && blocks.at(-1)?.type === 'list') blocks.at(-1).items.push(content);
    else blocks.push(list ? { type: 'list', items: [content] } : { type: 'paragraph', text: content });
  }
  return blocks;
}

export function programmeSections(page) {
  return [
    ['audience', 'who-its-for'], ['included', 'whats-included'],
    ['results', 'your-results'], ['investment', 'your-investment'],
  ].filter(([key]) => page[key + '_content']?.trim()).map(([key, id]) => ({
    id, title: page[key + '_title'], text: page[key + '_content'],
  }));
}
