'use babel'

import { CompositeDisposable } from 'atom'

// const dictionaryPattern = /lang\s*=\s*'([^']*)'/im
const wordPattern = /\w[^A-Z_]*/g
const grammarScopes = [
  'source.ruby',
  'source.embedded.ruby', // language-asciidoc, language-gfm
  'embedded.source.ruby'  // language-markdown
]

export default {
  disposables: null,

  provideGrammar () {
    function checkComments () {
      return atom.config.get('linter-spell-ruby.checkComments')
    }

    return [{
      grammarScopes: grammarScopes,
      checkedScopes: {
        'source.ruby': true,
        'source.embedded.ruby': true,
        'embedded.source.ruby': true,
        'comment.line.number-sign.ruby': checkComments,
        'keyword.control.ruby': false,
        'support.function.kernel.ruby': false,
        'keyword.control.start-block.ruby': false,
        'keyword.control.pseudo-method.ruby': false,
        'constant.language.nil.ruby': false,
        'variable.language.self.ruby': false,
        'constant.language.boolean.ruby': false,
        'keyword.other.special-method.ruby': false,
        'keyword.control.def.ruby': false,
        'constant.numeric.ruby': false
      },
      filterRanges: (textEditor, ranges) => {
        let newRanges = []
        for (const searchRange of ranges) {
          textEditor.scanInBufferRange(wordPattern, searchRange, ({range}) => {
            newRanges.push(range)
          })
        }
        return {
          ranges: newRanges,
          ignoredRanges: []
        }
      }
    }]
  },

  provideDictionary () {
    let wordList = require('linter-spell-word-list')
    let a = new wordList.ConfigWordList({
      name: 'Ruby',
      keyPath: 'linter-spell-ruby.words',
      grammarScopes: grammarScopes
    })
    this.disposables.add(a)
    return a.provideDictionary()
  },

  activate () {
    this.disposables = new CompositeDisposable()
    require('atom-package-deps').install('linter-spell-ruby')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })
  },

  deactivate () {
    this.disposables.dispose()
  }
}
