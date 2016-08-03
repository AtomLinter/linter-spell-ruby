'use babel'

// const dictionaryPattern = /lang\s*=\s*'([^']*)'/im
const wordPattern = /\w[^A-Z_]*/g

export default {
  argumentPattern: null,
  environmentPattern: null,

  provideGrammar () {
    function checkComments () {
      return atom.config.get('linter-spell-ruby.checkComments')
    }

    return [{
      grammarScopes: [
        'source.ruby',
        'source.embedded.ruby', // language-asciidoc, language-gfm
        'embedded.source.ruby'  // language-markdown
      ],
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

  activate () {
    require('atom-package-deps').install('linter-spell-ruby')
      .then(() => {
        console.log('All dependencies installed, good to go')
      })
  },

  deactivate () {
  }
}
