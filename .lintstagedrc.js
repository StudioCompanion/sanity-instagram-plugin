module.exports = {
  '*.{css,md}': 'yarn prettier:write',
  '*.{js,ts,tsx}': ['yarn prettier:write', 'yarn run lint'],
  '*.{ts,tsx}': () => 'yarn run test:ts',
}
