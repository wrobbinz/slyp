import { Quill } from 'react-quill';
import HorizontalRule from './hr';


Quill.register('formats/horizontal', HorizontalRule);

class MarkdownShortcuts {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;

    this.ignoreTags = ['PRE'];
    this.formats = [
      {
        name: 'header',
        pattern: /^(#){1,6}\s/g,
        action: (text, selection, pattern) => {
          const match = pattern.exec(text);
          if (!match) return;
          const size = match[0].length;
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 0, 'header', size - 1);
            this.quill.deleteText(selection.index - size, size);
          }, 0);
        },
      },
      {
        name: 'blockquote',
        pattern: /^(>)\s/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'blockquote', true);
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'code-block',
        pattern: /^`{3}(?:\s|\n)/g,
        action: (text, selection) => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'code-block', true);
            this.quill.deleteText(selection.index - 4, 4);
          }, 0);
        },
      },
      {
        name: 'bolditalic',
        pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true, italic: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'bold',
        pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'italic',
        pattern: /(?:\/){1}(.+?)(?:\/){1}/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { italic: true });
            this.quill.format('italic', false);
          }, 0);
        },
      },
      {
        name: 'underline',
        pattern: /(?:_){1}(.+?)(?:_){1}/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { underline: true });
            this.quill.format('underline', false);
          }, 0);
        },
      },
      {
        name: 'strikethrough',
        pattern: /(?:~~)(.+?)(?:~~)/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { strike: true });
            this.quill.format('strike', false);
          }, 0);
        },
      },
      {
        name: 'highlight',
        pattern: /(?:::)(.+?)(?:::)/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { background: '#ffa8a8' });
            this.quill.format('background', false);
          }, 0);
        },
      },
      {
        name: 'code',
        pattern: /(?:`)(.+?)(?:`)/g,
        action: (text, selection, pattern, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) return;

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { code: true });
            this.quill.format('code', false);
            this.quill.insertText(this.quill.getSelection(), ' ');
          }, 0);
        },
      },
      {
        name: 'hr',
        pattern: /^([-*]\s?){3}/g,
        action: (text, selection) => {
          const startIndex = selection.index - text.length;
          setTimeout(() => {
            this.quill.deleteText(startIndex, text.length);

            this.quill.insertEmbed(startIndex, 'hr', true, Quill.sources.USER);
            // this.quill.insertText(startIndex + 2, '\n', Quill.sources.SILENT);
            this.quill.setSelection(startIndex + 2, Quill.sources.SILENT);
          }, 0);
        },
      },
      {
        name: 'asterisk-ul',
        pattern: /^(\*|\+)\s$/g,
        action: (text, selection) => {
          setTimeout(() => {
            this.quill.formatLine(selection.index, 1, 'list', 'unordered');
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'image',
        pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)[0];
          // const hrefText = text.match(/(?:!\[(.*?)\])/g)[0]
          const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.quill.deleteText(start, matchedText.length);
              this.quill.insertEmbed(start, 'image', hrefLink.slice(1, hrefLink.length - 1));
            }, 0);
          }
        },
      },
      {
        name: 'link',
        pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
        action: (text, selection, pattern) => {
          const startIndex = text.search(pattern);
          const matchedText = text.match(pattern)[0];
          const hrefText = text.match(/(?:\[(.*?)\])/g)[0];
          const hrefLink = text.match(/(?:\((.*?)\))/g)[0];
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.quill.deleteText(start, matchedText.length);
              this.quill.insertText(
                start,
                hrefText.slice(1, hrefText.length - 1),
                'link',
                hrefLink.slice(1, hrefLink.length - 1),
              );
            }, 0);
          }
        },
      },
    ];

    /* Handler that looks for insert deltas that match specific characters */
    this.quill.on('text-change', (delta, oldContents, source) => {
      delta.ops.forEach((op) => {
        const hasInsert = Object.prototype.hasOwnProperty.call(op, 'insert');
        // const hasDelete = Object.prototype.hasOwnProperty.call(op, 'delete');
        if (hasInsert) {
          if (op.insert === ' ') {
            this.onSpace();
          } else if (op.insert === '\n') {
            this.onEnter();
          }
        }
        // if (hasDelete && source === 'user') {
        //   this.onDelete();
        // }
      });
    });
  }

  isValid(text, tagName) {
    return (
      typeof text !== 'undefined' &&
      text &&
      !this.ignoreTags.includes(tagName)
    );
  }

  onSpace() {
    const selection = this.quill.getSelection();
    if (!selection) return;
    const [line, offset] = this.quill.getLine(selection.index);
    const text = line.domNode.textContent;
    const lineStart = selection.index - offset;
    if (this.isValid(text, line.domNode.tagName)) {
      const match = this.formats.find(format => text.match(format.pattern));
      if (match) {
        console.log('matched:', match.name, text);
        match.action(text, selection, match.pattern, lineStart);
      }
    }
  }

  onEnter() {
    const selection = this.quill.getSelection();
    if (!selection) return;
    const [line, offset] = this.quill.getLine(selection.index);
    let text = line.domNode.textContent;
    if (text.includes('`')) { text = `${text} `; }
    const lineStart = selection.index - offset;
    selection.length = selection.index + 1;
    if (this.isValid(text, line.domNode.tagName)) {
      const match = this.formats.find(format => text.match(format.pattern));
      if (match) {
        console.log('matched:', match.name, text);
        match.action(text, selection, match.pattern, lineStart);
      }
    }
  }

  onDelete() {
    const selection = this.quill.getSelection();
    if (!selection) return;
    const [line, offset] = this.quill.getLine(selection.index);
    if (offset === 0) {
      setTimeout(() => {
        if (selection.length === 0) {
          this.quill.removeFormat(selection.index - offset, selection.index);
        }
      }, 0);
    }
  }
}

export default MarkdownShortcuts;