module.exports = {
  presets: [
    ['@babel/preset-env'],
    '@babel/preset-react',
  ],
  plugins: ["@babel/plugin-transform-arrow-functions", "transform-es2015-modules-commonjs"]
};