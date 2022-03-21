module.exports = {
  tagFormat: '${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', {
      releaseRules: [
        {
          type: 'ci',
          release: 'minor'
        },
        {
          type: 'test',
          release: 'patch'
        },
        {
          type: 'chore',
          release: 'patch'
        }
      ]
    }],
    '@semantic-release/release-notes-generator',
    '@semantic-release/github'
  ]
}
